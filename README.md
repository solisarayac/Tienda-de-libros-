# Biblioteca App

## Descripción
Aplicación web de gestión de biblioteca con roles **Admin** y **Estudiante**. Permite agregar, editar y eliminar libros, gestionar préstamos y devoluciones, y visualizar información de manera organizada y estética.

---

## Tecnologías
- **Frontend:** React, Bootstrap
- **Backend:** Node.js, Express
- **Base de datos:** MongoDB
- **Autenticación:** JWT
- **Otros:** Multer para manejo de imágenes

---

## Instalación

1. Clona el repositorio:  
```bash
git clone <url-del-repo>
Instala dependencias en backend y frontend:

bash
Copiar código
cd backend
npm install

cd ../frontend
npm install
Configura variables de entorno en el backend (.env):

env
Copiar código
PORT=5000
MONGO_URI=<tu-mongo-uri>
JWT_SECRET=<tu-secret>
TOKEN_EXPIRES_IN=7d
Ejecuta la app:

Backend:

bash
Copiar código
cd backend
npm run dev
Frontend:

bash
Copiar código
cd frontend
npm start
Funcionalidades
Roles
Admin:

Agregar libros

Editar y eliminar libros

Ver todos los préstamos activos

Estudiante:

Pedir libros disponibles

Devolver libros

Visualizar sus préstamos

Libros
Vista de libros disponibles con portada y detalles

Edición de libros solo para admin

Eliminación de libros solo para admin

Préstamos
Solicitud de préstamos solo para estudiantes

Devolución de libros

Tabla de préstamos con estado: Prestado o Devuelto

Modal de confirmación para pedir y devolver libros

Autenticación
Registro y login con roles

Persistencia de sesión mediante JWT

Diseño estético y responsive

Estructura de carpetas
bash
Copiar código
/backend
  /controllers
  /middlewares
  /models
  /routes
/frontend
  /components
  /assets
  App.jsx
  index.jsx