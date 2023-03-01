import { onCall, HttpsError } from "firebase-functions/v1/https";
import { messaging } from "firebase-admin";

interface SubscribeToTopicData {
  topic: string;
  token: string;
  oldToken?: string;
}

export const subscribeToTopic = onCall(
  async (data: SubscribeToTopicData, context) => {
    if (!context.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }
    if (context.app === undefined) {
      throw new HttpsError("failed-precondition", "Unknown origin");
    }

    const { topic, token, oldToken } = data;

    if (!topic) {
      throw new HttpsError("invalid-argument", "Topic is required");
    }

    if (!token) {
      throw new HttpsError("invalid-argument", "Token is required");
    }

    if (oldToken) {
      await messaging()
        .unsubscribeFromTopic(oldToken, topic)
        .catch((err) => {
          throw new HttpsError("internal", err);
        });
    }

    return await messaging()
      .subscribeToTopic(token, topic)
      .catch((err) => {
        throw new HttpsError("internal", err);
      });
  }
);
