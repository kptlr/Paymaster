FROM node:lts-slim as builder

# Create app directory
WORKDIR /paymaster

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:lts

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /paymaster

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /paymaster/dist ./dist

EXPOSE 8080
CMD [ "node", "dist/src/main.js" ]