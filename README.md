# Spaced Repetition API

## API endpoints

- /api/language - GET - get all words and the user's language data

- /api/language/head - GET - get the user's next word

- /api/language/guess - POST - submit the user's guess, and receive a response with data on the results, score, and next word 
## Project Description

🎯 **Task**  
- Develop the business logic and user interface to satisfy user stories, integration tests, and end-to-end tests
- Application must use a linked list in the business logic

📋 **Tech Notes**

- 🧪  ___Testing___
    - **End-to-end:** Cypress
    - **Integration:** Mocha/Chai, Supertest
- 💻  ___Frontend___:
    - **Framework:** React.js
    - **Language:** JS ES6
    - **Styling:** CSS
    - **State management:** Context API
- 📡💾 ___API/Backend___:
    - **API Structure:** RESTful
    - **User Authentication:** JWTs
    - **ORM:** Knex.js
    - **Database:** PostgreSQL
- 🌠 ___Other Attributes:___
    - Single Page Application
    - Mobile First
    - Responsive
    - Semantic HTML (Accessability)

## API Endpoints


## Local dev setup

If using user `dunder-mifflin`:

```bash
mv example.env .env
createdb -U dunder-mifflin spaced-repetition
createdb -U dunder-mifflin spaced-repetition-test
```

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env MIGRATION_DB_NAME=spaced-repetition-test npm run migrate
```

And `npm test` should work at this point

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start supervisor (nodemon replacement) for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`
