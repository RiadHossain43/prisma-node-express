## The event tracking server

This repo contains the simple backend logic to store the web-pixel data into a datase.

## Environement variables

```sh
DATABASE_URL= <the-postgres-database-url>
```

## Run this project

- install all the dependecies with `yarn install` or `npm install`
- run migrations `npx prisma migrate dev`
- apply the migrations to the db `npx prisma migrate deploy`
- update the prisma client `npx prisma generate`
- build the project `yarn build` or `npm run build`
- start the server `yarn start` or `npm start`

## How to deploy 

The project can be deployed to any cloud.

- configure the envrionment variables as mentioned above.
- run the specified commands in the cloud machine. 

> Note: `Neon` is a free cloud based solution that can be used to run a test postgres db for free on the cloud to test. Simply create an account and a project in there and you are good to go.
