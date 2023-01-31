import {
  onCall,
  HttpsError,
  type FunctionsErrorCode,
} from "firebase-functions/v1/https";

import { firestore, auth } from "firebase-admin";

import { Timestamp } from "firebase-admin/firestore";

export const clearTab = onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new HttpsError("permission-denied", "Unknown origin");
  }
  if (
    !context?.auth?.token.admin &&
    context?.auth?.token.email !== data.email
  ) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to clear the tab"
    );
  }

  type TabItem = {
    name: string;
    price: number;
    date: Timestamp;
    paid: boolean;
    clearedBy?: string;
  };

  try {
    const user = await auth().getUserByEmail(data.email);
    const userRef = firestore().collection("users").doc(user.uid);

    return await firestore().runTransaction(async (t) => {
      // Get the user's tab
      const doc = await t.get(userRef);
      const tab = doc.data()?.tab;

      const currentTab: TabItem[] = tab || [];

      currentTab.forEach((item) => {
        item.paid = true;
      });

      const total = () => {
        let total = 0;
        currentTab.forEach((item) => {
          total += item.price;
        });
        return total;
      };

      const processedTab = [...currentTab];

      processedTab.push({
        name: "Tab cleared by " + user.displayName,
        price: total(),
        date: Timestamp.now(),
        clearedBy: user.displayName,
        paid: true,
      });

      console.log(processedTab);

      await t.update(userRef, {
        tab: processedTab,
      });

      return true;
    });
  } catch (error) {
    console.log(error);
    const { code, message } = error as {
      code: FunctionsErrorCode;
      message: string;
    };
    throw new HttpsError(code, message);
  }
});

export const clearHistory = onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new HttpsError("permission-denied", "Unknown origin");
  }
  if (!context?.auth?.token.admin) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to clear the history"
    );
  }

  try {
    const user = await auth().getUserByEmail(data.email);
    return firestore().doc(`users/${user.uid}`).update({
      tab: [],
    });
  } catch (error) {
    const { code, message } = error as {
      code: FunctionsErrorCode;
      message: string;
    };
    throw new HttpsError(code, message);
  }
});

export const toggleRole = onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new HttpsError("failed-precondition", "Unknown origin");
  }
  const { email, role } = data;

  const user = await auth().getUserByEmail(email);
  await auth()
    .setCustomUserClaims(user.uid, {
      [role]: !user.customClaims?.[role],
    })
    .catch((error) => {
      throw new HttpsError("unknown", error.message);
    });

  await firestore()
    .doc(`users/${user.uid}`)
    .set(
      {
        roles: {
          [role]: !user.customClaims?.[role],
        },
      },
      { merge: true }
    )
    .then(() => {
      return { message: `Success! ${email} is now ${role}` };
    })
    .catch((error) => {
      throw new HttpsError("unknown", error.message);
    });
});
