const mysql = require('mysql');

// const con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'labasrytas'
// });
const con = mysql.createConnection (`mysql://root:labasrytas@localhost:3306/world`)
    

con.connect((error: any) => {
    if(error) throw error;
    console.log('Prisijungta');
})