# Posts Manager — Backend

API REST para gestión de posts y comentarios con soporte de imágenes. Construida con NestJS, MongoDB y MinIO para almacenamiento de archivos.

## Tecnologías

- **NestJS** — framework backend
- **MongoDB** — base de datos
- **MinIO** — almacenamiento de imágenes
- **Docker** — contenedores para MongoDB y MinIO
- **JWT** — autenticación

## Requisitos previos

- Node.js 18 o superior
- npm
- Docker y Docker Compose

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd posts-manager-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y ajusta los valores si es necesario:

```bash
cp .env.example .env
```

Contenido del `.env`:

```env
PORT=3000

MONGO_ROOT_USER=root
MONGO_ROOT_PASSWORD=root
MONGO_DB=posts_manager
MONGO_URI=mongodb://root:root@localhost:27019/posts_manager?authSource=admin

JWT_SECRET=super_secret_key_2026

MINIO_PORT=9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=admin123
MINIO_BUCKET=posts
MINIO_PUBLIC_URL=http://localhost:9000
```

> `MONGO_URI` se usa en desarrollo local. En el stack Docker, la URI se construye automáticamente desde `MONGO_ROOT_USER`, `MONGO_ROOT_PASSWORD` y `MONGO_DB`.

### 4. Levantar con Docker (stack completo)

```bash
docker compose up -d --build
```

Esto levanta todos los servicios:

| Servicio       | Descripción                          | Puerto(s)        |
|----------------|--------------------------------------|------------------|
| `api`          | Backend NestJS                       | `3000`           |
| `mongodb`      | Base de datos con seed inicial       | `27019`          |
| `minio`        | Almacenamiento de imágenes           | `9000`, `9001`   |
| `minio-init`   | Crea el bucket y carga imágenes seed | —                |

> La primera vez que se levanta, el seed de MongoDB crea 10 usuarios, 5 posts y 5 comentarios de ejemplo.

La API queda disponible en `http://localhost:3000`.

### Alternativa: desarrollo local

Si prefieres hot-reload durante el desarrollo, levanta solo la infraestructura y corre el backend por separado:

```bash
docker compose up -d mongodb minio minio-init
npm run start:dev
```

## Documentación de la API

La documentación interactiva (Scalar) está disponible en:

```
http://localhost:3000/docs
```

Desde ahí se pueden probar todos los endpoints. Para los endpoints protegidos, primero hacer login y pegar el token en el botón **Authorize**.

## Credenciales de prueba

Todos los usuarios del seed tienen la contraseña `12345`. Ejemplo de usuario para login:

```json
{
  "email": "juanperez@example.com",
  "password": "12345"
}
```

## Consolas de administración

| Servicio | URL                      | Usuario  | Contraseña |
|----------|--------------------------|----------|------------|
| MinIO    | http://localhost:9001    | `admin`  | `admin123` |

## Endpoints principales

| Método | Ruta                | Descripción                        | Auth |
|--------|---------------------|------------------------------------|------|
| POST   | `/auth/login`       | Login y obtención de token JWT     | No   |
| GET    | `/users`            | Listar usuarios                    | Si   |
| GET    | `/posts`            | Listar todos los posts             | Si   |
| POST   | `/posts`            | Crear post (con imágenes opcionales)| Si   |
| PUT    | `/posts/:id`        | Actualizar post                    | Si   |
| DELETE | `/posts/:id`        | Eliminar post                      | Si   |
| POST   | `/posts/bulk`       | Carga masiva de posts              | Si   |
| GET    | `/comments`         | Listar comentarios (filtro postId) | Si   |
| POST   | `/comments`         | Crear comentario                   | Si   |
| PUT    | `/comments/:id`     | Actualizar comentario              | Si   |
| DELETE | `/comments/:id`     | Eliminar comentario                | Si   |

## Subida de imágenes

Los endpoints `POST /posts` y `PUT /posts` aceptan `multipart/form-data`. El campo para las imágenes es `images`.

- Formatos permitidos: `jpg`, `jpeg`, `png`, `gif`, `webp`, `svg`
- Tamaño máximo por archivo: **6 MB**
- Máximo de archivos por request: **10**

En el `PUT`, el campo `keepUrls` permite indicar qué imágenes existentes conservar. Las que no se incluyan se eliminan de MinIO automáticamente.

## Carga masiva de posts

El endpoint `POST /posts/bulk` acepta un array JSON con la siguiente estructura:

```json
[
  {
    "title": "Introducción a NestJS",
    "body": "NestJS es un framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables."
  },
  {
    "title": "Angular Signals",
    "body": "Los signals en Angular ofrecen una nueva forma de manejar el estado reactivo sin depender exclusivamente de RxJS."
  }
]
```

> Desde la sección **Mis posts** de la aplicación web se puede descargar esta plantilla, editarla y subirla directamente desde el modal de carga masiva.

## Scripts disponibles

```bash
npm run start:dev    # Desarrollo con hot-reload
npm run start:prod   # Producción
npm run build        # Compilar
```
