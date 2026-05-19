#!/bin/sh
sleep 5
mc alias set local http://minio:9000 admin admin123
mc mb --ignore-existing local/posts
mc anonymous set public local/posts
mc cp /minio-seed/images/nestjs.jpg     local/posts/nestjs.jpg
mc cp /minio-seed/images/angular.jpg    local/posts/angular.jpg
mc cp /minio-seed/images/mongodb.jpg    local/posts/mongodb.jpg
mc cp /minio-seed/images/formularios.jpg local/posts/formularios.jpg
mc cp /minio-seed/images/docker.jpg     local/posts/docker.jpg
mc cp /minio-seed/images/backend.jpg    local/posts/backend.jpg
mc cp /minio-seed/images/frontend.jpg   local/posts/frontend.jpg
echo "MinIO seed completado"
