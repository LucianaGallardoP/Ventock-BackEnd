# Ventock — Backend

API REST para Ventock, gestor de ventas y stock. Maneja autenticación, usuarios, categorías, productos y ventas sobre MongoDB.

## Stack

- Node.js + Express 5
- MongoDB + Mongoose
- JWT para autenticación
- express-validator

## Instalación

npm install

## Scripts

Comando       | Descripción
`npm run dev` | Levanta el servidor con recarga automática (`--watch`)
`npm start`   | Levanta el servidor en modo producción                

## Deploy

Desplegado en Vercel (`vercel.json` enruta todo `/api/*` a `index.js`). La rama de producción es `main` — los cambios en `dev` no se reflejan en el deploy hasta que se mergean a `main`.
