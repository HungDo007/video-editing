FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build
CMD ["npm", "start"]

FROM nginx:1.21.0-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]