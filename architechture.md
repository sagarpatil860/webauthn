```json
my-app/
├── build/
├── config-overrides.js
├── node_modules/
├── public/
│ ├── manifest.json
│ ├── index.html
├── src/
│ ├── components/
│ ├── styles/
│ ├── services/
│ ├── utils/
│ ├── service-worker.js
│ ├── sw-init.js
│ ├── sw-cache.js
│ ├── sw-indexeddb.js
│ ├── sw-webauthn.js
├── package.json
├── README.md
```

No worries! When using Create React App (CRA), we can still configure Webpack by leveraging the `react-app-rewired` package to override the default Webpack configuration. Here's how you can achieve this:

### Steps to Customize Webpack Configuration in CRA with `react-app-rewired`

#### Step 1: Install Necessary Packages

First, you need to install `react-app-rewired` and other necessary packages:

```sh
npm install react-app-rewired @babel/preset-env babel-loader --save-dev
```

#### Step 2: Create `config-overrides.js`

Create a file named `config-overrides.js` in the root of your project. This file will allow us to override the default Webpack configuration:

```javascript
const path = require("path");

module.exports = function override(config, env) {
  // Override Webpack configuration
  config.module.rules = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    },
  ];
  config.output = {
    ...config.output,
    filename: "service-worker.js",
    path: path.resolve(__dirname, "build"),
  };
  return config;
};
```

#### Step 3: Update `package.json`

Modify the `scripts` section in your `package.json` to use `react-app-rewired` instead of `react-scripts`:

```json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-scripts eject"
}
```

#### Step 4: Create Service Worker Modules

Create separate files for different functionalities as discussed earlier:

1. **Service Worker Initialization** (`sw-init.js`)

   ```javascript
   // sw-init.js
   export const installHandler = (event) => {
     event.waitUntil(
       caches.open("my-cache").then((cache) => {
         return cache.addAll(["/", "/index.html", "/styles.css", "/app.js"]);
       })
     );
   };

   export const activateHandler = (event) => {
     event.waitUntil(
       caches.keys().then((cacheNames) => {
         return Promise.all(
           cacheNames.map((cacheName) => {
             if (cacheName !== "my-cache") {
               return caches.delete(cacheName);
             }
           })
         );
       })
     );
   };
   ```

2. **Caching and Fetching** (`sw-cache.js`)

   ```javascript
   // sw-cache.js
   export const fetchHandler = (event) => {
     event.respondWith(
       caches
         .match(event.request)
         .then((response) => {
           return (
             response ||
             fetch(event.request).then((fetchResponse) => {
               return caches.open("my-cache").then((cache) => {
                 cache.put(event.request, fetchResponse.clone());
                 return fetchResponse;
               });
             })
           );
         })
         .catch((error) => {
           console.error(
             "Fetch failed; returning offline page instead.",
             error
           );
           return caches.match("/");
         })
     );
   };
   ```

3. **IndexedDB Operations** (`sw-indexeddb.js`)

   ```javascript
   // sw-indexeddb.js
   export const dbOperations = {
     openDB: () => {
       return idb.open("my-db", 1, (upgradeDB) => {
         if (!upgradeDB.objectStoreNames.contains("my-store")) {
           upgradeDB.createObjectStore("my-store", {
             keyPath: "id",
             autoIncrement: true,
           });
         }
       });
     },
     addData: (db, data) => {
       const tx = db.transaction("my-store", "readwrite");
       const store = tx.objectStore("my-store");
       store.put(data);
       return tx.complete;
     },
     getData: (db, id) => {
       const tx = db.transaction("my-store", "readonly");
       const store = tx.objectStore("my-store");
       return store.get(id);
     },
   };
   ```

4. **WebAuthn Operations** (`sw-webauthn.js`)
   ```javascript
   // sw-webauthn.js
   export const webAuthnOperations = {
     register: async () => {
       const publicKey = {
         /* PublicKeyCredentialCreationOptions */
       };
       const credential = await navigator.credentials.create({ publicKey });
       // Send credential to the server
     },
     authenticate: async () => {
       const publicKey = {
         /* PublicKeyCredentialRequestOptions */
       };
       const assertion = await navigator.credentials.get({ publicKey });
       // Send assertion to the server
     },
   };
   ```

#### Step 5: Main Service Worker File

Create the main service worker file (`service-worker.js`) to import the smaller modules:

