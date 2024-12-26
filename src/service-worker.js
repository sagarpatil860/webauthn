const self = this;
self.importScripts(
  "https://cdn.jsdelivr.net/npm/idb@4.0.5/build/iife/with-async-ittr-min.js"
);
self.importScripts("generateRegistrationOptions.js");
const STATIC_CACHE = "static-v1";
const DYNAMIC_CACHE = "dynamic-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
];

// eslint-disable-next-line no-undef
const { openDB } = idb;

const DATABASE_NAME = "todos-db";
const DATABASE_VERSION = 1;
const STORE_NAME = "todos";
const AUTH_CREDENTIALS = "auth_credentials";
async function initDB() {
  return openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(AUTH_CREDENTIALS)) {
        const store = db.createObjectStore(AUTH_CREDENTIALS, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("email", "email", { unique: false });
      }
    },
  });
}
async function handleToDoAPICalls(request) {
  const db = await initDB();
  const url = new URL(request.url);
  console.log(`Handling API request for: ${url.pathname}`);
  let responseBody;

  switch (request.method) {
    case "GET": {
      const items = await db.getAll(STORE_NAME);
      responseBody = JSON.stringify(items);
      return new Response(responseBody, {
        headers: { "Content-Type": "application/json" },
      });
    }
    case "POST": {
      const newTodo = await request.json();
      await db.add(STORE_NAME, newTodo);
      responseBody = JSON.stringify({ success: true });
      return new Response(responseBody, {
        headers: { "Content-Type": "application/json" },
      });
    }
    case "PUT": {
      const id = url.pathname.split("/").pop();
      const updates = await request.json();
      await db.put(STORE_NAME, { id: Number(id), ...updates });
      responseBody = JSON.stringify({ success: true });
      return new Response(responseBody, {
        headers: { "Content-Type": "application/json" },
      });
    }
    case "DELETE": {
      const deleteId = url.pathname.split("/").pop();
      await db.delete(STORE_NAME, Number(deleteId));
      responseBody = JSON.stringify({ success: true });
      return new Response(responseBody, {
        headers: { "Content-Type": "application/json" },
      });
    }
    default: {
      responseBody = JSON.stringify({ error: "Unsupported request method" });
      return new Response(responseBody, {
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}

async function handleAuthCredAPICalls(request) {
  const db = await initDB();
  const url = new URL(request.url);
  console.log(`Handling API request for: ${url.pathname}`);
  let responseBody;

  switch (request.method) {
    case "GET": {
      const user_email = new URL(request.url).searchParams.get("email");
      const items = await db.getAllFromIndex(
        AUTH_CREDENTIALS,
        "email",
        user_email
      );
      const responseBody = JSON.stringify(items);
      return new Response(responseBody, {
        headers: { "Content-Type": "application/json" },
      });
    }
    case "POST": {
      const { username, password } = await request.json();
      const registrationOptions = await generateRegistrationOptions({
        email: username,
      });
      console.log();
      await db.add(AUTH_CREDENTIALS, { email: username, username, password });
      const responseBody = JSON.stringify({
        success: true,
        registrationOptions,
      });

      return new Response(responseBody, {
        headers: { "Content-Type": "application/json" },
      });
    }
    case "PUT": {
      const id = url.pathname.split("/").pop();
      const updates = await request.json();
      await db.put(STORE_NAME, { id: Number(id), ...updates });
      responseBody = JSON.stringify({ success: true });
      return new Response(responseBody, {
        headers: { "Content-Type": "application/json" },
      });
    }
    case "DELETE": {
      const deleteId = url.pathname.split("/").pop();
      await db.delete(STORE_NAME, Number(deleteId));
      responseBody = JSON.stringify({ success: true });
      return new Response(responseBody, {
        headers: { "Content-Type": "application/json" },
      });
    }
    default: {
      responseBody = JSON.stringify({ error: "Unsupported request method" });
      return new Response(responseBody, {
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { url } = event.request;
  if (url.includes("/api/todos")) {
    event.respondWith(handleToDoAPICalls(event.request));
  } else if (url.includes("/api/auth/signup")) {
    event.respondWith(handleAuthCredAPICalls(event.request));
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).then((response) => {
            return caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request.url, response.clone());
              return response;
            });
          })
        );
      })
    );
  }
});
