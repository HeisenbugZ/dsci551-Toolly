# Toolly 

## Description

DSCI-551 Project

## Installation

Prerequisite: ensure `node > 16` is installed

Install pnpm (a fast alternative to npm)

```bash
npm install -g pnpm
```

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

## Deployment

Use pm2 to manage the deployed app.

```bash
# Start the deployed application
pnpm start:prod
# Update
git pull && pnpm start:prod
# Logs
pm2 logs
```

API Endpoint: http://ec2-54-86-140-217.compute-1.amazonaws.com:8888/


## Database

Only production environment needs [migrations](https://typeorm.io/#/migrations/).

Create migration:

```bash
GEN_MIGRATION=<YOUR_MIGRATION_NAME> pnpm gen-migrate:prod
```

Perform migration onto the database

```bash
pnpm migrate:prod
```

## Test

```bash
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

# test coverage
$ pnpm test:cov
```

## API Reference

### Authorization

#### /api/auth/register

POST

```bash
curl http://localhost:3000/auth/register -X POST  -d '{"name": "john", "password": "changeme", "email": "494450105+3@qq.com", "address": "xiabeize"}' -H "Content-Type: application/json"
{"name":"john","email":"494450105+3@qq.com","address":"xiabeize","id":9,"created":"2022-03-09T13:54:01.396Z","updated":"2022-03-09T13:54:01.396Z"}%  
```

#### /api/auth/login

POST

```bash
curl http://localhost:3000/auth/login -X POST  -d '{"password": "changeme", "email": "494450105+3@qq.com"}' -H "Content-Type: application/json"
6IOKV4X1DRcdOTI8AVISaQ
```

### Users

#### /api/users/me

GET

```bash
curl http://localhost:3000/user/me -X GET -H "Authorization: Bearer 6IOKV4X1DRcdOTI8AVISaQ" -H "Content-Type: application/json"
{
    "id": 9,
    "name": "joe",
    "email": "494450105+3@qq.com",
    "address": "white house",
    "created": "2022-03-09T13:54:01.396Z",
    "updated": "2022-03-09T23:41:51.274Z",
    "role": "admin",
    "profilePhoto": {
        "url": "SgHm4xEvnAUWnY3oHeUS6QsQhm8",
        "name": "T Logo BB.png",
        "mimeType": "image/png",
        "created": "2022-03-09T23:12:58.209Z"
    }
}
```

PATCH

```bash
curl http://localhost:3000/users/me -X PATCH -H "Authorization: Bearer ox1sTAGB7UY7dbbw0q7Mfg" -H "Content-Type: application/json" -d '{ "name": "joe", "address": "white house" }'

{
    "id": 9,
    "name": "joe",
    "email": "494450105+3@qq.com",
    "address": "white house",
    "created": "2022-03-09T13:54:01.396Z",
    "updated": "2022-03-09T23:41:51.274Z",
    "role": "admin",
    "profilePhoto": {
        "url": "SgHm4xEvnAUWnY3oHeUS6QsQhm8",
        "name": "T Logo BB.png",
        "mimeType": "image/png",
        "created": "2022-03-09T23:12:58.209Z"
    }
}
```

### Files

Manages files hosted at AWS S3

#### /api/files

Uploads up to 10 files in a row.

```bash
curl --location --request POST 'http://localhost:3123/files/' \
--header 'Authorization: Bearer ox1sTAGB7UY7dbbw0q7Mfg' \
--form 'files=@"/Users/chenyuwang/Downloads/T Logo BB.png"'

[
    {
        "url": "SgHm4xEvnAUWnY3oHeUS6QsQhm8",
        "createdBy": {
            "id": 9,
            "name": "joe",
            "email": "494450105+3@qq.com",
            "address": "white house",
            "created": "2022-03-09T13:54:01.396Z",
            "updated": "2022-03-09T21:33:31.571Z"
        },
        "mimeType": "image/png",
        "name": "T Logo BB.png"
    }
]
```

### Tools

Manager CRUD, recommendation, search of tools. A tool is a description of a tool, not an actual real tool objects that can be borrowed.

#### /api/tools

GET

```bash
curl --location --request GET 'http://localhost:3123/tools?page=1&limit=10' \
--header 'Authorization: Bearer ox1sTAGB7UY7dbbw0q7Mfg' \
--data-raw ''

{
    "items": [
        {
            "id": 11,
            "name": "toy",
            "introduction": "funny one",
            "created": "2022-03-10T11:14:34.923Z",
            "updated": "2022-03-10T11:14:34.923Z",
            "photos": [
                {
                    "url": "https://toolly-media.s3.amazonaws.com/VgEkap38tKlRuqhpI_7wU1sZ7to",
                    "name": "T Logo BB.png",
                    "mimeType": "image/png",
                    "created": "2022-03-10T10:26:28.228Z"
                }
            ]
        },
        // ...
    ],
    "meta": {
        "totalItems": 11,
        "itemCount": 10,
        "itemsPerPage": 10,
        "totalPages": 2,
        "currentPage": 1
    }
}
```

POST

```bash
curl --location --request POST 'http://localhost:3123/tools' \
--header 'Authorization: Bearer ox1sTAGB7UY7dbbw0q7Mfg' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "toy",
    "introduction": "funny one",
    "photoUrls": ["https://toolly-media.s3.amazonaws.com/VgEkap38tKlRuqhpI_7wU1sZ7to"],
    "categoryIds": [1]
}'

{
    "user": {
        "id": 9,
        "name": "joe",
        "email": "494450105+3@qq.com",
        "address": "white house",
        "created": "2022-03-09T13:54:01.396Z",
        "updated": "2022-03-09T23:41:51.274Z",
        "role": "admin"
    },
    "name": "toy",
    "introduction": "funny one",
    "photos": [
        {
            "url": "https://toolly-media.s3.amazonaws.com/VgEkap38tKlRuqhpI_7wU1sZ7to",
            "name": "T Logo BB.png",
            "mimeType": "image/png",
            "created": "2022-03-10T10:26:28.228Z"
        }
    ],
    "catogories": [
        {
            "id": 1,
            "name": "Party",
            "created": "2022-03-10T23:56:17.136Z",
            "updated": "2022-03-10T23:56:17.136Z"
        }
    ],
    "id": 13,
    "created": "2022-03-11T00:18:38.380Z",
    "updated": "2022-03-11T00:18:38.380Z"
}
```


#### /api/tools/:id

GET

```bash
curl --location --request GET 'http://localhost:3123/tools/2' \
--header 'Authorization: Bearer ox1sTAGB7UY7dbbw0q7Mfg'
{
    "id": 2,
    "name": "xianggang",
    "introduction": "funny one",
    "created": "2022-03-10T11:13:20.404Z",
    "updated": "2022-03-11T00:15:04.081Z",
    "user": {
        "id": 9,
        "name": "joe",
        "email": "494450105+3@qq.com",
        "address": "white house",
        "created": "2022-03-09T13:54:01.396Z",
        "updated": "2022-03-09T23:41:51.274Z",
        "role": "admin"
    },
    "photos": [
        {
            "url": "https://toolly-media.s3.amazonaws.com/VgEkap38tKlRuqhpI_7wU1sZ7to",
            "name": "T Logo BB.png",
            "mimeType": "image/png",
            "created": "2022-03-10T10:26:28.228Z"
        }
    ],
    "categories": [
        {
            "id": 1,
            "name": "Party",
            "created": "2022-03-10T23:56:17.136Z",
            "updated": "2022-03-10T23:56:17.136Z"
        },
        {
            "id": 2,
            "name": "Gardening",
            "created": "2022-03-10T23:56:44.347Z",
            "updated": "2022-03-10T23:56:44.347Z"
        }
    ]
}
```

PATCH

```bash
curl --location --request PATCH 'http://localhost:3123/tools/2' \
--header 'Authorization: Bearer ox1sTAGB7UY7dbbw0q7Mfg' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "xianggang",
    "categoryIds": [1, 2],
    "photoUrls": ["https://toolly-media.s3.amazonaws.com/VgEkap38tKlRuqhpI_7wU1sZ7to"]
}'

{
    "id": 2,
    "name": "xianggang",
    "introduction": "funny one",
    "created": "2022-03-10T11:13:20.404Z",
    "updated": "2022-03-11T00:15:04.081Z",
    "photos": [
        {
            "url": "https://toolly-media.s3.amazonaws.com/VgEkap38tKlRuqhpI_7wU1sZ7to",
            "name": "T Logo BB.png",
            "mimeType": "image/png",
            "created": "2022-03-10T10:26:28.228Z"
        }
    ],
    "categories": [
        {
            "id": 1,
            "name": "Party",
            "created": "2022-03-10T23:56:17.136Z",
            "updated": "2022-03-10T23:56:17.136Z"
        },
        {
            "id": 2,
            "name": "Gardening",
            "created": "2022-03-10T23:56:44.347Z",
            "updated": "2022-03-10T23:56:44.347Z"
        }
    ]
}
```

DELETE

```bash
curl --location --request DELETE 'http://localhost:3123/tools/1' \
--header 'Authorization: Bearer ox1sTAGB7UY7dbbw0q7Mfg'
```

### Category

Describes categories of tools. Each tool can have more than one category, so it's a Many-to-Many relation. Categories are read-only to ordinary users.

#### /api/category

POST

**Admin Only**

```bash
curl --location --request POST 'http://localhost:3123/categories' \
--header 'Authorization: Bearer ox1sTAGB7UY7dbbw0q7Mfg' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "C",
    "photoUrls": ["https://toolly-media.s3.amazonaws.com/VgEkap38tKlRuqhpI_7wU1sZ7to"]
}'

{
    "name": "C",
    "photos": [
        {
            "url": "https://toolly-media.s3.amazonaws.com/VgEkap38tKlRuqhpI_7wU1sZ7to",
            "name": "T Logo BB.png",
            "mimeType": "image/png",
            "created": "2022-03-10T10:26:28.228Z"
        }
    ],
    "tools": [],
    "createdBy": {
        "id": 9,
        "name": "joe",
        "email": "494450105+3@qq.com",
        "address": "white house",
        "created": "2022-03-09T13:54:01.396Z",
        "updated": "2022-03-09T23:41:51.274Z",
        "role": "admin"
    },
    "id": 7,
    "created": "2022-03-10T23:57:11.396Z",
    "updated": "2022-03-10T23:57:11.396Z"
}
```

GET

```bash
curl --location --request GET 'http://localhost:3123/categories?page=1&limit=2' \
--header 'Authorization: Bearer ox1sTAGB7UY7dbbw0q7Mfg'

{
    "items": [
        {
            "id": 7,
            "name": "C",
            "created": "2022-03-10T23:57:11.396Z",
            "updated": "2022-03-10T23:57:11.396Z",
            "photos": [
                {
                    "url": "https://toolly-media.s3.amazonaws.com/VgEkap38tKlRuqhpI_7wU1sZ7to",
                    "name": "T Logo BB.png",
                    "mimeType": "image/png",
                    "created": "2022-03-10T10:26:28.228Z"
                }
            ]
        },
        {
            "id": 6,
            "name": "B",
            "created": "2022-03-10T23:57:08.891Z",
            "updated": "2022-03-10T23:57:08.891Z",
            "photos": [
                {
                    "url": "https://toolly-media.s3.amazonaws.com/VgEkap38tKlRuqhpI_7wU1sZ7to",
                    "name": "T Logo BB.png",
                    "mimeType": "image/png",
                    "created": "2022-03-10T10:26:28.228Z"
                }
            ]
        }
    ],
    "meta": {
        "totalItems": 7,
        "itemCount": 2,
        "itemsPerPage": 2,
        "totalPages": 4,
        "currentPage": 1
    }
}
```

#### Rental

Rental describes the status of an actual rental transaction between the renter and borrower. 

Check the entity definition of rental to learn more.

A rental is associated with three user ids:

+ initiator: The one who starts the rental. The initiator can be either borrower or renter.

+ borrower: The lending side.

+ renter: The renting side.

A rental has an enum field called `RentalStatus`. It has a few options:

+ await_confirmation: The rental is started, awaiting the other side to agree. `expectedDelivery`, `note` and `expectedReturn` are editable for both sides in this status.

+ confirmed: The passive side can confirm the rental. After this status, `expectedDelivery` and `expectedReturn` cannot be edited.

+ delivered: The tool is delivered to the borrower. `actualDelivery` is recorded by the renter.

+ returned: The tool is returned to the renter. `actualReturn` is recorded by the lender.

+ cancelled: The rental is cancelled. This can only happen before `delivered`.

# Test Users

xiejinpeng@gmail.com
orangehead.p@gmail.com
wangchenyu2017@gmail.com
ann@xxx.com

Master password: 123