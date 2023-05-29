const { Client } = require('pg')
const credentials = process.env.MODE_ENV=='exp' ? {
  host : 'dpg-chpkkfvdvk4goetan340-a.singapore-postgres.render.com',
  ssl : true,
  user: 'admin',
  database: 'maindb_3ii5',
  password: 'vvJNvPmiccvxp9qT4Br7ymr9JRrpEiWS'
} : {
  host: 'db',
      port: 5432,
      database: 'main_db',
      user: 'admin',
      password: 'admin',
      ssl:false
}
async function query(sql){

  try{
    
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