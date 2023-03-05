import { onCall, HttpsError } from "firebase-functions/v1/https";
import { messaging } from "firebase-admin";

interface UpdateTokenData {
  topics: string[];
  token: string;
  oldToken?: string;
}

export const updateToken = onCall(async (data: UpdateTokenData, context) => {
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
});

interface UpdateTopicsData {
  before: string[];
  after: string[];
  token: string;
}

export const updateTopics = onCall(async (data: UpdateTopicsData, context) => {
  if (!context.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }
  if (context.app === undefined) {
    throw new HttpsError("failed-precondition", "Unknown origin");
  }

  const { before, after, token } = data;

  if (!before || !after) {
    throw new HttpsError("invalid-argument", "Topics are required");
  }

  if (!token) {
    throw new HttpsError("invalid-argument", "Token is required");
  }

  // unsubscribe from topics that are no longer in the list
  before.forEach(async (topic) => {
    if (!after.includes(topic)) {
      await messaging()
        .unsubscribeFromTopic(token, topic)
        .catch((err) => {
          throw new HttpsError("internal", err);
        });
    }
  });

  // subscribe to topics that are new
  after.forEach(async (topic) => {
    if (!before.includes(topic)) {
      await messaging()
        .subscribeToTopic(token, topic)
        .catch((err) => {
          throw new HttpsError("internal", err);
        });
    }
  });
});
