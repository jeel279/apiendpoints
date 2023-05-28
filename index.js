const express = require('express')
const app = express()
const api = require('./api')
const encrypt = require('bcrypt')
const db = require('./db')
app.use('/api',api)



app.listen(8080,async()=>{
    // const rq = await db(`SELECT * FROM users.users WHERE email='johndoe@mail.com';`)
    // console.log(rq)
})