FROM node:20-alpine AS build
WORKDIR /admin-accommodations
COPY package.json package-lock.json* yarn.lock* ./
RUN npm ci --silent
COPY . .
RUN npm run build
 
# Runtime stage (nginx serves the static files)
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /admin-accommodations/dist /usr/share/nginx/html
# Optional: copy a small nginx config if you want to override (not required)
# COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 2246
EXPOSE 80
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]