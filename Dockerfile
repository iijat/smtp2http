FROM node:20.11.1-bullseye-slim
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
RUN npm install -g npm@latest
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm ci --omit=dev
USER node
CMD ["dumb-init", "node", "dist/index.js"]