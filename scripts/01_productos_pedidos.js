// =====================================================================
// 01_productos_pedidos.js  ·  Examen U2 · Bases de Datos en la Nube
// Ejercicio 3 y 4: crea productos, crea pedidos con validador y carga
// los 12 pedidos. Ejecutar UNA sola vez en mongosh:
//   load("scripts/01_productos_pedidos.js")   // desde la raíz del repositorio
// =====================================================================

db = db.getSiblingDB("comercio_u2");

// Protección: si ya existen las colecciones, no se vuelve a cargar nada.
const existentes = db.getCollectionNames();
if (existentes.includes("productos") || existentes.includes("pedidos")) {
  throw new Error("Ya existen productos o pedidos en comercio_u2. No se cargo nada para no duplicar.");
}

// ---------------------------------------------------------------------
// 1) Colección productos (5 artículos)
// ---------------------------------------------------------------------
db.productos.insertMany([
  { sku: "P01", nombre: "Computadora portatil", precioUnitario: 15000, existencias: 8,  almacen: "Norte"  },
  { sku: "P02", nombre: "Teclado",              precioUnitario: 500,   existencias: 40, almacen: "Centro" },
  { sku: "P03", nombre: "Monitor",              precioUnitario: 3200,  existencias: 12, almacen: "Sur"    },
  { sku: "P04", nombre: "Mouse",                precioUnitario: 300,   existencias: 50, almacen: "Centro" },
  { sku: "P05", nombre: "Router",               precioUnitario: 1800,  existencias: 15, almacen: "Norte"  }
]);

// ---------------------------------------------------------------------
// 2) Validador $jsonSchema de pedidos (Ejercicio 4)
// ---------------------------------------------------------------------
const esquemaPedidos = {
  bsonType: "object",
  required: ["_id", "clienteId", "almacen", "prioridad", "estado", "fecha", "articulos", "total"],
  properties: {
    _id:       { bsonType: ["int", "long"], description: "entero unico" },
    clienteId: { bsonType: "string" },
    almacen:   { enum: ["Norte", "Centro", "Sur"] },
    prioridad: { enum: ["alta", "media", "baja"] },
    estado:    { enum: ["pendiente", "preparacion", "enviado", "entregado"] },
    fecha:     { bsonType: "date" },
    articulos: {
      bsonType: "array",
      minItems: 1,
      items: {
        bsonType: "object",
        required: ["sku", "cantidad", "precioUnitario"],
        properties: {
          sku:            { bsonType: "string" },
          cantidad:       { bsonType: ["int", "long"], minimum: 1 },
          precioUnitario: { bsonType: ["int", "long", "double", "decimal"], minimum: 0, exclusiveMinimum: true }
        }
      }
    },
    total:       { bsonType: ["int", "long", "double", "decimal"], minimum: 0, exclusiveMinimum: true },
    etiquetas:   { bsonType: "array", items: { bsonType: "string" } },
    responsable: { bsonType: "string" }
  }
};

db.createCollection("pedidos", {
  validator: { $jsonSchema: esquemaPedidos },
  validationLevel: "strict",   // valida inserciones y actualizaciones
  validationAction: "error"    // rechaza lo que no cumple
});

