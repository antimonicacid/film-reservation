require('dotenv').config();

const postgres = require('postgres');
const postgresOptions = require('./config/postgresOptions');
const sql = postgres(postgresOptions);

const bcrypt = require('bcrypt');

// Create user table in DB with an admin user
const createUserTable = async () => {
    try {
        await sql`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(5) NOT NULL,
        refresh_token VARCHAR(255) 
        )`

        const duplicate = await sql`SELECT FROM users
        WHERE email = 'admin@admin.com'`;
    
        if (duplicate.length > 0) return;

        const adminPassword = await bcrypt.hash('admin', 10);
        
        const admin = {
            'first_name': 'admin',
            'last_name': '',
            'email': 'admin@admin.com',
            'password': adminPassword,
            'role': 'Admin'
        };

        const result = await sql`INSERT INTO users ${sql(admin, 'first_name', 'last_name', 'email', 'password', 'role')}`
        console.log("Created user table");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const createFilmTable = async () => {
    try {
        await sql`CREATE TABLE IF NOT EXISTS films (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description VARCHAR(500) NOT NULL,
        image VARCHAR(500),
        genre VARCHAR(50) NOT NULL
        )`
        console.log("Created film table");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const createShowTable = async () => {
    try {
       await sql`CREATE TABLE IF NOT EXISTS shows (
        id SERIAL PRIMARY KEY,
        price NUMERIC(3,2) NOT NULL,
        capacity INTEGER NOT NULL,
        date DATE,
        time TIME,
        film_id SERIAL REFERENCES films(id) ON DELETE CASCADE
        )`
        console.log("Created shows table");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const createBookingTable = async () => {
    try {
        await sql`CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            seat INTEGER NOT NULL,
            user_id SERIAL REFERENCES users(id) ON DELETE CASCADE,
            show_id SERIAL REFERENCES shows(id) ON DELETE CASCADE
            )`
        console.log("Created bookings table");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const main = async () => {
    await createUserTable();
    await createFilmTable();
    await createShowTable();
    await createBookingTable();

    process.exit(0);
}

main();
