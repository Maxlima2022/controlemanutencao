const dbName = "manutencaoDB";
let db;
window.onload = () => {
  let request = indexedDB.open(dbName, 1);
  request.onerror = e => console.error("Erro:", e);
  request.onsuccess = e => {
    db = e.target.result;
    listarManutencoes();
  };
  request.onupgradeneeded = e => {
    db = e.target.result;
    let store = db.createObjectStore("manutencoes", { keyPath: "id", autoIncrement: true });
    store.createIndex("realizado", "realizado", { unique: false });
  };

  document.getElementById("form").addEventListener("submit", salvarManutencao);
};

function salvarManutencao(e) {
  e.preventDefault();
  let tx = db.transaction(["manutencoes"], "readwrite");
  let store = tx.objectStore("manutencoes");
  store.add({
    empresa: document.getElementById("empresa").value,
    descricao: document.getElementById("descricao").value,
    data: document.getElementById("data").value,
    realizado: false
  });
  tx.oncomplete = () => {
    document.getElementById("form").reset();
    listarManutencoes();
  };
}

function listarManutencoes() {
  let tx = db.transaction("manutencoes", "readonly");
  let store = tx.objectStore("manutencoes");
  let index = store.index("realizado");
  let req = index.getAll(false);
  req.onsuccess = () => {
    let lista = document.getElementById("listaManutencoes");
    lista.innerHTML = "";
    req.result.forEach(item => {
      let li = document.createElement("li");
      li.innerHTML = `<strong>${item.empresa}</strong>: ${item.descricao} em ${item.data}
                      <button onclick="marcarRealizado(${item.id})">Realizado</button>`;
      lista.appendChild(li);
    });
  };
}

function marcarRealizado(id) {
  let tx = db.transaction("manutencoes", "readwrite");
  let store = tx.objectStore("manutencoes");
  let req = store.get(id);
  req.onsuccess = () => {
    let data = req.result;
    data.realizado = true;
    store.put(data);
    listarManutencoes();
  };
}