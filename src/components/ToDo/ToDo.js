import React, { useState, useEffect } from "react";
import { STORE_NAME } from "../../constannts/constants";
import {
  exportData,
  openDatabase,
  saveToFile,
} from "../../utils/backup-restore/backup-restore";

function ToDo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoreProgress, setRestoreProgress] = useState(0);

  async function readFromFile() {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      const file = await fileHandle.getFile();
      const contents = await file.text();
      const data = JSON.parse(contents);
      return data;
    } catch (error) {
      console.error("Error reading file:", error);
      return null;
    }
  }

  async function restoreData(data, setRestoreProgress) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const totalItems = data.length;
      let restoredItems = 0;
      data.forEach((item) => {
        store.put(item);
        restoredItems += 1;
        setRestoreProgress(Math.round((restoredItems / totalItems) * 100));
      });
      tx.oncomplete = function () {
        resolve("Data restored successfully");
      };
      tx.onerror = function () {
        reject("Failed to restore data");
      };
    });
  }

  async function backupData() {
    const data = await exportData();
    await saveToFile(data, setBackupProgress);
  }
  const handleRestore = async () => {
    const data = await readFromFile();
    if (data) {
      await restoreData(data, setRestoreProgress);
    }
  };
  useEffect(() => {
    fetch("/api/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, []);

  const handleAdd = () => {
    if (newTodo.trim()) {
      fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodo.trim() }),
      }).then(() => {
        setNewTodo("");
        fetch("/api/todos")
          .then((response) => response.json())
          .then((data) => setTodos(data));
      });
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo.id);
    setEditedText(todo.text);
  };

  const handleUpdate = (id) => {
    if (editedText.trim()) {
      fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editedText.trim() }),
      }).then(() => {
        setEditingTodo(null);
        setEditedText("");
        fetch("/api/todos")
          .then((response) => response.json())
          .then((data) => setTodos(data));
      });
    }
  };

  const handleDelete = (id) => {
    fetch(`/api/todos/${id}`, { method: "DELETE" }).then(() => {
      fetch("/api/todos")
        .then((response) => response.json())
        .then((data) => setTodos(data));
    });
  };

  return (
    <div className="App">
      <div>
        {" "}
        <h1>Background Backup & Restore</h1>{" "}
        <button onClick={backupData}>Backup Data</button>{" "}
        <button onClick={handleRestore}>Restore Data</button>{" "}
        <div>
          {" "}
          <progress value={backupProgress} max="100"></progress>{" "}
          <div>Backup Progress: {backupProgress}%</div>{" "}
        </div>{" "}
        <div>
          {" "}
          <progress value={restoreProgress} max="100"></progress>{" "}
          <div>Restore Progress: {restoreProgress}%</div>{" "}
        </div>{" "}
      </div>
      <h1>To-Do App</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new to-do"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            {editingTodo === todo.id ? (
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
            ) : (
              <span>{todo.text}</span>
            )}
            {editingTodo === todo.id ? (
              <button onClick={() => handleUpdate(todo.id)}>Update</button>
            ) : (
              <button onClick={() => handleEdit(todo)}>Edit</button>
            )}
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ToDo;
