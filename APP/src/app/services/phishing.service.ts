import { Injectable } from '@angular/core';

// EXTRAS
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from '../models/chart';

const httpOptions = {
  headers: new HttpHeaders(
    { 'Content-Type': 'application/json' }
  )
};

@Injectable({
  providedIn: 'root'
})
export class PhishingService {

  ip4: any;
  
  readonly URL_API = 'http://localhost:3000/api';
  // readonly URL_API = 'https://verify.arkalabs.cl/api';

  // RESPONSE GLOBAL API
  response: any;
  
  constructor(private http: HttpClient ) { }

  // USUARIOS INFECTADOS POR PHISHING
  startApi(){
    return this.http.get(`${this.URL_API}`+"/phishing");
  }

  // ENVIO DE CORREO VIA API
  sendEmailNodeMailer(body){
    return this.http.post(`${this.URL_API}`+"/phishing/send", body);
  }

  // USUARIOS INFECTADOS POR PHISHING
  getPhishingUsers(){
    return this.http.get(`${this.URL_API}`+"/phishing/getPhishingUsers");
  }

  // USUARIOS INFECTADOS POR MACROS
  getMacrosUsers(){
    return this.http.get(`${this.URL_API}`+"/phishing/getMacrosUsers");
  }
  
}
