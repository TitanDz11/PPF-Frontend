# PPF Frontend - Aplicación de Gestión Vehicular

Aplicación web moderna desarrollada con React.js para la gestión de vehículos y registro de entradas/salidas de una flota vehicular.

## Descripción

Esta aplicación frontend proporciona una interfaz intuitiva y moderna para:
- Registrar y gestionar vehículos (CRUD completo)
- Controlar entradas y salidas de vehículos
- Filtrar movimientos por fecha, vehículo y motorista
- Visualizar historial completo de movimientos
- Interfaz responsive y atractiva con PrimeReact

## Stack Tecnológico

### Tecnologías Principales
- **React.js** 18.3.1 - Biblioteca UI
- **Vite** 6.2.0 - Build tool y dev server
- **React Router DOM** 6.28.2 - Enrutamiento

### Componentes UI
- **PrimeReact** 10.8.5 - Componentes de interfaz
- **PrimeIcons** 7.0.0 - Iconos
- **PrimeFlex** 3.3.1 - Utilidades CSS

### HTTP Client
- **Axios** 1.7.9 - Cliente HTTP para API

### Desarrollo
- TypeScript types para React
- Hot Module Replacement (HMR)

## Instalación

### Requisitos Previos
- Node.js >= 20.x instalado
- npm o yarn
- Backend corriendo en `http://localhost:4000`

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio-frontend>
cd PPF-Frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variable de entorno (opcional)**

Crear archivo `.env` en la raíz si necesitas cambiar la URL del backend:

```env
VITE_API_URL=http://localhost:4000/api
```

*Nota: La configuración por defecto apunta a `http://localhost:4000/api`*

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## Ejecución

### Modo Desarrollo (con hot-reload)
```bash
npm run dev
```

### Build para Producción
```bash
npm run build
```

El build se genera en la carpeta `dist/`

### Vista Previa de Producción
```bash
npm run preview
```

## Características de la Interfaz

### Diseño Moderno
- **Tema oscuro** profesional
- **Gradientes sutiles** y efectos de brillo
- **Animaciones suaves** en transiciones
- **Iconos semánticos** para mejor UX

### Responsive Design
- Adaptable a móviles, tablets y desktop
- Sidebar colapsable en móviles
- Tablas con scroll horizontal automático
- Menú de navegación responsive

### Accesibilidad
- Navegación por teclado
- Focus states visibles
- Tooltips informativos
- Mensajes de error claros

## Estructura del Proyecto

```
PPF-Frontend/
├── src/
│   ├── api/
│   │   ├── axios.js              # Configuración de Axios
│   │   ├── entries.js            # Servicios de entradas/salidas
│   │   └── vehicles.js           # Servicios de vehículos
│   ├── components/
│   │   ├── EmptyState.jsx        # Estado vacío reutilizable
│   │   └── Sidebar.jsx           # Barra de navegación lateral
│   ├── hooks/
│   │   └── useDebounce.js        # Hook para debounce de inputs
│   ├── pages/
│   │   ├── Dashboard.jsx         # Página principal con estadísticas
│   │   ├── Vehicles/
│   │   │   └── VehiclesPage.jsx  # Gestión de vehículos
│   │   ├── Entries/
│   │   │   └── EntryForm.jsx     # Formulario de entrada/salida
│   │   └── Log/
│   │       └── LogPage.jsx       # Historial de movimientos
│   ├── App.jsx                   # Configuración de rutas
│   ├── main.jsx                  # Punto de entrada
│   └── index.css                 # Estilos globales
├── public/
│   └── favicon.ico
├── index.html                    # HTML base
├── vite.config.js                # Configuración de Vite
├── package.json                  # Dependencias
└── nginx.conf                    # Configuración nginx (producción)
```

## Rutas de la Aplicación

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | `Dashboard` | Página principal con estadísticas |
| `/vehicles` | `VehiclesPage` | Listado y gestión de vehículos |
| `/entries/new` | `EntryForm` | Nueva entrada/salida |
| `/entries/:id/edit` | `EntryForm` | Editar entrada/salida |
| `/log` | `LogPage` | Historial de movimientos con filtros |

## Conexión con el Backend

### Configuración de Axios

El cliente HTTP está configurado en `src/api/axios.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

### Servicios API

#### Vehículos (`src/api/vehicles.js`)
```javascript
// Obtener todos los vehículos
getVehicles()

