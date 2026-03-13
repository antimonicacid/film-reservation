const postgres = require('postgres');
const postgresOptions = require('../config/postgresOptions')
const sql = postgres(postgresOptions);

const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const {fname, lname, email, pwd} = req.body;

    if (!fname || !lname || !email || !pwd) return res.status(400).json({'message': `${handleBadRequest(fname, lname, email, pwd)}`});

    const duplicate = await sql`SELECT FROM users
        WHERE email = ${email}`;
    
    if (duplicate.length > 0) return res.status(409).json({'message': 'Email is already in use'});

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);

        const newUser = {
            'first_name': fname,
            'last_name': lname,
            'email': email,
            'password': hashedPwd,
            'role': 'User'
        };
        
        const result = await sql`INSERT INTO users ${sql(newUser, 'first_name', 'last_name', 'email', 'password', 'role')}`

        console.log(result);

        return res.status(201).json({'message': `New user ${fname} ${lname} created`});
    } catch (err) {
        return res.status(500).json({'message': err.message});
    } 

}

const handleBadRequest = (fname, lname, email, pwd) => {
    let message = "Missing";
    const params = [fname, lname, email, pwd];
    let length = params.filter((param) => {return (param == null)}).length;

    if (!fname) {
        message += " first name";
        (length === 2) ? message += " and" : (length === 1) ? "" : message += ",";
        length -= 1;
    }
    if (!lname) {
        message += " last name";
        (length === 2) ? message += " and" : (length === 1) ? "" : message += ",";
        length -= 1;
    }
    if (!email) {
        message += " email";
        (length === 2) ? message += " and" : (length === 1) ? "" : message += ",";
        length -= 1;
    }
    if (!pwd) {
        message += " password";
        (length === 2) ? message += " and" : (length === 1) ? "" : message += ",";
        length -= 1;
    }

    message += "."

    return message;
}

module.exports = {registerUser};