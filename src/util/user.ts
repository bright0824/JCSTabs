import type { TabItem, Item } from "@/types";
import type { Timestamp } from "firebase/firestore";

export const getTabTotal = (input: TabItem[]) => {
  return input.reduce((acc, item) => acc + item.price, 0) as number;
};

export const countItemsInTab = (tab: TabItem[], items: Item[]) => {
  const count = {} as { [key: string]: number };
  items.forEach((item: Item) => {
    count[item.name] = 0;
  });
  tab
    .filter((item: TabItem) => !item.paid)
    .forEach((item: Item) => {
      count[item.name]++;
    });
  return count;
};

export const calculatePages = (length: number, itemsPerPage: number) => {
  return Math.ceil(length / itemsPerPage);
};

export const computeVisibleItems = (
  tab: TabItem[],
  page: number,
  itemsPerPage: number
) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return tab
    .sort(
      (a, b) => (a.date as Timestamp).seconds - (b.date as Timestamp).seconds
    )
    .reverse()
    .slice(start, end);
};
