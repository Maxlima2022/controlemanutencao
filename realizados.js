const dbName = "manutencaoDB";
let db;
window.onload = () => {
  let request = indexedDB.open(dbName, 1);
  request.onsuccess = e => {
    db = e.target.result;
    listarRealizados();
  };
};

function listarRealizados() {
  let tx = db.transaction("manutencoes", "readonly");
  let store = tx.objectStore("manutencoes");
  let index = store.index("realizado");
  let req = index.getAll(true);
  req.onsuccess = () => {
    let lista = document.getElementById("listaRealizados");
    req.result.forEach(item => {
      let li = document.createElement("li");
      li.innerHTML = `<strong>${item.empresa}</strong>: ${item.descricao} em ${item.data}`;
      lista.appendChild(li);
    });
  };
}

function exportarPDF() {
  window.print();
}