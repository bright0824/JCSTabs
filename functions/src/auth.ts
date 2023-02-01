import { auth } from "firebase-functions";

export const beforeCreate = auth.user().beforeCreate(async (user) => {
  if (!user.email?.endsWith("@educbe.ca")) {
    const { HttpsError } = await import("firebase-functions/v1/auth");
    throw new HttpsError(
      "permission-denied",
      "You must be in the educbe.ca domain to create an account"
    );
  }
});

export const onCreate = auth.user().onCreate(async (user) => {
  const { email, displayName, photoURL } = user;

  const { firestore } = await import("firebase-admin");

  return firestore().doc(`users/${user.uid}`).set({
    info: {
      email,
      displayName,
      photoURL,
    },
    tab: [],
    roles: {},
  });
});

export const onDelete = auth.user().onDelete(async (user) => {
  const { firestore } = await import("firebase-admin");
  return firestore().doc(`users/${user.uid}`).delete();
});
