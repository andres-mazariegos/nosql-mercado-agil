// =====================================================================
// 02_pruebas_integridad.js  ·  Ejercicios 4, 5 y 6
//   load("scripts/02_pruebas_integridad.js")   // desde la raíz del repositorio
// =====================================================================
db = db.getSiblingDB("comercio_u2");

// Ejercicio 4: mostrar que el validador está aplicado
const info = db.getCollectionInfos({ name: "pedidos" })[0].options;
print("validationLevel: " + info.validationLevel + " | validationAction: " + info.validationAction);

// Pedido base válido para las pruebas (no se guarda)
const base = {
  clienteId: "C99", almacen: "Centro", prioridad: "media", estado: "pendiente",
  fecha: new Date("2026-10-21T10:00:00Z"),
  articulos: [{ sku: "P02", cantidad: 1, precioUnitario: 500 }], total: 500, etiquetas: ["web", "media"]
};

// Ejercicio 5 · Prueba negativa 1: cantidad cero (regla: cantidad >= 1)
try {
  db.pedidos.insertOne({ ...base, _id: 90, articulos: [{ sku: "P02", cantidad: 0, precioUnitario: 500 }] });
  print("Prueba 1: ¡SE ACEPTO! Revisa el validador.");
} catch (e) {
  print("Prueba 1 (cantidad 0) RECHAZADA · codigo " + e.code + " · " + e.message);
  print("Regla incumplida: " + JSON.stringify(e.errInfo));
}

// Ejercicio 5 · Prueba negativa 2: estado no admitido (regla: enum de estado)
try {
  db.pedidos.insertOne({ ...base, _id: 91, estado: "cancelado" });
  print("Prueba 2: ¡SE ACEPTO! Revisa el validador.");
} catch (e) {
  print("Prueba 2 (estado cancelado) RECHAZADA · codigo " + e.code + " · " + e.message);
  print("Regla incumplida: " + JSON.stringify(e.errInfo));
}
print("Pedidos despues de las pruebas (esperado 12): " + db.pedidos.countDocuments({}));

// Ejercicio 6: índice único en productos.sku y prueba de SKU duplicado
db.productos.createIndex({ sku: 1 }, { unique: true, name: "sku_unico" });
try {
  db.productos.insertOne({ sku: "P01", nombre: "Duplicado", precioUnitario: 1, existencias: 1, almacen: "Norte" });
  print("SKU duplicado: ¡SE ACEPTO! Revisa el indice.");
} catch (e) {
  print("SKU duplicado RECHAZADO · codigo " + e.code + " · " + e.message);
}
print("Productos (esperado 5): " + db.productos.countDocuments({}));
