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
  if (!context?.auth?.token.admin) {
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
  };

  try {
    const user = await auth().getUserByEmail(data.email);
    const userRef = firestore().collection("users").doc(user.uid);

    return await firestore().runTransaction(async (t) => {
      const doc = await t.get(userRef);
      const tab = doc.data()?.tab;

      const newTab = tab.forEach((element: TabItem) => {
        element.paid == true;
      });

      const total = () => {
        let total = 0;
        newTab.forEach((item: TabItem) => {
          total += item.price;
        });
        return total;
      };

      newTab.push({
        name: "Tab Cleared",
        price: total(),
        date: Timestamp.now(),
        paid: true,
      });

      await t.update(userRef, newTab);
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
