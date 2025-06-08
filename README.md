# 🚘 ConcesionariaFrontend

Frontend web del sistema de gestión para concesionarias de vehículos, desarrollado con *React*. Este frontend consume una API REST construida con Spring Boot (ver backend [ConcesionariaApp](https://github.com/Henry-Lopez/ConcesionariaApp)).

---

## 📦 Tecnologías utilizadas

- React JS (con Vite o Create React App)
- React Router DOM
- Axios
- JavaScript
- HTML / CSS (con librerías como Skeleton, Normalize, etc.)
- Git + GitHub

---

## 📁 Estructura del proyecto

src/
├── api/ # Servicios Axios para llamadas al backend
│ └── clienteService.js, ventaService.js, etc.
├── components/ # Componentes reutilizables
│ └── Header, Footer, Login, ProductoDetalle, etc.
├── pages/ # Páginas principales
│ └── Home.jsx, LoginPage.jsx, RegistroPage.jsx, etc.
├── styles/ # Archivos CSS
│ └── style.css, skeleton.css, normalize.css
├── App.jsx # Configuración de rutas
├── main.jsx # Punto de entrada

yaml
Copiar
Editar

---

## 🔧 Instalación y ejecución local

1. Clonar el repositorio:
   
git clone https://github.com/Henry-Lopez/ConcesionariaFrontend.git
cd ConcesionariaFrontend
Instalar las dependencias:

bash
Copiar
Editar
npm install
Configurar el endpoint del backend (si necesario):

En src/api/axios.js o donde esté configurado Axios, asegurarse de tener:

js
Copiar
Editar
const API_URL = 'http://localhost:8080/api'; // o tu URL de producción
Ejecutar en modo desarrollo:

bash
Copiar
Editar
npm run dev
Si usás Create React App:

bash
Copiar
Editar
npm start
🔐 Funcionalidad principal
📋 Listado de vehículos, clientes, ventas, reparaciones y repuestos

🛒 Carrito de compra para selección de productos

🔐 Login de personal autorizado (JWT)

✏ Formularios para CRUD

📊 Reportes visuales (gráficas, filtros, exportación PDF/CSV)

📷 Subida de imágenes para productos

🔁 Comunicación con backend
Este frontend consume una API REST ubicada en:
https://github.com/Henry-Lopez/ConcesionariaApp

Las rutas protegidas requieren token JWT en localStorage o encabezado Authorization.
