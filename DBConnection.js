//Configurar conexión a la BD
const mysql = require('mysql');
module.exports= ()=>{
    /*
return mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'n0m3l0',
        database:'MentalAnalitycaDB'
    });
}*/
return mysql.createConnection(
    {
        host:'bdpmye8dyhwt4hdqhgcp-mysql.services.clever-cloud.com',
        user:'upk3pjsosofutpwj',
        password:'CBl9dLCyWcsvG3wFSGov',
        database:'bdpmye8dyhwt4hdqhgcp'
    });
}