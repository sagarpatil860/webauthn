//helper function to create registration options on server side
const rpName = "Example Corp";
const rpID = "localhost";

// self.importScripts(
//   "https://cdn.jsdelivr.net/npm/idb@4.0.5/build/iife/with-async-ittr-min.js"
// );

// const { openDB } = idb;

const DATABASE_AUTH = "auth-arrays-db";
const DATABASE_AUTH_VERSION = 1;
const STORE_CHALLENGE_ARRAY = "auth-challenge-array";
const STORE_USER_ID = "auth-user-id";

async function initAuthDB() {
  return openDB(DATABASE_AUTH, DATABASE_AUTH_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_CHALLENGE_ARRAY)) {
        const store = db.createObjectStore(STORE_CHALLENGE_ARRAY, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("hash", "hash", { unique: true });
      }
      if (!db.objectStoreNames.contains(STORE_USER_ID)) {
        const store = db.createObjectStore(STORE_USER_ID, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("hash", "hash", { unique: true });
      }
    },
  });
}

function generateRandomUint8Array(length = 16) {
  const array = new Uint8Array(length);
  self.crypto.getRandomValues(array);
  return array;
}

function hashUint8Array(array) {
  return array.reduce((hash, byte) => {
    return (hash << 5) - hash + byte;
  }, 0);
}

async function createRandomUniqueArray(store) {
  const db = await initAuthDB();
  let newArray;
  let newArrayHash;

  do {
    newArray = generateRandomUint8Array();
    newArrayHash = hashUint8Array(newArray);
  } while (await db.getFromIndex(store, "hash", newArrayHash));

  await db.add(store, { hash: newArrayHash, array: newArray });
  console.log("Unique array stored:", newArray);
  return newArray;
}

async function generateRegistrationOptions({ email }) {
  return {
    challenge: await createRandomUniqueArray(STORE_CHALLENGE_ARRAY),

    rp: {
      name: "Example Corp",
    },
    user: {
      id: await createRandomUniqueArray(STORE_USER_ID),

      name: email,
      displayName: "User Example",
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 }, // ES256
      { type: "public-key", alg: -257 }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: "cross-platform",
      residentKey: "required",
      userVerification: "preferred",
    },
    timeout: 60000,
    attestation: "direct",
  };
}