```javascript
// service-worker.js
import { installHandler, activateHandler } from "./sw-init.js";
import { fetchHandler } from "./sw-cache.js";
import { dbOperations } from "./sw-indexeddb.js";
import { webAuthnOperations } from "./sw-webauthn.js";

self.addEventListener("install", installHandler);
self.addEventListener("activate", activateHandler);
self.addEventListener("fetch", fetchHandler);

// Example usage of dbOperations and webAuthnOperations
const dbPromise = dbOperations.openDB();
dbPromise.then((db) => {
  dbOperations.addData(db, { id: 1, name: "Sample Data" });
  dbOperations.getData(db, 1).then((data) => {
    console.log(data);
  });
});
```

#### Step 6: Build and Test

1. **Build your project**:

   ```sh
   npm run build
   ```

2. **Test your service worker** on various browsers and devices to ensure it functions as expected.

### Summary

1. **Install necessary packages**: `react-app-rewired`, `babel-loader`, and `@babel/preset-env`.
2. **Create `config-overrides.js`**: Override default Webpack configuration.
3. **Update `package.json` scripts**: Use `react-app-rewired` for custom configurations.
4. **Create service worker modules**: Split functionality into separate files.
5. **Main service worker file**: Import modules and add event listeners.
6. **Build and test**: Ensure everything works correctly.

This approach allows you to customize the Webpack configuration in CRA and use ES modules for a more maintainable and modular service worker setup. Let me know if you need further details or assistance!

# When I building app it is telling me that service worker manifest is missing

This error typically occurs when the service worker is trying to access a manifest file that either doesn't exist or isn't correctly referenced. Let's make sure that your `manifest.json` is properly set up and referenced.

### Step-by-Step Guide to Fix Missing Service Worker Manifest

#### Step 1: Ensure `manifest.json` Exists

1. **Create `manifest.json`** if it doesn't exist in the `public` directory of your CRA project.

   ```json
   {
     "short_name": "ReactApp",
     "name": "Create React App Sample",
     "icons": [
       {
         "src": "favicon.ico",
         "sizes": "64x64 32x32 24x24 16x16",
         "type": "image/x-icon"
       },
       {
         "src": "logo192.png",
         "type": "image/png",
         "sizes": "192x192"
       },
       {
         "src": "logo512.png",
         "type": "image/png",
         "sizes": "512x512"
       }
     ],
     "start_url": ".",
     "display": "standalone",
     "theme_color": "#000000",
     "background_color": "#ffffff"
   }
   ```

2. **Verify the `manifest.json` file** is correctly formatted and placed in the `public` directory of your project.

#### Step 2: Reference `manifest.json` in `index.html`

1. **Update `index.html`** in the `public` directory to ensure the manifest is referenced correctly.

   ```html
   <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
   ```

2. **Ensure the `<link>` tag** is placed within the `<head>` section of your `index.html`.

#### Step 3: Update Service Worker Registration

Ensure your service worker registration script correctly references the manifest:

1. **Update `serviceWorkerRegistration.js`** (usually found in `src`):

   ```javascript
   const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
   if (publicUrl.origin !== window.location.origin) {
     return;
   }
   ```

2. **Verify Service Worker Initialization**:
   ```javascript
   if ("serviceWorker" in navigator) {
     window.addEventListener("load", () => {
       const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
       navigator.serviceWorker
         .register(swUrl)
         .then((registration) => {
           console.log(
             "Service Worker registration successful with scope: ",
             registration.scope
           );
         })
         .catch((error) => {
           console.error("Service Worker registration failed:", error);
         });
     });
   }
   ```

#### Step 4: Configure Webpack to Copy `manifest.json`

Ensure Webpack copies the `manifest.json` file to the build directory. This is usually handled by CRA, but it's good to verify:

1. **Install `copy-webpack-plugin`** if needed:

   ```sh
   npm install copy-webpack-plugin --save-dev
   ```

2. **Update `config-overrides.js`** to copy the manifest file:

   ```javascript
   const CopyWebpackPlugin = require("copy-webpack-plugin");
   const path = require("path");

   module.exports = function override(config, env) {
     config.plugins = (config.plugins || []).concat([
       new CopyWebpackPlugin({
         patterns: [{ from: "public/manifest.json", to: "manifest.json" }],
       }),
     ]);

     // Other Webpack customizations

     return config;
   };
   ```

### Summary

1. **Ensure `manifest.json`** exists and is correctly formatted in the `public` directory.
2. **Reference `manifest.json`** in `index.html` using a `<link>` tag.
3. **Update Service Worker Registration** script to correctly reference the manifest.
4. **Configure Webpack** to copy `manifest.json` to the build directory.

By following these steps, you should be able to resolve the missing manifest error and ensure your service worker operates correctly. Let me know if you need further assistance or encounter any issues!
