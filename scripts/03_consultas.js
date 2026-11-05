// =====================================================================
// 03_consultas.js  ·  Ejercicio 7 (antes de cada consulta va lo esperado)
//   load("scripts/03_consultas.js")   // desde la raíz del repositorio
// =====================================================================
db = db.getSiblingDB("comercio_u2");

print("\n(a) Pendientes de prioridad alta · esperado: 1 (C01) y 7 (C03)");
printjson(db.pedidos.find({ estado: "pendiente", prioridad: "alta" }, { _id: 1, clienteId: 1 }).sort({ _id: 1 }).toArray());

print("\n(b) Almacen Centro ordenados por ID · esperado: 2, 4, 6, 8, 11");
printjson(db.pedidos.find({ almacen: "Centro" }, { _id: 1, almacen: 1, estado: 1 }).sort({ _id: 1 }).toArray());

print("\n(c) Total >= 3000 MXN · esperado: 1, 3, 5, 7, 9, 12");
printjson(db.pedidos.find({ total: { $gte: 3000 } }, { _id: 1, total: 1 }).sort({ _id: 1 }).toArray());

print("\n(d) Del 17 al 19 de octubre (inclusive) · esperado: 5, 6, 7, 8, 9, 10");
printjson(db.pedidos.find(
  { fecha: { $gte: new Date("2026-10-17T00:00:00Z"), $lt: new Date("2026-10-20T00:00:00Z") } },
  { _id: 1, fecha: 1 }
).sort({ _id: 1 }).toArray());

print("\n(e) Contienen el SKU P03 · esperado: 3, 7, 12");
printjson(db.pedidos.find({ "articulos.sku": "P03" }, { _id: 1, articulos: 1 }).sort({ _id: 1 }).toArray());

print("\n(f) Numero de pedidos entregados · esperado: 4");
print(db.pedidos.countDocuments({ estado: "entregado" }));
