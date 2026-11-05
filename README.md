# Mercado Ágil · Prototipo NoSQL con MongoDB Atlas y Neo4j AuraDB

Prototipo de gestión de pedidos para una tienda ficticia, construido en la nube con planes gratuitos.

- **MongoDB Atlas (M0 Free):** productos y pedidos como documentos, con validación de esquema.
- **Neo4j AuraDB Free:** grafo de dependencias entre los servicios de la tienda.

## Cómo ejecutarlo

1. Crear un clúster M0 en MongoDB Atlas, autorizar la IP y crear los usuarios `admin_tienda`, `analista_tienda` y `operador_tienda`.
2. Instalar `mongosh` y MongoDB Database Tools.
3. Desde la raíz del repositorio, conectarse con `mongosh` como `admin_tienda` y ejecutar los scripts en orden:

```js
load("scripts/01_productos_pedidos.js")
load("scripts/02_pruebas_integridad.js")
load("scripts/03_consultas.js")
load("scripts/04_cambios_controlados.js")
load("scripts/05_agregaciones_indice.js")
```

4. Ejecutar `scripts/servicios.cypher` en el editor Query de Neo4j AuraDB.
