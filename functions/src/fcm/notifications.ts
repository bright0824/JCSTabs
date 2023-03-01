import { messaging } from "firebase-admin";
import { firestore } from "firebase-functions";

export const itemsUpdated = firestore
  .document("admin/items")
  .onUpdate((change) => {
    const { food: before } = change.after.data();
    const { food: after } = change.before.data();

    const diff = computeDifference(before, after);

    console.log(diff);

    // change what a notification looks like depending if it's an update or add

    diff.forEach((item) => {
      if (item.before) {
        console.log(
          // eslint-disable-next-line max-len
          `Item ${item.before.name} changed from ${item.before.price} to ${item.after?.price}`
        );
      } else {
        console.log(`Item ${item.after?.name} added`);
      }
    });

    return messaging().sendToTopic("items", {
      notification: {
        title: "Items Updated",
        body: "Items have been updated",
      },
      data: {
        diff: JSON.stringify(diff),
      },
    });
  });

interface Item {
  name: string;
  price: number;
}

interface Change {
  before?: Item;
  after?: Item;
}

interface ItemMap {
  [key: string]: Item;
}

const computeDifference = (before: Item[], after: Item[]): Change[] => {
  const beforeMap: ItemMap = before.reduce(
    (acc, item) => ({ ...acc, [item.name]: item }),
    {}
  );
  const afterMap: ItemMap = after.reduce(
    (acc, item) => ({ ...acc, [item.name]: item }),
    {}
  );

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
