import { onCall, HttpsError } from "firebase-functions/v1/https";
import { messaging } from "firebase-admin";

interface SubscribeToTopicData {
  topics: string[];
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

    const { topics, token, oldToken } = data;

    if (!topics) {
      throw new HttpsError("invalid-argument", "Topics are required");
    }

    if (!token) {
      throw new HttpsError("invalid-argument", "Token is required");
    }

    if (oldToken) {
      topics.forEach(async (topic) => {
        await messaging()
          .unsubscribeFromTopic(oldToken, topic)
          .catch((err) => {
            throw new HttpsError("internal", err);
          });
      });
    }

    return topics.forEach(async (topic) => {
      await messaging()
        .subscribeToTopic(token, topic)
        .catch((err) => {
          throw new HttpsError("internal", err);
        });
    });
  }
);
