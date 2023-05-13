import { onCall, HttpsError } from "firebase-functions/v2/https";
import { firestore } from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { AddItemProps, DeleteItemProps, UpdateItemProps } from "./types";

export const addItem = onCall(async (event: AddItemProps) => {
  if (event.app === undefined) {
    throw new HttpsError("failed-precondition", "Unknown origin");
  }
  if (!event.auth?.token.admin) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to add an item"
    );
  }

  return firestore()
    .doc("admin/items")
    .update({
      food: FieldValue.arrayUnion(event.data.item),
    })
    .catch((error) => {
      throw new HttpsError("unknown", error.message);
    });
});

export const deleteItem = onCall(async (event: DeleteItemProps) => {
  if (event.app === undefined) {
    throw new HttpsError("failed-precondition", "Unknown origin");
  }
  if (!event.auth?.token.admin) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to delete an item"
    );
  }

  return firestore()
    .doc("admin/items")
    .update({
      food: FieldValue.arrayRemove(event.data.item),
    });
});

export const updateItem = onCall(async (event: UpdateItemProps) => {
  if (event.auth == undefined) {
    throw new HttpsError("permission-denied", "Unknown origin");
  }
  if (!event.auth.token.admin) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to update an item"
    );
  }

  return firestore().doc("admin/items").update({
    food: event.data.items,
  });
});
