const postgresOptions = {
    'username': process.env.DB_USERNAME,
    'password': process.env.DB_PASSWORD,
    'port': process.env.DB_PORT || 5432,
    'database': process.env.DB_NAME || 'film_reservation',
    'host': process.env.DB_HOST || ''
}

module.exports = postgresOptions;