# base node image
FROM node:20-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod=false --frozen-lockfile

# Setup production node_modules
FROM base as production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm prune --prod

# Build the app
FROM base as build

ARG CLOUDINARY_URL

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules

COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json

EXPOSE 3000

CMD ["pnpm", "run", "start"]
