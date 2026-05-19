db = db.getSiblingDB('posts_manager');

db.createUser({
  user: 'root',
  pwd: 'root',
  roles: [{ role: 'readWrite', db: 'posts_manager' }],
});

const posts = db.posts.insertMany([
  {
    title: 'Introducción a NestJS',
    body: 'NestJS es un framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables.',
    author: 'Ana García',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Angular Signals: el futuro de la reactividad',
    body: 'Los signals en Angular 16+ ofrecen una nueva forma de manejar el estado reactivo sin depender exclusivamente de RxJS.',
    author: 'Carlos López',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'MongoDB con Mongoose en NestJS',
    body: 'Aprende a integrar MongoDB usando Mongoose dentro de un proyecto NestJS con esquemas tipados y validaciones.',
    author: 'María Rodríguez',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Formularios reactivos en Angular',
    body: 'Los formularios reactivos permiten un control total sobre la validación y el estado del formulario desde el componente.',
    author: 'Pedro Martínez',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Docker para desarrolladores',
    body: 'Docker simplifica el despliegue y la portabilidad de aplicaciones mediante contenedores ligeros y reproducibles.',
    author: 'Laura Sánchez',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

const postIds = Object.values(posts.insertedIds);

db.comments.insertMany([
  {
    postId: postIds[0],
    name: 'Juan Pérez',
    email: 'juan@example.com',
    body: 'Excelente artículo, muy bien explicado.',
    createdAt: new Date(),
  },
  {
    postId: postIds[0],
    name: 'Sofía Torres',
    email: 'sofia@example.com',
    body: 'Me ayudó mucho para entender los módulos en Nest.',
    createdAt: new Date(),
  },
  {
    postId: postIds[1],
    name: 'Andrés Ruiz',
    email: 'andres@example.com',
    body: 'Los signals son un cambio de paradigma enorme en Angular.',
    createdAt: new Date(),
  },
  {
    postId: postIds[2],
    name: 'Valentina Cruz',
    email: 'valentina@example.com',
    body: 'Muy útil la parte de esquemas tipados con TypeScript.',
    createdAt: new Date(),
  },
  {
    postId: postIds[3],
    name: 'Marcos Díaz',
    email: 'marcos@example.com',
    body: 'Prefiero los formularios reactivos sobre los template-driven.',
    createdAt: new Date(),
  },
]);
