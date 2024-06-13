# TECHNICAL TEST Backend

## Installation

pastikan node_modules sudah terinstal atau instal menggunakan

#### `npm install`

atau

#### `yarn`

Run db on docker

## `docker-compose up pasir_db`

for first time

## `create database [name];`
## `npx sequelize db:migrate`
## `npx sequelize-cli db:seed:all`

check db

## `docker exec -it -e MYSQL_PASSWORD=example pasir_db  mysql -u root -p`
## `use [db name]`

make migration
## `npx sequelize-cli migration:create --name [migration_name]`

## Database

pastikan nama database sama dengan yang ada di folder config file config.json

```python
  "development": {
    "username": "root",
    "password": null,
    "database": "pasir",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
```

## Running

jalankan dengan cli

#### `npm run dev`

atau

#### `yarn dev`

jika terjadi error bisa menggunakan

#### `node index.js`

## Pengguan API

Development Path

#### `http://localhost:5020/api/pasir-v1/`

Production Path

#### `http://35.213.157.74:5020/api/pasir-v1`

### Route Auth

| Parameter            | Methods | Parameter                                             |
| :------------------- | :------ | :---------------------------------------------------- |
| /register            | POST    | {nama, username, email,password, role_id} format json |
| /login               | POST    | {email,password} format json                          |
| /logout              | DELETE  | Bearer + token                                        |
| /forget-password/:id | DELETE  | {password1, password2}                                |
| /check-auth          | DELETE  | Bearer + token                                        |

### Route User

`/user`
| Parameter | Methods | Parameter |
| :------------ | :------------|:------------------------------------------- |
| /get|GET| |
| /get/:id|GET| |
| /update/:id|PATCH| {name} |
| /delete/:id|DELETE| |

### Route Role

`/role`
| Parameter | Methods | Parameter |
| :------------ | :------------|:------------------------------------------- |
| /get|GET| |
| /add|POST| {name, permission} |
| /update/:id|PATCH| {name, permission} |
| /delete/:id|DELETE| |

### Route Category

`/category`
| Parameter | Methods | Parameter |
| :------------ | :------------|:------------------------------------------- |
| /get|GET| |
| /get/:id|GET| |
| /add|POST| {name} |
| /update/:id|PATCH| {name} |
| /delete/:id|DELETE| |

### Route Product

`/product`
| Parameter | Methods | Parameter | Function |
| :------------ | :------------|:---------------|:---------------|
| /get|GET| | Ambil semua data dari tabel product |
| /get-chasier|GET| | Ambil data dari tabel product yang ada stoknya |
| /get/:id|GET| | |
| /add|POST| {name} | |
| /add-img|POST| {name, img} format Form | |
| /update/:id|PATCH| | |
| /delete/:id|DELETE| | |
