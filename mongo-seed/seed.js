db = db.getSiblingDB('posts_manager');

const passwordHash = '$2b$10$oBOWELQM78sGq2iwyCkx4.iE.8o3BIt8CVcN3k8e4rAv3jZiw5jEy';

const users = db.users.insertMany([
  { name: 'Ana García',       email: 'anagarcia@example.com',       password: passwordHash, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Carlos López',     email: 'carloslopez@example.com',     password: passwordHash, createdAt: new Date(), updatedAt: new Date() },
  { name: 'María Rodríguez',  email: 'mariarodriguez@example.com',  password: passwordHash, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Pedro Martínez',   email: 'pedromartinez@example.com',   password: passwordHash, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Laura Sánchez',    email: 'laurasanchez@example.com',    password: passwordHash, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Juan Pérez',       email: 'juanperez@example.com',       password: passwordHash, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Sofía Torres',     email: 'sofiatorres@example.com',     password: passwordHash, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Andrés Ruiz',      email: 'andresruiz@example.com',      password: passwordHash, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Valentina Cruz',   email: 'valentinacruz@example.com',   password: passwordHash, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Marcos Díaz',      email: 'marcosdiaz@example.com',      password: passwordHash, createdAt: new Date(), updatedAt: new Date() },
]);

const userIds = Object.values(users.insertedIds);
// userIds[0]=Ana, [1]=Carlos, [2]=María, [3]=Pedro, [4]=Laura
// userIds[5]=Juan, [6]=Sofía, [7]=Andrés, [8]=Valentina, [9]=Marcos

const MINIO = 'http://localhost:9000/posts';

const posts = db.posts.insertMany([
  { title: 'Introducción a NestJS',                       body: 'NestJS es un framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables.', author: 'Ana García',      userId: userIds[0], imageUrls: [`${MINIO}/nestjs.jpg`, `${MINIO}/backend.jpg`],    createdAt: new Date(), updatedAt: new Date() },
  { title: 'Angular Signals: el futuro de la reactividad', body: 'Los signals en Angular 16+ ofrecen una nueva forma de manejar el estado reactivo sin depender exclusivamente de RxJS.',  author: 'Carlos López',    userId: userIds[1], imageUrls: [`${MINIO}/angular.jpg`, `${MINIO}/frontend.jpg`],  createdAt: new Date(), updatedAt: new Date() },
  { title: 'MongoDB con Mongoose en NestJS',              body: 'Aprende a integrar MongoDB usando Mongoose dentro de un proyecto NestJS con esquemas tipados y validaciones.',               author: 'María Rodríguez', userId: userIds[2], imageUrls: [`${MINIO}/mongodb.jpg`],                          createdAt: new Date(), updatedAt: new Date() },
  { title: 'Formularios reactivos en Angular',            body: 'Los formularios reactivos permiten un control total sobre la validación y el estado del formulario desde el componente.',    author: 'Pedro Martínez',  userId: userIds[3], imageUrls: [`${MINIO}/formularios.jpg`, `${MINIO}/angular.jpg`], createdAt: new Date(), updatedAt: new Date() },
  { title: 'Docker para desarrolladores',                 body: 'Docker simplifica el despliegue y la portabilidad de aplicaciones mediante contenedores ligeros y reproducibles.',            author: 'Laura Sánchez',   userId: userIds[4], imageUrls: [`${MINIO}/docker.jpg`],                           createdAt: new Date(), updatedAt: new Date() },
]);

const postIds = Object.values(posts.insertedIds);

db.comments.insertMany([
  { postId: postIds[0], name: 'Juan Pérez',     email: 'juanperez@example.com',     body: 'Excelente artículo, muy bien explicado.',                          userId: userIds[5], createdAt: new Date() },
  { postId: postIds[0], name: 'Sofía Torres',   email: 'sofiatorres@example.com',   body: 'Me ayudó mucho para entender los módulos en Nest.',                userId: userIds[6], createdAt: new Date() },
  { postId: postIds[1], name: 'Andrés Ruiz',    email: 'andresruiz@example.com',    body: 'Los signals son un cambio de paradigma enorme en Angular.',         userId: userIds[7], createdAt: new Date() },
  { postId: postIds[2], name: 'Valentina Cruz', email: 'valentinacruz@example.com', body: 'Muy útil la parte de esquemas tipados con TypeScript.',              userId: userIds[8], createdAt: new Date() },
  { postId: postIds[3], name: 'Marcos Díaz',    email: 'marcosdiaz@example.com',    body: 'Prefiero los formularios reactivos sobre los template-driven.',      userId: userIds[9], createdAt: new Date() },
]);
