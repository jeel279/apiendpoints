const { Client } = require('pg')
 
async function query(sql){
  try{
    const credentials = {
      host: 'dpg-chpkkfvdvk4goetan340-a.singapore-postgres.render.com',
          port: 5432,
          database: process.env.NODE_ENV == 'test' ? 'test_db' : 'maindb_3ii5',
          user: 'admin',
          password: 'vvJNvPmiccvxp9qT4Br7ymr9JRrpEiWS',
          ssl:true
    }
    const client = new Client(credentials)
    await client.connect();
    const res = await client.query(sql)
    const retV = (res.length==2) ? res[1].rows : res.rows
    client.end()

    return retV
  }catch(err){
    console.log(err)
    return err
  }
}

module.exports = query