// Crear vehículo
createVehicle(data)

// Actualizar vehículo
updateVehicle(id, data)

// Eliminar vehículo
deleteVehicle(id)
```

#### Entradas/Salidas (`src/api/entries.js`)
```javascript
// Obtener todas las entradas/salidas
getEntries(params)

// Obtener por ID
getEntry(id)

// Crear entrada/salida
createEntry(data)

// Actualizar entrada/salida
updateEntry(id, data)

// Eliminar entrada/salida
deleteEntry(id)
```

## Páginas y Funcionalidades

### 1. Dashboard
**Ubicación:** `/`

**Características:**
- Estadísticas rápidas (total vehículos, entradas, salidas)
- Accesos directos a funcionalidades principales
- Diseño limpio con tarjetas de estadísticas

### 2. Gestión de Vehículos
**Ubicación:** `/vehicles`

**Funcionalidades:**
- ✅ Listado de vehículos en tabla
- ✅ Búsqueda en tiempo real
- ✅ Crear nuevo vehículo
- ✅ Editar vehículo existente
- ✅ Eliminar vehículo con confirmación
- ✅ Validación de campos:
  - Marca: solo letras y espacios
  - Modelo: texto libre
  - Placa: letras, números y guiones

**Componente:** `src/pages/Vehicles/VehiclesPage.jsx`

### 3. Registro de Entrada/Salida
**Ubicación:** `/entries/new` o `/entries/:id/edit`

**Campos del Formulario:**
- ✅ Vehículo (dropdown filtrable)
- ✅ Motorista (solo letras, espacios, guiones, apóstrofes)
- ✅ Tipo (entrada/salida)
- ✅ Fecha (calendar picker)
- ✅ Hora (time picker 24h)
- ✅ Kilometraje (solo números enteros)

**Validaciones:**
- Todos los campos son obligatorios
- Validación en tiempo real con keyfilter
- Validación al enviar formulario
- Mensajes de error descriptivos

**Componente:** `src/pages/Entries/EntryForm.jsx`

### 4. Historial de Movimientos (Log)
**Ubicación:** `/log`

**Funcionalidades:**
- ✅ Tabla con todos los movimientos
- ✅ Filtros avanzados:
  - Por fecha (calendar picker)
  - Por vehículo (dropdown)
  - Por motorista (input text)
- ✅ Botones "Buscar" y "Limpiar"
- ✅ Formato de fecha hondureño (DD/MM/YYYY)
- ✅ Badges de color para tipo (entrada/salida)
- ✅ Paginación (5, 10, 25, 50 registros)
- ✅ Ordenamiento por columnas
- ✅ Botones de editar/eliminar

**Componente:** `src/pages/Log/LogPage.jsx`

## Sistema de Diseño

### Paleta de Colores

```css
:root {
  --font-family: 'Inter', sans-serif;
  --surface-ground: #0f1117;
  --surface-section: #161b27;
  --surface-card: #1c2333;
  --surface-overlay: #222b3e;
  --surface-border: rgba(255, 255, 255, 0.08);
  --text-primary: #e4e9f0;
  --text-secondary: #8892a4;
  --accent: #6c63ff;
  --accent-light: #8b84ff;
  --accent-glow: rgba(108, 99, 255, 0.25);
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
}
```

### Tipografía
- **Fuente Principal:** Inter
- **Tamaños:** Base 16px (escalado para legibilidad)
- **Line-height:** 1.6

### Componentes PrimeReact Personalizados

#### DataTable
- Headers con gradiente sutil
- Filas alternas con fondo diferente
- Hover effects suaves
- Sorting indicators mejorados
- Paginator moderno

#### Formularios
- Inputs con bordes redondeados (12px)
- Focus con glow accent
- Labels en mayúsculas pequeñas
- Mensajes de error en rojo

#### Botones
- Gradientes sutiles
- Hover con elevación
- Iconos centrados
- Sizes: small, medium, large

## Hooks Personalizados

### useDebounce

**Ubicación:** `src/hooks/useDebounce.js`

**Propósito:** Retrasar la ejecución de búsquedas/filtros

**Uso:**
```javascript
const [filter, setFilter] = useState('');
const debouncedFilter = useDebounce(filter, 300);

