# STRNG

STRNG es el sitio de entrenamiento y fitness original reorganizado como una aplicación React + Vite con una API Express/MongoDB independiente. La reestructuración conserva el contenido, los textos, las imágenes, los estilos y la composición visual del sitio original; el cambio principal es que las plantillas originales ahora son renderizadas por React y no se sirven como páginas estáticas desde la raíz.

## Estructura

```text
STRNG/
├── client/
│   ├── public/assets/       # Los mismos recursos originales
│   ├── public/legacy-script.js
│   └── src/
│       ├── legacy/          # Plantillas visuales originales
│       ├── LegacyPage.jsx   # Renderizador React de las plantillas
│       ├── App.jsx          # Rutas SPA
│       └── index.css        # CSS original
├── server/                  # API REST Express + MongoDB
└── README.md
```

## Ejecución

El archivo `server/.env` incluido en este paquete conserva la configuración de MongoDB Atlas del proyecto original.

En una terminal:

```bash
cd server
npm install
npm run dev
```

La API queda disponible en `http://localhost:3001`.

En otra terminal:

```bash
cd client
npm install
npm run dev
```

La interfaz queda disponible en `http://localhost:5173`.

Abre `http://localhost:5173` en el navegador. Vite redirige las solicitudes `/api` hacia Express.

## Rutas

| Ruta | Página original |
|---|---|
| `/` | Inicio |
| `/rutinas` | Rutinas |
| `/alimentacion` | Alimentación |
| `/suplementacion` | Suplementación |
| `/implementos` | Implementos |
| `/imc` | Calculadora IMC |
| `/contacto` | Contacto |
| `/tienda` | Tienda |
| `/rastreo` | Rastreo |
| `/admin` | Administración |

## Comprobaciones

```bash
cd client
npm run build
```

El backend es API pura: no contiene `express.static`, `sendFile` ni un catch-all para entregar el frontend. Sus endpoints principales son `/api/health`, `/api/auth`, `/api/productos`, `/api/paquetes` y `/api/repartidores`.

Si Atlas rechaza la conexión, revisa en MongoDB Atlas que la IP de tu computador esté en **Network Access** y que el usuario de base de datos conserve permisos de lectura y escritura.

## Ingeniería Web II

La implementación incluye los siguientes componentes académicos:

- **Módulo 1:** arquitectura React/Vite + Express + MongoDB Atlas con variables de entorno.
- **Módulo 2:** API REST por recursos, verbos HTTP y contrato OpenAPI 3.0.
- **Módulo 3:** integración frontend-backend mediante JSON, CORS restringido, access token y refresh token.
- **Módulo 4:** modelos Mongoose, relaciones entre paquetes y repartidores, filtros y ordenamiento.
- **Módulo 5:** JWT de corta duración, refresh tokens rotativos, roles y scopes.
- **Módulo 6:** Helmet, rate limiting, validación de claves NoSQL, listas de campos permitidos y CORS restringido.
- **Módulo 7:** Swagger UI, colección Postman y pruebas de integración automatizadas.

### Documentación y pruebas

Con el backend iniciado, la documentación interactiva está disponible en:

```text
http://localhost:3001/api-docs
```

La especificación se encuentra en `docs/openapi.json` y la colección para Postman en `docs/STRNG.postman_collection.json`.

Para ejecutar las pruebas automatizadas contra la base configurada:

```bash
cd server
npm run test:api
```

Las pruebas crean un usuario de desarrollo si no existe y utilizan registros temporales que se eliminan al finalizar. La cuenta de desarrollo creada por `/api/auth/seed` es `admin` con contraseña `strng2025`; debe cambiarse o eliminarse antes de una publicación real.

### Variables de entorno nuevas

Además de `PORT`, `MONGODB_URI` y `JWT_SECRET`, el backend utiliza:

```env
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_SECRET=una-clave-secreta-diferente
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

