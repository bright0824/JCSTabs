import { onCall, HttpsError } from "firebase-functions/v1/https";

export const addItem = onCall(async (data, context) => {
  if (context.app === undefined) {
    throw new HttpsError("failed-precondition", "Unknown origin");
  }
  if (!context.auth?.token.admin) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to add an item"
    );
  }
  const { firestore } = await import("firebase-admin");

  return firestore()
    .doc("admin/items")
    .update({
      food: firestore.FieldValue.arrayUnion(data.item),
    });
});

export const deleteItem = onCall(async (data, context) => {
  if (context.app === undefined) {
    throw new HttpsError("failed-precondition", "Unknown origin");
  }
  if (!context.auth?.token.admin) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to delete an item"
    );
  }
  const { firestore } = await import("firebase-admin");

  return firestore()
    .doc("admin/items")
    .update({
      food: firestore.FieldValue.arrayRemove(data.item),
    });
});

export const updateItem = onCall(async (data, context) => {
  if (context.auth == undefined) {
    throw new HttpsError("permission-denied", "Unknown origin");
  }
  if (!context.auth.token.admin) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to update an item"
    );
  }
  const { firestore } = await import("firebase-admin");

  return firestore().doc("admin/items").update({
    food: data.items,
  });
});
