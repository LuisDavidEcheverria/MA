const express = require('express');
const router = express.Router();
const DBConnection = require('../DBConnection');
const connection = DBConnection();

let autentificarSesion = function(req, res, next) {
    if (req.session)
      return next();
    else
      return res.redirect('/401');
};

let autentificarPsicologo = function(req, res, next) {
    if (req.session && req.session.rol === 1)
      return next();
    else
        return res.redirect('/401');
};

let autentificarPaciente = function(req, res, next) {
    if (req.session && req.session.rol === 2)
      return next();
    else
        return res.redirect('/401');
};
 
router.get('/',(req,res) =>
{
    res.render("ingresar")
})

router.get('/registrar',(req,res) =>
{
    res.render("registrar")
})

const bcrypt =require('bcrypt');

router.post('/registrar',(req,res) =>
{
    let {nombre,appat,apmat,email,rol,password,confirmacion,terminos} = req.body;
    let BCRYPT_SALT_ROUNDS =10;
    
    //Encriptar password
    
    
    if(password=== confirmacion && terminos=== 'on' && rol == 1 || rol == 2)
    {
        const encriptado= bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
        console.log('Encriptado',encriptado);
        connection.query('Insert into MDatos(correo,contraseña,nombre,appat,apmat) values (?,?,?,?,?)',[email,encriptado,nombre,appat,apmat],function(err,result)
        {
            if(!err){
                const id = result.insertId;
                if(rol == 1)
                {
                    connection.query('Insert into MPsicologo (Id_datos) values ('+id+')',function(error,resultado){
                        if (error) throw error;
                        res.render('exitoRegistro')
                    })
                }
                else
                {
                    connection.query('Insert into MPaciente (Id_datos) values ('+id+')',function(error,resultado){
                        if (error) throw error;
                        res.render('exitoRegistro')
                    })
                } 
            }
            else
            {
                throw err;
            }
        })
    }
    console.log(req.body);   
})

//Sistema de Login
router.get('/ingresar',(req,res) =>
{
    res.render("ingresar")
})

router.post('/ingresar',(req,res) =>
{
    const {email,password} = req.body;
    console.log(email);
    console.log(password);
    connection.query('Select contraseña from MDatos where correo =?',[email],function(err,result)
    { 
        if(bcrypt.compareSync(password,result[0].contraseña))
        {
            console.log('Acceso Permitido');
            connection.query('Select Id_datos,nombre from MDatos where correo=? ',[email] ,function(err,result)
        {
            if(result.length >0)
            {
                const nombre = result[0].nombre;
                const idDatos = result[0].Id_datos;
                let id = null;

                req.session.username = nombre;
                req.session.email = email;
                
                console.log('USERNAME',req.session.username);

                connection.query('Select Id_usuario from MPaciente where Id_datos = ?' ,[idDatos],function(error,resultado)
                {
                    if(resultado.length >0)
                    {
                        id = resultado[0].Id_usuario;
                        console.log('ID',id)
                        req.session.userId = id;
                        req.session.rol = 2;
                        res.redirect('/inicioPaciente');
                    }
                    else
                    {
                    connection.query('Select Id_Psicologo from MPsicologo where Id_datos = ?',idDatos,function(e,r)
                    {
                        if(r.length >0)
                        {
                            if (error) throw error;
                            id = r[0].Id_Psicologo;
                            req.session.rol = 1;
                            req.session.userId = id;
                            res.redirect('/inicioPsicologo');
                        }
                        else
                        {
                            res.redirect('/ingresar');
                        }
                    })
                    }
                })
                

            
            }
        
        })
        }
        else
        {
            res.redirect('/ingresar');
        }
    })
})

router.get('/inicioPaciente',autentificarPaciente,(req,res) =>
{
    res.render('inicioPaciente',{texto:req.session.username})
})

router.get('/perfil',autentificarSesion,(req,res) =>
{
    let rol = req.session.rol;
    let link='';
    let info = 'Información';
   
    connection.query('Select appat from MDatos where correo =?',[req.session.email],function(err,result){
        if(!err && result.length >0)
        {
            if(rol===1)
            {
                rol = 'Psicologo';
                link = '/inicioPsicologo';
            }
            if(rol===2)
            {
                rol = 'Paciente';
                link = '/inicioPaciente';
            }
            console.log('ROL:' , rol);
            console.log('Link:' , link);
            const apppat = result[0].appat;
            const nombre = req.session.username + ' ' + apppat;
            const email = req.session.email;
            res.render("perfil",{link:link,Nombre:nombre,Rol:rol,Email:email,Info:info})
        }
    })
    
})

