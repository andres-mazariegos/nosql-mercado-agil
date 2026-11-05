// =====================================================================
// servicios.cypher  ·  Ejercicios 12 y 13 (Neo4j AuraDB Free)
// Se puede ejecutar varias veces: MERGE no duplica nodos ni relaciones.
// =====================================================================

// Restricción: el nombre de cada servicio es único
CREATE CONSTRAINT servicio_nombre_unico IF NOT EXISTS
FOR (s:Servicio) REQUIRE s.nombre IS UNIQUE;

// Seis servicios
MERGE (:Servicio {nombre: 'Checkout'});
MERGE (:Servicio {nombre: 'Pedidos'});
MERGE (:Servicio {nombre: 'Pagos'});
MERGE (:Servicio {nombre: 'Inventario'});
MERGE (:Servicio {nombre: 'Notificaciones'});
MERGE (:Servicio {nombre: 'Analitica'});

// Siete relaciones DEPENDE_DE (origen depende del destino)
MATCH (a:Servicio {nombre: 'Checkout'}),       (b:Servicio {nombre: 'Pedidos'})    MERGE (a)-[:DEPENDE_DE]->(b);
MATCH (a:Servicio {nombre: 'Checkout'}),       (b:Servicio {nombre: 'Pagos'})      MERGE (a)-[:DEPENDE_DE]->(b);
MATCH (a:Servicio {nombre: 'Pedidos'}),        (b:Servicio {nombre: 'Pagos'})      MERGE (a)-[:DEPENDE_DE]->(b);
MATCH (a:Servicio {nombre: 'Pedidos'}),        (b:Servicio {nombre: 'Inventario'}) MERGE (a)-[:DEPENDE_DE]->(b);
MATCH (a:Servicio {nombre: 'Notificaciones'}), (b:Servicio {nombre: 'Pedidos'})    MERGE (a)-[:DEPENDE_DE]->(b);
MATCH (a:Servicio {nombre: 'Notificaciones'}), (b:Servicio {nombre: 'Pagos'})      MERGE (a)-[:DEPENDE_DE]->(b);
MATCH (a:Servicio {nombre: 'Analitica'}),      (b:Servicio {nombre: 'Pedidos'})    MERGE (a)-[:DEPENDE_DE]->(b);

// Verificación · esperado: 6 servicios y 7 relaciones
MATCH (s:Servicio) RETURN count(s) AS servicios;
MATCH (:Servicio)-[r:DEPENDE_DE]->(:Servicio) RETURN count(r) AS relaciones;

// Ejercicio 13a · dependen DIRECTAMENTE de Pagos · esperado: Checkout, Notificaciones, Pedidos
MATCH (s:Servicio)-[:DEPENDE_DE]->(:Servicio {nombre: 'Pagos'})
RETURN s.nombre AS servicio ORDER BY servicio;

// Ejercicio 13b · afectados entre 1 y 3 saltos · esperado: Analitica, Checkout, Notificaciones, Pedidos
MATCH (s:Servicio)-[:DEPENDE_DE*1..3]->(:Servicio {nombre: 'Pagos'})
RETURN DISTINCT s.nombre AS servicio ORDER BY servicio;
