import { HttpsError, onCall } from "firebase-functions/v1/https"
import { messaging } from "firebase-admin"

export const subscribe = onCall(async (data, context) => {
    if (context.app === undefined) {
    throw new HttpsError("failed-precondition", "Unknown origin");
  }
  if (!context.auth?.token.admin) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to delete an item"
    );
  }

  const { token } = data;


  return messaging().subscribeToTopic(token, "items").catch((err) => {
    if (err === "already subscribed to topic") {
        return;
    } else if (e)
    throw new HttpsError("internal", err.message);
  });
});
