const DB_NAME = "secure-chat";
const STORE = "keys"

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => request.result.createObjectStore(STORE, { keyPath: "username" });
        request.onsuccess = (event) => resolve(request.result);
        request.onerror = (event) => reject(request.error);
    });
};

const saveKey = async (username, key) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    store.put({ username, key });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const loadKey = async (username) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const req = db.transaction(STORE, "readonly").objectStore(STORE).get(username);
        req.onsuccess = () => resolve(req.result?.key); // <-- unwrap .key
        req.onerror = () => reject(req.error);
    });
}

export { saveKey, loadKey };
