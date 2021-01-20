function validaringreso(cont){
    var obtemail= cont.email.value;
    var obtpass = cont.password.value;

    if(obtemail==""){
        alert("Campo Email Vacio");
        cont.email.focus();
        return false;
    }else if(obtpass==""){
        alert("Campo Password Vacio");
        cont.password.focus();
        return false;
    }
    return action="/ingresar";
}

function validarregistro(implement){
    var obtname = implement.nombre.value;
    var obtappat = implement.appat.value;
    var obtapmat = implement.apmat.value;
    var obtemail = implement.email.value;
    var obtpass = implement.password.value;
    var obtconf = implement.confirmacion.value;

    var expregpass = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{9,25}$/gm;

    if(obtname==""){
        alert("ERROR: Campo NOMBRE vacio");
        implement.obtname.focus();
        return false;
    }else if(obtappat==""){
        alert("ERROR: Campo APELLIDOPATERNO vacio");
        implement.obtappat.focus();
        return false;
    }else if(obtapmat==""){
        alert("ERROR: Campo APELLIDOMATERNO vacio");
        implement.obtapmat.focus();
        return false;
    }else if(obtpass==""){
        alert("ERROR: Campo CONTRASEÑA vacio");
        implement.obtpass.focus();
        return false;
    }else if(obtconf==""){
        alert("ERROR: Debe de confirmar su contraseña");
        implement.obtconf.focus();
        return false;
    }

    var expregEmail= /([a-zA-Z]?[1-9]*\w?\.?)+(\@{1})([a-z]+)(\.{1})([a-z]+)/gm;
    if(expregEmail.test(obtemail)==false){
        alert("ERROR: campo email, vacio o no valido");
        return false;
    }
    var expregpass = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{9,25}$/gm;
    if(expregpass.test(obtpass)==false){
        alert("ERROR: formato de contraseña no valido\nLa contraseña debe tener entre 9 y 25 caracteres\nDebe tener al menos un digito\nAl menos una letra mayuscula y una minuscula\nSin caracteres especiales");
        return false;
    }

    if(obtpass!=obtconf){
        alert("Las contraseñas no coinciden, favor de verificar");
        return false;
    }
    var expregname = /^([a-zA-Z]{2,15}\s?){1,3}$/gm;
    if(expregname.test(obtname)==false){
        alert("ERROR: Formato de nombre no valido.\nEl nombre no debe de llevar caracteres especiales ni numeros");
        return false;
    }
    var expregAp = /^([a-zA-Z]{2,20}){1}$/gm;
    if(expregAp.test(obtappat)==false){
        alert("ERROR: Formato de apellido paterno no valido.\nEl Apellido paterno no debe de llevar caracteres especiales ni numeros");
        return false;
    }
    var expregAp = /^([a-zA-Z]{2,20}){1}$/gm;
    if(expregAp.test(obtapmat)==false){
        alert("ERROR: Formato de apellido materno no valido.\nEl Apellido materno no debe de llevar caracteres especiales ni numeros");
        return false;
    }
    var isChecked = implement.terminos.checked;

    if(isChecked){
        return action="/registrar";
    }else{
        alert("Debe aceptar los terminos y condiciones");
        return false;
    }
}