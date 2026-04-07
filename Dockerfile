# ETAPA 1: Construcción (Usamos Node 20 para compilar el código React/Vite)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Recibimos un argumento para saber qué ambiente construir (dev, qa, o main)
ARG AMBIENTE=main
RUN npm run build:${AMBIENTE}

# ETAPA 2: Servidor (Usamos Nginx ligero para mostrar la página)
FROM nginx:alpine
# Copiamos lo que construyó Node en la etapa 1 hacia el servidor web
COPY --from=build /app/dist /usr/share/nginx/html
# Exponemos el puerto interno del contenedor
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]