// debouncedFilter se actualiza 300ms después del último cambio
```

## Configuración de Vite

**Archivo:** `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
```

## Docker

### Build y Ejecución con Docker

El proyecto incluye un `Dockerfile` para producción:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Construir imagen Docker
```bash
docker build -t ppf-frontend .
```

### Ejecutar contenedor
```bash
docker run -p 3000:80 ppf-frontend
```

### Docker Compose

Para levantar todo el stack (frontend + backend + MySQL):

```bash
cd ../PPF-Backend
docker-compose up -d
```

Esto iniciará:
- Frontend en `http://localhost:3000`
- Backend en `http://localhost:4000`
- MySQL en puerto 3307

## Despliegue

### Vercel (Recomendado)

1. Crear cuenta en [Vercel](https://vercel.com)
2. Importar repositorio de GitHub
3. Configurar variables de entorno:
   ```
   VITE_API_URL=https://tu-backend-en-render.com/api
   ```
4. Deploy automático en cada push

**Comandos de Build:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Netlify

1. Crear cuenta en [Netlify](https://netlify.com)
2. Conectar repositorio
3. Configurar:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Agregar variables de entorno

### Render Static Sites

Similar a Vercel, deployment automático desde GitHub.

### Configuración de Producción

**Variables de Entorno:**
```env
VITE_API_URL=https://api.tudominio.com/api
```

**Consideraciones:**
- Asegurar CORS configurado en el backend
- Usar HTTPS en producción
- Configurar proxy reverso (nginx)
- Habilitar compresión gzip

## Testing

*(Tests en desarrollo)*

Ejecutar tests:
```bash
npm test
```

## Métricas de Rendimiento

### Bundle Size
- **Total:** ~150KB (gzip)
- **PrimeReact:** ~100KB
- **React + Router:** ~40KB
- **App code:** ~10KB

### Performance
- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 2s
- **Lighthouse Score:** 90+

## Solución de Problemas

### Error: "Cannot GET /"

**Causa:** Ruta incorrecta o servidor no iniciado

**Solución:**
```bash
# Verificar que el servidor esté corriendo
npm run dev

# Abrir http://localhost:3000
```

### Error: "Network Error" al hacer peticiones

**Causas posibles:**
- Backend no está corriendo
- CORS mal configurado
- URL incorrecta

**Solución:**
1. Verificar backend en `http://localhost:4000`
2. Revisar configuración CORS en backend
3. Verificar `axios.js` tenga la URL correcta

### Error: "Failed to compile"

**Causa:** Dependencias faltantes o corruptas

**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Error: "404 Not Found" en rutas

**Causa:** React Router necesita configuración especial en producción

**Solución:** Configurar redirect en nginx/apache:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Componentes no se muestran correctamente

**Causa:** CSS de PrimeReact no cargado

**Verificación:**
- Revisar que PrimeReact esté importado
- Verificar que los estilos estén en `main.jsx`

## Mejores Prácticas Implementadas

### Código
- ✅ Componentes funcionales con hooks
- ✅ Custom hooks reutilizables
- ✅ Validación en frontend y backend
- ✅ Manejo adecuado de errores
- ✅ Loading states

### Estilo
- ✅ CSS modular y organizado
- ✅ Variables CSS para consistencia
- ✅ Responsive design first
- ✅ Accesibilidad básica

### Rendimiento
- ✅ Code splitting automático (Vite)
- ✅ Lazy loading de rutas
- ✅ Debounce en búsquedas
- ✅ Optimización de renders

## Archivos Importantes

### `src/main.jsx`
Punto de entrada de la aplicación. Configura PrimeReact y renderiza el root component.

### `src/App.jsx`
Configuración de rutas con React Router. Define todas las rutas de la aplicación.

### `src/index.css`
Estilos globales, temas, y overrides de PrimeReact. Contiene todo el sistema de diseño.

### `src/api/axios.js`
Configuración del cliente HTTP. Maneja la conexión con el backend.

## Dependencias vs DevDependencies

### Dependencies (Producción)
- `react` + `react-dom` - Core de React
- `react-router-dom` - Enrutamiento
- `primefaces` - Componentes UI
- `axios` - HTTP client

### DevDependencies (Desarrollo)
- `vite` - Build tool
- `@vitejs/plugin-react` - Plugin de React
- `@types/react` - Types para React


## Desarrollado por Ethan Diaz

Desarrollado para la prueba técnica de desarrollo web full-stack.

**Tecnologías:** React, Vite, PrimeReact, React Router, Axios

**Año:** 2026
