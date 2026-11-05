// =====================================================================
// 06b_prueba_operador.js  ·  Ejercicio 15 (conectado COMO operador_tienda)
//   load("scripts/06b_prueba_operador.js")   // desde la raíz del repositorio
// =====================================================================
db = db.getSiblingDB("comercio_u2");

let r = db.pedidos.updateOne({ _id: 1, estado: "pendiente" }, { $set: { estado: "preparacion" } });
print("Actualizacion permitida · modified " + r.modifiedCount + " (esperado 1)");
r = db.pedidos.updateOne({ _id: 1, estado: "preparacion" }, { $set: { estado: "pendiente" } });
print("Restitucion permitida   · modified " + r.modifiedCount + " (esperado 1)");
printjson(db.pedidos.findOne({ _id: 1 }, { _id: 1, estado: 1 }));

try {
  db.getSiblingDB("otra_base_tienda").prueba.insertOne({ x: 1 });
  print("¡Escribio en otra_base_tienda! Revisa el alcance del rol.");
} catch (e) {
  print("Escritura en otra_base_tienda RECHAZADA (esperado) · codigo " + e.code + " · " + e.message);
}
