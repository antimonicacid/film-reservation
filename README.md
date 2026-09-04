## Setup
* Run npm install to install the required dependencies.
* Setup a PostgreSQL database that will store all the required data.
* Create a .env file with the following information:
  * DB_USERNAME: The username of the user used to access the PostgreSQL database
  * DB_PASSWORD: The corresponding password of the user.
  * DB_NAME: The name of the database. Defaults to 'film_reservation'
  * DB_HOST: Postgres IP address(es) or domain names(s) (Optional)
  * DB_PORT: Postgres server port. Defaults to 5432.
  * ACCESS_TOKEN_SECRET: Used to sign JWT access tokens.
  * REFRESH_TOKEN_SECRET: Used to sign JWT refresh tokens.
 * Run npm run setup to create the database.
 * An admin user with the email 'admin@admin.com' and password 'admin' has been created.

## Usage

Can be used with the [Film Reservation Frontend](https://github.com/antimonicacid/fr-frontend).
