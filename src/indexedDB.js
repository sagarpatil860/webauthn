import { openDB } from "idb";

const DATABASE_NAME = "todos-db";
const DATABASE_VERSION = 1;
const STORE_NAME = "todos";

async function initDB() {
  return openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
}

export async function getItems() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function addItem(item) {
  const db = await initDB();
  return db.add(STORE_NAME, item);
}

export async function updateItem(id, updates) {
  const db = await initDB();
  return db.put(STORE_NAME, { id, ...updates });
}

export async function deleteItem(id) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}
