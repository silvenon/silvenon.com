# base node image
FROM node:18-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV=production

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY package.json package-lock.json .npmrc ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

ARG CLOUDINARY_URL

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

COPY . .
RUN CLOUDINRAY_URL=${CLOUDINRAY_URL} npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules

COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
