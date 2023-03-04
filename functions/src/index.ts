import { initializeApp } from "firebase-admin/app";

initializeApp();

// User functions
export { clearTab, clearHistory, toggleRole } from "./user";

// Item functions
export { addItem, deleteItem, updateItem } from "./items";

// Auth functions
export { beforeCreate, onCreate, onDelete } from "./auth";

// FCM functions
// export { subscribeToTopic } from "./fcm/token";
// export { itemsUpdated } from "./fcm/notifications";
