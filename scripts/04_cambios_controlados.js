// =====================================================================
// 04_cambios_controlados.js  ·  Ejercicios 8 y 9
//   load("scripts/04_cambios_controlados.js")   // desde la raíz del repositorio
// =====================================================================
db = db.getSiblingDB("comercio_u2");

// ---------- Ejercicio 8a: cambio condicional del pedido 1 ----------
print("Antes: " + JSON.stringify(db.pedidos.findOne({ _id: 1 }, { estado: 1 })));
let r = db.pedidos.updateOne({ _id: 1, estado: "pendiente" }, { $set: { estado: "preparacion" } });
print("1er intento · matched " + r.matchedCount + " · modified " + r.modifiedCount + " (esperado 1 y 1)");
r = db.pedidos.updateOne({ _id: 1, estado: "pendiente" }, { $set: { estado: "preparacion" } });
print("2o intento  · matched " + r.matchedCount + " · modified " + r.modifiedCount + " (esperado 0 y 0)");
db.pedidos.updateOne({ _id: 1, estado: "preparacion" }, { $set: { estado: "pendiente" } });
print("Restituido: " + JSON.stringify(db.pedidos.findOne({ _id: 1 }, { estado: 1 })));

// ---------- Ejercicio 8b: reserva de una unidad de P01 con $inc ----------
print("\nExistencias P01 antes (esperado 8): " + db.productos.findOne({ sku: "P01" }).existencias);
r = db.productos.updateOne({ sku: "P01", existencias: { $gte: 1 } }, { $inc: { existencias: -1 } });
print("Reserva · matched " + r.matchedCount + " · modified " + r.modifiedCount);
print("Existencias P01 despues de reservar (esperado 7): " + db.productos.findOne({ sku: "P01" }).existencias);
db.productos.updateOne({ sku: "P01" }, { $inc: { existencias: 1 } });
print("Existencias P01 repuestas (esperado 8): " + db.productos.findOne({ sku: "P01" }).existencias);

// ---------- Ejercicio 9a: etiqueta revision con $addToSet y $pull ----------
db.pedidos.updateOne({ _id: 3 }, { $addToSet: { etiquetas: "revision" } });
db.pedidos.updateOne({ _id: 3 }, { $addToSet: { etiquetas: "revision" } });   // repetida a propósito
print("\nEtiquetas del pedido 3 tras dos $addToSet (esperado web, alta, revision): " +
      JSON.stringify(db.pedidos.findOne({ _id: 3 }).etiquetas));
db.pedidos.updateOne({ _id: 3 }, { $pull: { etiquetas: "revision" } });
print("Etiquetas del pedido 3 tras $pull (esperado web, alta): " + JSON.stringify(db.pedidos.findOne({ _id: 3 }).etiquetas));

// ---------- Ejercicio 9b: pedido temporal 99 y eliminación inequívoca ----------
db.pedidos.insertOne({
  _id: 99, clienteId: "C99", almacen: "Centro", prioridad: "baja", estado: "pendiente",
  fecha: new Date("2026-10-21T10:00:00Z"),
  articulos: [{ sku: "P04", cantidad: 1, precioUnitario: 300 }], total: 300,
  etiquetas: ["web", "baja"], temporal: true
});
print("\nPedidos con el temporal (esperado 13): " + db.pedidos.countDocuments({}));
r = db.pedidos.deleteOne({ _id: 99, temporal: true });
print("deletedCount (esperado 1): " + r.deletedCount);

// ---------- Verificación final ----------
print("\nPedidos (esperado 12): " + db.pedidos.countDocuments({}));
print("Productos (esperado 5): " + db.productos.countDocuments({}));
printjson(db.productos.find({}, { _id: 0, sku: 1, existencias: 1 }).sort({ sku: 1 }).toArray());
