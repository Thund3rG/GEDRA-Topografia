import React, { useState, useEffect } from "react";

/* IndexedDB */
const DB_NAME = "gedra-db";
const STORE = "projects";

const openDB = () => new Promise((resolve, reject) => {
  const req = indexedDB.open(DB_NAME, 1);
  req.onupgradeneeded = () => {
    req.result.createObjectStore(STORE, { keyPath: "id" });
  };
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

const saveProject = async (project) => {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(project);
};

const getProjects = async () => {
  const db = await openDB();
  const tx = db.transaction(STORE, "readonly");
  const store = tx.objectStore(STORE);
  return new Promise(resolve => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
  });
};

export default function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const createProject = async () => {
    const p = {
      id: Date.now().toString(),
      name: "Proyecto " + (projects.length + 1),
      createdAt: new Date().toISOString()
    };
    await saveProject(p);
    setProjects([...projects, p]);
  };

  return (
    <div style={{padding:20,fontFamily:"sans-serif"}}>
      <h1>GEDRA Topografía</h1>
      <button onClick={createProject}>Nuevo Proyecto</button>
      {projects.map(p => (
        <div key={p.id}>
          <strong>{p.name}</strong>
        </div>
      ))}
    </div>
  );
}