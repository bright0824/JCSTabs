import { Timestamp } from "firebase-admin/firestore";
import { CallableRequest } from "firebase-functions/v2/https";

// User functions
export interface ClearHistoryProps extends CallableRequest {
  data: {
    email: string;
  };
}

export interface ClearTabProps extends CallableRequest {
  data: {
    email: string;
  };
}

export interface ToggleRoleProps extends CallableRequest {
  data: {
    email: string;
    role: string;
  };
}

// Item functions
export interface AddItemProps extends CallableRequest {
  data: {
    item: string;
  };
}

export interface DeleteItemProps extends CallableRequest {
  data: {
    item: string;
  };
}

export interface UpdateItemProps extends CallableRequest {
  data: {
    items: string[];
  };
}

export interface TabItem {
  name: string;
  price: number;
  date: Timestamp;
  paid: boolean;
  clearedBy?: string;
}
