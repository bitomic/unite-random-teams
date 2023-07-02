# Base Stage
FROM node:19-alpine3.15 AS base

WORKDIR /home/node/app

ENV NODE_ENV="development"
ENV CI=true

RUN apk add -u --no-cache \
	dumb-init \
	fontconfig \
	jq \
	nodejs

COPY --chown=node:node yarn.lock .
COPY --chown=node:node package.json .
COPY --chown=node:node .yarn/ .yarn/
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node static/ static/
COPY --chown=node:node svelte.config.js .
COPY --chown=node:node vite.config.ts .
COPY --chown=node:node .svelte-kit/ .svelte-kit/

ENTRYPOINT [ "dumb-init", "--" ]

# Build Stage
FROM base AS builder

WORKDIR /home/node/app

ENV NODE_ENV="development"

COPY --chown=node:node tsconfig.json tsconfig.json
RUN yarn install --immutable

COPY --chown=node:node src/ src/
RUN yarn run build

# Runner Stage
FROM base AS runner

WORKDIR /home/node/app

ENV NODE_ENV="production"

COPY --chown=node:node --from=builder /home/node/app/dist dist
# COPY --chown=node:node --from=builder /home/node/app/node_modules node_modules

RUN yarn workspaces focus --all --production
RUN chown node:node /home/node/app

USER node
# EXPOSE 3000

ENV CI=
CMD [ "yarn", "node", "dist" ]