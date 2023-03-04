import { messaging } from "firebase-admin";
import { firestore } from "firebase-functions";
import { Item, ItemMap, Change } from "./types";

export const itemsUpdated = firestore
  .document("admin/items")
  .onUpdate((change) => {
    const { food: before } = change.before.data();
    const { food: after } = change.after.data();

    const diff = computeDifference(before, after);

    // change which notification is sent based on the diff
    const changed = diff.find((item) => item.before && item.after);
    const added = diff.find((item) => !item.before && item.after);

    let message = {};

    if (changed) {
      console.log("changed", changed);
      message = {
        notification: {
          title: "Item Updated",
          body: `${changed.after?.name} is now ${new Intl.NumberFormat(
            "en-CA",
            {
              style: "currency",
              currency: "CAD",
            }
          ).format(changed.after?.price || 0)}`,
        },
      };
    } else if (added) {
      console.log("added", added);
      message = {
        notification: {
          title: "Item Added",
          body: `${added.after?.name} is now available.`,
        },
      };
    } else {
      console.log(
        "removed",
        diff.find((item) => item.before && !item.after)
      );
    }

    return messaging().sendToTopic("items", message);
  });

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
