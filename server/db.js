const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized:false} :false
});
console.log('Database URL:', process.env.DATABASE_URL);

pool.query('SELECT NOW()',(err, res)=>{
    if(err){
        console.error('Error connecting to PostgreSql',err);
    }else{
        console.log('Connected to PostgreSQL:',res.rows[0]);
        
    }
    // pool.end();
})

module.exports = pool;