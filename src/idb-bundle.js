// import { openDB } from "idb";

const test = () => console.log("script import complete");
// const initDB = () =>
//   openDB("todos-db", 1, {
//     upgrade(db) {
//       if (!db.objectStoreNames.contains("todos")) {
//         db.createObjectStore("todos", { keyPath: "id", autoIncrement: true });
//       }
//     },
//   });

self.test = test;
