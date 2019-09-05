import { Injectable } from '@angular/core';

// EXTRAS
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders(
    { 'Content-Type': 'application/json' }
  )
};

@Injectable({
  providedIn: 'root'
})
export class PhishingService {
  
  readonly URL_API = 'http://YOUR_API_IP_ADDRESS:YOUR_PORT/api';

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

  // USUARIOS INFECTADOS POR VECTOR
  getMacrosUsers(){
    return this.http.get(`${this.URL_API}`+"/phishing/getVectorUsers");
  }
  
}
