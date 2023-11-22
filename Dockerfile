FROM node:18 as build-stage
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm install
COPY . .
RUN pnpm run type-check
RUN pnpm vite build --base=/construction-site-management-portal/ --mode production 
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/templates/default.conf.template
CMD ["nginx", "-g", "daemon off;"]