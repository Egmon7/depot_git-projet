# Étape 1 : Build React
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Serveur NGINX
FROM nginx:alpine

# Copie des fichiers build React
COPY --from=build /app/dist /usr/share/nginx/html

# Copie de la config nginx (depuis la racine du projet)
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
