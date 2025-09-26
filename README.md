# Biblioteca Escolar - Sistema de Gestión

Este proyecto es un sistema de gestión de biblioteca escolar. Permite el registro y login de usuarios, gestión de libros y préstamos, y funciones administrativas para agregar, editar o eliminar libros.

---

## Tecnologías

- **Backend:** Node.js, Express.js
- **Base de datos:** MongoDB, Mongoose
- **Autenticación:** JWT (JSON Web Tokens)
- **Frontend:** HTML, CSS, JavaScript
- **Archivos de configuración:** `.env` para variables de entorno

---

## Estructura del Proyecto

📂 PROYECTO_PERSONAL_LIBRERIA_CSOLIS
├── node_modules
├── src
│ ├── config
│ │ ├── createAdmin.js
│ │ ├── database.js
│ │ └── seedData.js
│ ├── controllers
│ │ ├── authController.js
│ │ ├── bookController.js
│ │ └── loanController.js
│ ├── middleware
│ │ ├── auth.js
│ │ └── upload.js
│ ├── models
│ │ ├── Book.js
│ │ ├── Loan.js
│ │ └── User.js
│ ├── routes
│ │ ├── authRoutes.js
│ │ ├── bookRoutes.js
│ │ └── loanRoutes.js
│ └── ...
├── public
│ ├── index.html
│ ├── script.js
│ └── styles.css
├── uploads
│ └── ...
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── server.js

---

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd backend
npm install

MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta
PORT=5000


npm run dev // para correr el proyecto PUERTO 3000


## Funcionalidades

Registro y login de usuarios con roles: estudiante o administrador.

CRUD de libros (solo administradores pueden crear, actualizar y eliminar).

Solicitud de préstamos y devolución de libros.

Cálculo de multa por retraso en la devolución.

Filtro de libros por categoría y búsqueda por título.

Interfaz de usuario dinámica con HTML y JavaScript.

## Uso

Registrar un usuario o iniciar sesión.

Navegar entre secciones: Libros, Préstamos, Administración.

Administradores pueden agregar, editar y eliminar libros.

Usuarios pueden solicitar préstamos y devolver libros.

Los libros se actualizan dinámicamente en la interfaz según su estado.
```
