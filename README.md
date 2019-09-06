# Phishing Test

<img src="APP/src/assets/img/capture.png" width="640">

Portal Web desarrollado en Angular 7 y API de ExpressJS para la comunidad. El uso de estas herramientas esta enfocado al Phishing Ético, permitiendo hacer pruebas de este tipo con el fin de enviar un correo electrónico de phishing con una plantilla por defecto, con las siguientes limitaciones:

- Envió restringido solo a dominios gratuitos de *gmail.com, hotmail.com, outlook.com, outlook.es, yahoo.com y yahoo.es*.
- Límite de un máximo de 5 direcciones de correo electrónico por envió.
- Máximo de 3 envíos por dirección IP.

## Herramientas, Tecnologías y Paquetes

 - JavaScript
 - NodeJS
 - Angular
 - MongoDB
 - ExpressJS
 - NodeMailer

### Estructura del Proyecto

 - **API REST:** Desarrollada en NodeJS con ExpressJS.
 - **APP:** Proyecto de Angular 7.

## Instalación

    npm install (para ambos proyectos)
    node index.js (API)
    ng serve (Portal Web)

## Configuración
Para hacer uso de esta herramienta y de la API de consumo debes realizar los siguientes cambios en ambos proyectos:

### Conexión MongoDB (database.js)
    const mongoose = require('mongoose');
    // DATABASE
    const URI = 'mongodb://YOUR_USER:YOUR_PASSWORD@YOUR_IP_ADDRESS:27017/YOUR_DATABASE_NAME';
    mongoose.connect(URI, { useNewUrlParser: true })
    	.then(db => console.log('Connected'))
    	.catch(err => console.error(err));
   	module.exports = mongoose;

### Ajustes Envió de Correo (phishing.controller.js)

    // INGRESA AQUI TUS CREDENCIALES DE PROVEEDOR DE CORREO
    let transporter = nodeMailer.createTransport({
        
        host: 'YOUR_MAIL_HOST',
        port: XXX,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'YOUR_EMAIL_ADDRESS',
            pass: 'YOUR_PASSWORD'
        }
    });
    
    // PERSONALIZACIÓN DE PLANTILLA DE PHISHING
    let  mailOptions  =  { ... }

### Ajuste URL de la API (phishing.controller.js)

    readonly  URL_API  =  'http://YOUR_API_IP_ADDRESS:YOUR_PORT/api';

## Uso de la API

A continuación, el detalle de las peticiones **GET** y **POST** que contempla la API, por supuesto estas pueden ser modificadas para mejoras u/o otros usos.

|     RUTA       |MÉTODO						|DESCRIPCIÓN|
|----------------|--------------------------|-----------------------------|
|`api/phishing/pwnedPhishing`|`GET`|Owned vía correo              |
|`api/phishing/pwnedVector`|`GET`|Owned vía vector de ataque            |
|`api/phishing/getPhishingUsers`|`GET`|Estadísticas pwnedPhishing|
|`api/phishing/getVectorUsers`|`GET`|Estadísticas getVectorUsers|
|`api/phishing/send`|`POST`|Envío de correo(s)|
