import {
  onCall,
  HttpsError,
  type FunctionsErrorCode,
} from "firebase-functions/v1/https";

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

  try {
    const { firestore, auth } = await import("firebase-admin");
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
  if (!context.auth?.token.admin) {
    throw new HttpsError("permission-denied", "You must be an admin");
  }

  const { auth, firestore } = await import("firebase-admin");

  const { email, role } = data;
  const user = await auth().getUserByEmail(email);

  return async () => {
    await auth().setCustomUserClaims(user.uid, {
      [role]: !user.customClaims?.[role],
    });
    await firestore()
      .doc(`users/${user.uid}`)
      .update({
        roles: {
          [role]: !user.customClaims?.[role],
        },
      });
  };
});