router.get('/inicioPsicologo',autentificarPsicologo,(req,res) =>
{
    res.render('inicioPsicologo',{texto:req.session.username})
})

router.get('/pacientes',autentificarPsicologo,(req,res) =>
{
    connection.query('SELECT MD.nombre,MD.appat,MP.Id_usuario FROM MDatos AS MD INNER JOIN MPaciente AS MP ON MD.Id_datos = MP.ID_datos WHERE Id_Psicologo = ?;',[req.session.userId],function(err,result)
    {
        res.render('pacientes',{pacientes:result,texto:req.session.username});
        console.log('ID PSICOLOGO',req.session.userId);
        console.log(result);
    })
    
})

router.get('/pendientes',autentificarPsicologo,(req,res) =>
{
    connection.query('SELECT MD.nombre,MD.appat,MP.Id_usuario FROM MDatos AS MD INNER JOIN MPaciente AS MP ON MD.Id_datos = MP.ID_datos WHERE Id_Psicologo = ?;',[req.session.userId],function(err,result)
    {
        res.render('pendientes',{pacientes:result,texto:req.session.username});
        console.log('ID',req.session.userId);
        console.log(result);
    })
    
})

router.get('/borrarPaciente/:id',autentificarPsicologo,(req,res)=>
{
    console.log('ID A BORRAR:',req.params.id);
    connection.query('update Musuario set Id_psicologo = null where Id_usuario=?',[req.params.id],function(err,result)
    {
        res.redirect('/pacientes');
    });
})
router.get('/salir',(req,res) =>
{
    req.session.destroy();
    res.redirect('/');
})

router.get('/psicologo',autentificarPaciente,(req,res) =>
{
    res.render('psicologo',{link:'/inicioPaciente'});
})

router.post('/asignarPsicologo',autentificarPaciente,(req,res)=>
{
    const {codigo} = req.body;
    const id = req.session.userId;
    connection.query('SELECT MD.nombre,MD.appat FROM MDatos AS MD INNER JOIN MPsicologo AS MP ON MD.Id_datos = MP.ID_datos WHERE Id_Psicologo = ?',[codigo],function(error,resultado){
        connection.query('update MPaciente set Id_Psicologo = ? where Id_usuario = ?',[codigo,id],function(err,result)
        {
            if(err) throw err;
            res.render('exitoPsicologo');
        })
    })

})

router.get('/asignarCuestionario/:id',autentificarPsicologo,(req,res)=>
{
    let idPaciente = req.params.id;
    let idPsicologo = req.session.userId;
    let dt = new Date();
    let fecha = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
    
    connection.query('insert into DEncuesta (Id_usuario,Id_psicologo,fecha,contestado) values (?,?,?,0)',[idPaciente,idPsicologo,fecha],function(err,result)
    {
        if(err) throw err;
        res.render('exitoAsignacion');
    })
})

router.get('/hacerCuestionario',autentificarPaciente,(req,res)=>{
    idUsuario = req.session.userId;
    connection.query('SELECT * FROM DEncuesta WHERE fecha >= now() - INTERVAL 1 DAY and Id_usuario =? and contestado =0',[idUsuario],function(err,result)
    {
        if(result.length>0)
        {
            connection.query('Select * from MPregunta',function(error,resultado)
            {
                res.render('cuestionario',{preguntas:resultado});
            })
            
        }
        else
        {
            res.render('sinCuestionario');
        }
    })

})

router.post('/enviarCuestionario',autentificarPaciente,(req,res)=>
{
    let idUsuario = req.session.userId;
    let idEncuesta;
    connection.query('SELECT Id_encuesta FROM DEncuesta where Id_usuario =? and contestado=0',[idUsuario],function(error,resultado)
    {
        idEncuesta = resultado[0].Id_encuesta;
        console.log('#Encuesta:',resultado[0].Id_encuesta)
    })
    connection.query('Select Id_pregunta from MPregunta',function(err,result)
    {
        let nPreguntas = result.length;
        for(var i=1;i<nPreguntas;i++)
        {
            let nombre = 'inlineRadioOptions' + i;
            console.log(req.body[nombre]);
            let respuesta = req.body[nombre];
            connection.query('insert into MRespuesta (Id_encuesta,Id_pregunta,respuesta) values(?,?,?)',[idEncuesta,i,respuesta],function(e,r){
                if(e) throw e;
                
            })
        }
        connection.query('update DEncuesta set contestado = 1 where Id_encuesta =?',[idEncuesta],function(er,rs){})
        res.render('exitoCuestionario');
    }) 
})

router.get('/401',(req,res) =>
{
    res.render('401');
})

module.exports = router;