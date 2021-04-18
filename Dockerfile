## Stage 1 (base)
FROM node:15.5.1-alpine3.12 as base

RUN adduser node root
# COPY . /home/node/app
# WORKDIR /home/node/app
RUN mkdir /app
WORKDIR /app
# COPY ./ ./
COPY package*.json ./
COPY dist ./
# COPY tsconfig.* ./

RUN npm install -g @nestjs/cli
# RUN npm install -g pm2
# ENV PM2_HOME=/app/.pm2
# ENV PM2_HOME=/home/node/app/.pm2
RUN npm install --only=production 
# RUN npm cache clean --force

# RUN chmod -R 775 /home/node/app
# RUN chown -R node:root /home/node/app

## Stage 2 (development)
# We don't COPY in this stage because we bind-mount for dev
FROM base as dev
ENV NODE_ENV=development
RUN npm install --only=development

## Stage 4 (test)
FROM dev as test
ENV NODE_ENV=test

## Stage 5 (build)
FROM test as build
ENV NODE_ENV=production
RUN npm run prebuild
RUN npm run build
RUN rm -rf ./node_modules

## Stage 6 (production)
FROM base as prod
COPY --from=build /app /app
USER 1000
CMD ["node", "dist/main"]
# CMD ["node", "dist/main"]
