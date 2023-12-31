import type { Timestamp } from "firebase/firestore";

export type Item = {
  name: string;
  price: number;
};

export type Items = {
  food: Item[];
};

export type TabItem = {
  name: string;
  price: number;
  date: Timestamp;
  paid: boolean;
};

export type User = {
  info: {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    createdAt: Timestamp;
  };
  tab: TabItem[];
  roles: {
    [key: string]: boolean;
  };
  topics: string[];
};
