var pg = require('pg')
var Pool = pg.Pool

class UserTable {
    constructor() {
        this.pool = new Pool({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DATABASE,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT,
        })
        this.createUser = this.createUser.bind(this)
        this.getUser = this.getUser.bind(this)
        this.updateUser = this.updateUser.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.getUsers = this.getUsers.bind(this)
    }

    createUser(req, res) {
        const firstName = req.body.first_name
        const lastName = req.body.last_name
        const name = firstName + " " + lastName
        const email = req.body.email
        if (!(email && lastName && firstName)) {
            res.status(400).send("Invalid input")
            return -1
        }
        this.pool.query('INSERT INTO users (first_name, last_name, name, email) VALUES ($1, $2, $3, $4)', 
            [firstName, lastName, name, email], 
            (error, results) => {
                if (error) {
                    console.log(error)
                    res.status(500).send("Server error")
                }
                res.status(200).send("User created successfully")
            }
        )
    }

    getUser(req, res) {
        const id = req.params.id
        this.pool.query('SELECT * FROM users WHERE id=$1', [id],
            (error, results) => {
                if (error) {
                    console.log(error)
                    res.status(500).send("Server error")
                }
                if (!results.rows[0]) {
                    res.status(404).send("User not found")
                }
                else {
                    res.status(200).json(results.rows[0])
                }
            }
        )
    }

    async updateUser(req, res) {
        const id = req.params.id
        const updates = {}
        const validHeaders = ['first_name', 'last_name', 'email']
        for (let header of validHeaders) {
            let value = req.body[header]
            if (value) {
                updates[header] = value
            }
        }
        if (Object.keys(updates).length === 0) {
            res.status(400).send("Please pass valid input")
            return -1
        }
        let results = await this.pool.query('SELECT * FROM users WHERE id=$1', [id])
        let currentValues = await results.rows[0]
        if (!currentValues) {
            res.status(404).send("User not found")
            return -1
        }
        let finalUpdates = {...currentValues, ...updates}
        const updateArray = [
            finalUpdates.first_name,
            finalUpdates.last_name,
            (finalUpdates.first_name + " " + finalUpdates.last_name),
            finalUpdates.email
        ]
        this.pool.query('UPDATE users SET first_name = $1, last_name = $2, name = $3, email = $4', updateArray,
            (error, results) => {
                if (error) {
                    console.log(error)
                    res.status(500).send("Server error")
                }
                else {
                    res.status(200).json(results.rows[0])
                }
            }
        )
    }

    deleteUser(req, res) {
        const id = req.params.id
        this.pool.query('DELETE FROM users WHERE id=$1', [id],
            (error, results) => {
                if (error) {
                    console.log(error)
                    res.status(500).send("Server error")
                }
                else {
                    if (results.rowCount > 0) {
                        res.status(200).send('User Deleted')
                    }
                    else {
                        res.status(404).send('User not found')
                    }
                }
            }
        )
    }

    getUsers(req, res) {
        this.pool.query('SELECT * FROM users',
            (error, results) => {
                if (error) {
                    console.log(error)
                    res.status(500).send("Server error")
                }
                else {
                    res.status(200).send(results.rows)
                }
            }
        )
    }
}

module.exports = UserTable