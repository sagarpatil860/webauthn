import { DATABASE_NAME, STORE_NAME } from "../../constannts/constants";

export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function () {
      reject("Failed to open database");
    };
  });
}

export async function exportData() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const allData = store.getAll();

    allData.onsuccess = function () {
      resolve(allData.result);
    };

    allData.onerror = function () {
      reject("Failed to export data");
    };
  });
}
export async function saveToFile(data, setBackupProgress) {
  try {
    const now = new Date();
    const dateTimeString = now.toISOString().replace(/[:.]/g, "-");
    const newFileName = `backup-${dateTimeString}.json`;

    const fileHandle = await window.showSaveFilePicker({
      suggestedName: newFileName,
      types: [
        {
          description: "JSON Files",
          accept: { "application/json": [".json"] },
        },
      ],
    });

    const writableStream = await fileHandle.createWritable();
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const totalSize = blob.size;

    let written = 0;
    const reader = blob.stream().getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      await writableStream.write(value);
      written += value.length;
      setBackupProgress(Math.round((written / totalSize) * 100));
    }

    await writableStream.close();
    console.log("File saved successfully:", newFileName);

    return fileHandle;
  } catch (error) {
    console.error("Error saving file:", error);
    return null;
  }
}
