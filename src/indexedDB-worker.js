// importScripts("idb-bundle.js");
// importScripts(`${process.env.PUBLIC_URL}/idb-bundle.js`);

const { openDB } = idb;

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
self.initDB = initDB;
self.addEventListener("message", async (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case "GET_ITEMS":
      const items = await getItems();
      self.postMessage({ type: "GET_ITEMS", items });
      break;
    case "ADD_ITEM":
      await addItem(payload);
      self.postMessage({ type: "ADD_ITEM", success: true });
      break;
    case "UPDATE_ITEM":
      await updateItem(payload.id, payload.updates);
      self.postMessage({ type: "UPDATE_ITEM", success: true });
      break;
    case "DELETE_ITEM":
      await deleteItem(payload.id);
      self.postMessage({ type: "DELETE_ITEM", success: true });
      break;
    default:
      console.error("Unknown message type:", type);
  }
});

async function getItems() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

async function addItem(item) {
  const db = await initDB();
  return db.add(STORE_NAME, item);
}

async function updateItem(id, updates) {
  const db = await initDB();
  return db.put(STORE_NAME, { id, ...updates });
}

async function deleteItem(id) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}
