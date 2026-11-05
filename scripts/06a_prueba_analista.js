// =====================================================================
// 06a_prueba_analista.js  ·  Ejercicio 15 (conectado COMO analista_tienda)
//   load("scripts/06a_prueba_analista.js")   // desde la raíz del repositorio
// =====================================================================
db = db.getSiblingDB("comercio_u2");

print("Lectura permitida · pedido 1:");
printjson(db.pedidos.findOne({ _id: 1 }, { _id: 1, estado: 1 }));

try {
  db.pedidos.updateOne({ _id: 1 }, { $set: { estado: "preparacion" } });
  print("¡La escritura funciono! Revisa roles acumulados del analista.");
} catch (e) {
  print("Escritura RECHAZADA (esperado) · codigo " + e.code + " · " + e.message);
}
