import { firestore } from "firebase-functions/v1";
import {messaging} from "firebase-admin";
import * as admin from "firebase-admin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";


interface Item {
  name: string;
  price: number;
}

interface Change {
  before?: Item;
  after?: Item;
}

export const itemsUpdate = firestore
  .document("admin/items")
  .onUpdate((change) => {
    const {food: before} = change.before.data();
    const {food: after} = change.after.data();

    const message = {
      webpush: {
        notification: {
          title: "Items Updated",
          body: "The items have been updated",
        }
      },
      notification: {
        title: "Items Updated",
        body: "The items have been updated",
      },
    };

    return admin.messaging().sendAll(message).catch((err) => {
      console.log(err);
    });
  });

const diff = (before: Item[], after: Item[]): Change[] => {
  const beforeMap = before.reduce(
    (acc, item) => ({ ...acc, [item.name]: item }),
    {}
  ) as { [key: string]: Item };
  
  const afterMap = after.reduce(
    (acc, item) => ({ ...acc, [item.name]: item }),
    {}
  ) as { [key: string]: Item };

  const changed = Object.keys(beforeMap)
    .filter((key) => beforeMap[key].price !== afterMap[key].price)
    .map((key) => ({
      before: beforeMap[key],
      after: afterMap[key],
    }));

  const added = Object.keys(afterMap)
    .filter((key) => !beforeMap[key])
    .map((key) => ({
      before: undefined,
      after: afterMap[key],
    }));

  const removed = Object.keys(beforeMap)
    .filter((key) => !afterMap[key])
    .map((key) => ({
      before: beforeMap[key],
      after: undefined,
    }));

  return [...changed, ...added, ...removed];
};
