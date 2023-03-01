import { initializeApp } from "firebase-admin/app";
// import { firestore } from "firebase-admin";

initializeApp();

// User functions
export { clearTab, clearHistory, toggleRole } from "./user";

// Item functions
export { addItem, deleteItem, updateItem } from "./items";

// Auth functions
export { beforeCreate, onCreate, onDelete } from "./auth";

// Notification functions
// export { itemsUpdate } from "./notifications/items";

// Token functions
// export { subscribe } from "./notifications/tokens";
