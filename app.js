const express = require('express');
const app = express();
const session = require('express-session');

const bodyParser = require('body-parser');



app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret:'n0m3l0',
    resave:false,
    saveUninitialized:true
}))


app.set('port',process.env.PORT || 3000);

/*
NOTAS:
-La carpeta public es para archivos estáticos(CSS,JS y HTML estático)
-La carpeta views es para archivos dinamicos(HTML dinámico)
 */

//Motor de plantillas 
app.set('view engine', 'ejs');
//Establecer carpeta de vistas
app.set('views',__dirname + '/views');

app.use(express.static(__dirname+"/public"));



app.use('/',require('./router/rutasWeb'));

app.listen(app.get('port'),()=>
{
    console.log('Servidor escuchando en el puerto:',app.get('port'));    
})


app.use((req,res,next)=>{
    res.status(404).render('404');
})


