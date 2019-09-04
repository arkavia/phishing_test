import { Component, OnInit } from '@angular/core';

// EXTRAS
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

// SERVICES
import { PhishingService } from './services/phishing.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  // ATRIBUTOS
  disclaimer:boolean = false;
  formValid: boolean =  false;

  // INPUT CORREOS
  sendEmailForm: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  toAddresses:any = [];

  // ESTADISTICAS
  phishingUsers:any;
  macrosUsers:any;
  visitCounter:any;

  constructor(private formBuilder: FormBuilder,
              private phishingService: PhishingService
    ) {}

    ngOnInit(): void {

        this.sendEmailForm = this.formBuilder.group({
          toAddresses: ['', [Validators.required]]
        });

        this.phishingService.startApi().subscribe(data => {
          this.visitCounter = data['visits'];
        },
        error => {
          this.visitCounter = 0;
        });

        this.phishingService.getPhishingUsers().subscribe(data => {
          this.phishingUsers = data;
        },
        error => {
          this.phishingUsers = 0;
        })

        this.phishingService.getMacrosUsers().subscribe(data => {
          this.macrosUsers = data;
        },
        error => {
          this.macrosUsers = 0;
        })

    }

  // VALIDACIÓN CAPTCHA
  resolved(captchaResponse: string) {
      //console.log(`Resolved captcha with response ${captchaResponse}:`);
      this.formValid = true;
  }

  add(event: MatChipInputEvent): void {

    const input = event.input;
    const value = event.value;

    if (this.toAddresses.length != 5) {
      // Add our fruit
      if ((value || '').trim()) {
        this.toAddresses.push(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(email): void {
    const index = this.toAddresses.indexOf(email);

    if (index >= 0) {
      this.toAddresses.splice(index, 1);
    }
  }

  send(value) {

      console.log(this.toAddresses);

      if (this.sendEmailForm.valid && this.toAddresses.length > 0 ) {

          var emails = [];
          var valid = true;

          this.toAddresses.forEach(item => {
            if (item.match("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")) {
              emails.push(item) 
            }
            else{
              valid = false;
              Swal.fire('Portal Phishing','Uno o más correos no tienen el formato correcto','question');
            }
          });

          if (valid) {
            this.phishingService.sendEmailNodeMailer(emails).subscribe(response => {
              
              switch (response['status']) {
                case "mail_sent":
                  Swal.fire('Portal Phishing','El o los correos fueron enviados con éxito','success');
                  break;

                case "mail_not_authorized":
                  var mails = response['invalid_mails'].toString().replace(/,/g, ", ");
                  Swal.fire('Portal Phishing','Los correos: '+ mails +' no estan permitidos para envio','warning');
                  break;

                case "quota_exceeded":
                  Swal.fire('Portal Phishing','Ha alcanzado el limite del servicio, envia un correo a csoc@arkavia.com si deseas saber mas información','warning');
                  break;
          
                default:
                  Swal.fire('Portal Phishing','Oops! error inesperado','error');
                  break;
              }

              console.log(response);
    
            },
            error => {
              Swal.fire('Portal Phishing','Oops! error inesperado','error');
            });
          }
        
      }
      else {
        Swal.fire('Portal Phishing','Ingrese uno o más correos','question');
        console.log('error');
      }    
  }

}

