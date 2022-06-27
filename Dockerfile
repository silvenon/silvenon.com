# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV=production

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY package.json package-lock.json ./
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

COPY . .
# retrieve CLOUDINARY_URL from secrets, needed for building posts
# https://andrei-calazans.com/posts/2021-06-23/passing-secrets-github-actions-docker
RUN \
  --mount=type=secret,id=CLOUDINARY_URL \
  export CLOUDINARY_URL=$(cat /run/secrets/CLOUDINARY_URL) && \
  npm run build

# Finally, build the production image with minimal footprint
FROM base


WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules

COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/app/posts /app/app/posts
COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
