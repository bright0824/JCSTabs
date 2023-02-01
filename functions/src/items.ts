import { onCall, HttpsError } from "firebase-functions/v1/https";
import { firestore } from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

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

  return firestore()
    .doc("admin/items")
    .update({
      food: FieldValue.arrayUnion(data.item),
    })
    .catch((error) => {
      throw new HttpsError("unknown", error.message);
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

  return firestore()
    .doc("admin/items")
    .update({
      food: FieldValue.arrayRemove(data.item),
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

  return firestore().doc("admin/items").update({
    food: data.items,
  });
});
