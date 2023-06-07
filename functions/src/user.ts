import { auth, firestore } from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import {
  onCall,
  HttpsError,
  FunctionsErrorCode,
} from "firebase-functions/v2/https";
import {
  TabItem,
  ClearHistoryProps,
  ClearTabProps,
  ToggleRoleProps,
} from "./types";

export const clearTab = onCall(
  { enforceAppCheck: true },
  async (event: ClearTabProps) => {
    if (
      !event?.auth?.token.admin ||
      event?.auth?.token.email !== event.data.email
    ) {
      throw new HttpsError(
        "permission-denied",
        "You must be an admin to clear the tab"
      );
    }

    try {
      const user = await auth().getUserByEmail(event.data.email);
      const userRef = firestore().collection("users").doc(user.uid);

      return await firestore().runTransaction(async (t) => {
        const tab = await t.get(userRef).then((doc) => {
          return doc.data()?.tab;
        });

        const currentTab: TabItem[] = tab;

        currentTab
          .filter((item: TabItem) => !item.paid)
          .forEach((item) => {
            item.paid = true;
          });

        const total = () => {
          let total = 0;
          currentTab.forEach((item) => {
            total -= item.price;
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

        return t.update(userRef, {
          tab: processedTab,
        });
      });
    } catch (error) {
      const { code, message } = error as {
        code: FunctionsErrorCode;
        message: string;
      };
      throw new HttpsError(code, message);
    }
  }
);

export const clearHistory = onCall(
  { enforceAppCheck: true },
  async (event: ClearHistoryProps) => {
    if (!event?.auth?.token.admin) {
      throw new HttpsError(
        "permission-denied",
        "You must be an admin to clear the history"
      );
    }

    try {
      const user = await auth().getUserByEmail(event.data.email);
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
  }
);

export const toggleRole = onCall(
  { enforceAppCheck: true },
  async (event: ToggleRoleProps) => {
    if (!event?.auth?.token.admin) {
      throw new HttpsError(
        "permission-denied",
        "You must be an admin to toggle roles"
      );
    }

    const { email, role } = event.data;

    try {
      const user = await auth().getUserByEmail(email);
      await auth()
        .setCustomUserClaims(user.uid, {
          [role]: !user.customClaims?.[role],
        })
        .catch((error) => {
          throw new HttpsError("unknown", error.message);
        });

      await firestore()
        .collection("users")
        .doc(user.uid)
        .update({
          roles: {
            [role]: !user.customClaims?.[role],
          },
        })
        .then(() => {
          return { message: `Success! ${email} is now ${role}` };
        });
    } catch (error) {
      const { code, message } = error as {
        code: FunctionsErrorCode;
        message: string;
      };
      throw new HttpsError(code, message);
    }
  }
);
