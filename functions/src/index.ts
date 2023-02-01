import { initializeApp } from "firebase-admin/app";

initializeApp();

// User functions
export { clearTab, clearHistory, toggleRole } from "./user";

// Item functions
export { addItem, deleteItem, updateItem } from "./items";

// Auth functions
export { beforecreate, onCreate, onDelete } from "./auth";
