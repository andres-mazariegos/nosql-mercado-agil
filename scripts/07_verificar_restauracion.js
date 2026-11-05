// =====================================================================
// 07_verificar_restauracion.js  ·  Ejercicio 18 (conectado como admin_tienda)
//   load("scripts/07_verificar_restauracion.js")   // desde la raíz del repositorio
// =====================================================================
const origen = db.getSiblingDB("comercio_u2");
const copia  = db.getSiblingDB("comercio_u2_restaurada");

function igual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function validador(base) {
  const c = base.getCollectionInfos({ name: "pedidos" })[0];
  return c && c.options && c.options.validator ? "presente" : "ausente";
}
function indices(base, col) { return base[col].getIndexes().map(i => i.name).sort().join(", "); }

const filas = [
  ["Pedidos", origen.pedidos.countDocuments({}), copia.pedidos.countDocuments({})],
  ["Productos", origen.productos.countDocuments({}), copia.productos.countDocuments({})],
  ["Pedido 1 identico", "-", igual(origen.pedidos.findOne({ _id: 1 }), copia.pedidos.findOne({ _id: 1 })) ? "si" : "NO"],
  ["Pedido 7 identico", "-", igual(origen.pedidos.findOne({ _id: 7 }), copia.pedidos.findOne({ _id: 7 })) ? "si" : "NO"],
  ["Pedido 12 identico", "-", igual(origen.pedidos.findOne({ _id: 12 }), copia.pedidos.findOne({ _id: 12 })) ? "si" : "NO"],
  ["Indices pedidos", indices(origen, "pedidos"), indices(copia, "pedidos")],
  ["Indices productos", indices(origen, "productos"), indices(copia, "productos")],
  ["Validador pedidos", validador(origen), validador(copia)]
];
print("Elemento | comercio_u2 | comercio_u2_restaurada");
filas.forEach(f => print(f.join(" | ")));
