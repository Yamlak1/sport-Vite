# # Step 1: Build the Vite app
# FROM node:18 AS builder
# WORKDIR /app
# COPY package*.json ./
# # Use --unsafe-perm to work around esbuild ETXTBSY error
# RUN npm install --unsafe-perm
# COPY . .
# RUN npm run build

# # Step 2: Serve the static files using Nginx
# FROM nginx:stable-alpine
# # Set a default PORT; Cloud Run will override this if needed.
# ENV PORT=8080
# COPY --from=builder /app/dist /usr/share/nginx/html
# # Copy the Nginx configuration template
# COPY default.conf.template /etc/nginx/templates/default.conf.template
# EXPOSE $PORT
# # Substitute the environment variable into the config template and run Nginx
# CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]



# Step 1: Build the Vite app
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
# Use --unsafe-perm to work around esbuild ETXTBSY error
RUN npm install --unsafe-perm
COPY . .
RUN npm run build

# Step 2: Serve the static files using Nginx
FROM nginx:stable-alpine
# Set a default PORT; Cloud Run will override this if needed.
ENV PORT=8080
COPY --from=builder /app/dist /usr/share/nginx/html
# Ensure Nginx can read the static files
RUN chmod -R 755 /usr/share/nginx/html
# Copy the Nginx configuration template
COPY default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE $PORT
# Substitute the environment variable into the config template and run Nginx
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