// ---------------------------------------------------------------------
// 3) Los 12 pedidos. total = cantidad x precioUnitario del producto.
//    El almacén es el del producto. Fechas como BSON Date (octubre 2026).
// ---------------------------------------------------------------------
db.pedidos.insertMany([
  { _id: 1,  clienteId: "C01", almacen: "Norte",  prioridad: "alta",  estado: "pendiente",   fecha: new Date("2026-10-15T10:00:00Z"),
    articulos: [{ sku: "P01", cantidad: 1, precioUnitario: 15000 }], total: 15000, etiquetas: ["web", "alta"] },
  { _id: 2,  clienteId: "C02", almacen: "Centro", prioridad: "media", estado: "preparacion", fecha: new Date("2026-10-15T10:00:00Z"),
    articulos: [{ sku: "P02", cantidad: 2, precioUnitario: 500 }],   total: 1000,  etiquetas: ["web", "media"], responsable: "operaciones" },
  { _id: 3,  clienteId: "C03", almacen: "Sur",    prioridad: "alta",  estado: "enviado",     fecha: new Date("2026-10-16T10:00:00Z"),
    articulos: [{ sku: "P03", cantidad: 1, precioUnitario: 3200 }],  total: 3200,  etiquetas: ["web", "alta"] },
  { _id: 4,  clienteId: "C04", almacen: "Centro", prioridad: "baja",  estado: "pendiente",   fecha: new Date("2026-10-16T10:00:00Z"),
    articulos: [{ sku: "P04", cantidad: 3, precioUnitario: 300 }],   total: 900,   etiquetas: ["web", "baja"] },
  { _id: 5,  clienteId: "C01", almacen: "Norte",  prioridad: "alta",  estado: "preparacion", fecha: new Date("2026-10-17T10:00:00Z"),
    articulos: [{ sku: "P05", cantidad: 2, precioUnitario: 1800 }],  total: 3600,  etiquetas: ["web", "alta"], responsable: "operaciones" },
  { _id: 6,  clienteId: "C02", almacen: "Centro", prioridad: "media", estado: "entregado",   fecha: new Date("2026-10-17T10:00:00Z"),
    articulos: [{ sku: "P02", cantidad: 4, precioUnitario: 500 }],   total: 2000,  etiquetas: ["web", "media"] },
  { _id: 7,  clienteId: "C03", almacen: "Sur",    prioridad: "alta",  estado: "pendiente",   fecha: new Date("2026-10-18T10:00:00Z"),
    articulos: [{ sku: "P03", cantidad: 2, precioUnitario: 3200 }],  total: 6400,  etiquetas: ["web", "alta"] },
  { _id: 8,  clienteId: "C04", almacen: "Centro", prioridad: "baja",  estado: "pendiente",   fecha: new Date("2026-10-18T10:00:00Z"),
    articulos: [{ sku: "P04", cantidad: 1, precioUnitario: 300 }],   total: 300,   etiquetas: ["web", "baja"] },
  { _id: 9,  clienteId: "C01", almacen: "Norte",  prioridad: "media", estado: "entregado",   fecha: new Date("2026-10-19T10:00:00Z"),
    articulos: [{ sku: "P01", cantidad: 1, precioUnitario: 15000 }], total: 15000, etiquetas: ["web", "media"] },
  { _id: 10, clienteId: "C02", almacen: "Norte",  prioridad: "alta",  estado: "enviado",     fecha: new Date("2026-10-19T10:00:00Z"),
    articulos: [{ sku: "P05", cantidad: 1, precioUnitario: 1800 }],  total: 1800,  etiquetas: ["web", "alta"], responsable: "operaciones" },
  { _id: 11, clienteId: "C03", almacen: "Centro", prioridad: "media", estado: "entregado",   fecha: new Date("2026-10-20T10:00:00Z"),
    articulos: [{ sku: "P02", cantidad: 1, precioUnitario: 500 }],   total: 500,   etiquetas: ["web", "media"] },
  { _id: 12, clienteId: "C04", almacen: "Sur",    prioridad: "baja",  estado: "entregado",   fecha: new Date("2026-10-20T10:00:00Z"),
    articulos: [{ sku: "P03", cantidad: 1, precioUnitario: 3200 }],  total: 3200,  etiquetas: ["web", "baja"] }
]);

// ---------------------------------------------------------------------
// 4) Verificaciones (lo que debes ver en pantalla)
// ---------------------------------------------------------------------
print("Productos (esperado 5): " + db.productos.countDocuments({}));
print("Pedidos (esperado 12): " + db.pedidos.countDocuments({}));
print("Pedidos con fecha tipo Date (esperado 12): " + db.pedidos.countDocuments({ fecha: { $type: "date" } }));

// Importes: suma de cantidad x precioUnitario comparada con total
const malos = db.pedidos.aggregate([
  { $unwind: "$articulos" },
  { $group: { _id: "$_id", total: { $first: "$total" },
              calculado: { $sum: { $multiply: ["$articulos.cantidad", "$articulos.precioUnitario"] } } } },
  { $match: { $expr: { $ne: ["$total", "$calculado"] } } }
]).toArray();
print("Pedidos con importe incorrecto (esperado 0): " + malos.length);
