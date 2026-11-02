FROM node:22-alpine AS builder
WORKDIR /app

# Install ALL deps (including devDependencies where vite lives).
# We set NODE_ENV=development here so npm ci does not skip devDeps.
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_ENQUIRY_ENABLED="true"
ARG VITE_ENQUIRY_API_URL="https://hub.euranixcloud.com/api/v1/enquiries"
ARG VITE_TURNSTILE_SITE_KEY="0x4AAAAAAFw3v3E7oHBjtH0u"
ARG VITE_ENQUIRY_PRIVACY_VERSION="website-enquiries-2026-11-02-v1"
# Build with production mode so Vite outputs optimised assets
RUN NODE_ENV=production npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
