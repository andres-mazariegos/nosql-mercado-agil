// =====================================================================
// 05_agregaciones_indice.js  ·  Ejercicios 10 y 11
//   load("scripts/05_agregaciones_indice.js")   // desde la raíz del repositorio
// =====================================================================
db = db.getSiblingDB("comercio_u2");

// ---------- Ejercicio 10a: pedidos por estado ----------
print("Pedidos por estado · esperado: entregado 4, pendiente 4, enviado 2, preparacion 2");
printjson(db.pedidos.aggregate([
  { $group: { _id: "$estado", pedidos: { $sum: 1 } } },
  { $sort: { pedidos: -1, _id: 1 } }
]).toArray());

// ---------- Ejercicio 10b: por almacén, ordenado por ingreso ----------
print("\nPor almacen · esperado: Norte 35400 (5 u), Sur 12800 (4 u), Centro 4700 (11 u)");
printjson(db.pedidos.aggregate([
  { $unwind: "$articulos" },
  { $group: {
      _id: "$almacen",
      pedidos:  { $addToSet: "$_id" },
      ingreso:  { $sum: { $multiply: ["$articulos.cantidad", "$articulos.precioUnitario"] } },
      unidades: { $sum: "$articulos.cantidad" }
  } },
  { $project: { _id: 1, pedidos: { $size: "$pedidos" }, ingreso: 1, unidades: 1 } },
  { $sort: { ingreso: -1 } }
]).toArray());

// ---------- Ejercicio 11: explain antes y después del índice ----------
function resumen(exp) {
  const s = exp.executionStats;
  const plan = JSON.stringify(exp.queryPlanner.winningPlan);
  return {
    plan: plan.includes("IXSCAN") ? "IXSCAN" : (plan.includes("COLLSCAN") ? "COLLSCAN" : "otro"),
    nReturned: s.nReturned,
    totalDocsExamined: s.totalDocsExamined,
    totalKeysExamined: s.totalKeysExamined
  };
}
const filtro = { estado: "pendiente", prioridad: "alta" };

// Si el índice ya existía de un intento anterior, se retira para medir el "antes"
if (db.pedidos.getIndexes().some(i => i.name === "estado_1_prioridad_1")) {
  db.pedidos.dropIndex("estado_1_prioridad_1");
}
print("\nANTES del indice · esperado COLLSCAN, nReturned 2, docs 12, keys 0");
printjson(resumen(db.pedidos.find(filtro).explain("executionStats")));

db.pedidos.createIndex({ estado: 1, prioridad: 1 });
print("DESPUES del indice · esperado IXSCAN, nReturned 2, docs 2, keys 2");
printjson(resumen(db.pedidos.find(filtro).explain("executionStats")));
