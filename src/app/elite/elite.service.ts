import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EliteService {

  order: any
  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  
  // VENUE DATA ❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️
  createPromoter(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("venue")
        .add(data)
        .then(res => { 
         resolve(res.id)     
        }, err => reject(err));
    });
  }

  getPromoters(venuId) { 
    return this.firestore.collection("venue").doc(venuId).snapshotChanges();  
  }


  getAllPromoters() { 
    return this.firestore.collection("venue").snapshotChanges();  
  }


  updatePromoter(id, guessAmount, secretVenueKey?) {
    return new Promise<any>((resolve, reject) => {
       this.firestore
        .collection("venue")
        .doc(id)
        .set({serverGuessAmount: guessAmount,secretVenueKey:secretVenueKey, completed:'complete', updated: new Date() }, { merge: true })
        .then(res => { 
          resolve(res)     
         }, err => reject(err));
      });
 }

  updateClientGuess(id, clientguessAmount) {
    return new Promise<any>((resolve, reject) => {
       this.firestore
        .collection("venue")
        .doc(id)
        .set({clientguessAmount: clientguessAmount,serverGuessAmount: 'guessAmount',secretVenueKey:'secretVenueKey', updated: new Date() }, { merge: true })
        .then(res => { 
          resolve(res)     
         }, err => reject(err));
      });
 }

 deletePromoter(data) {
  return this.firestore
      .collection("venue")
      .doc(data.payload.doc.id)
      .delete();
}
  // END VENUE DATA ❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️

 
  // CLIENT 🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶
  createClient(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("Client")
        .add(data)
        .then(res => { 
         resolve(res.id)     
        }, err => reject(err));
    });
  }

  getClients(venuId) { 
    return this.firestore.collection("Client").doc(venuId).snapshotChanges();  
  }


  getAllClients() { 
    return this.firestore.collection("Client").snapshotChanges();  
  }


  updateClient(id, guessAmount, secretClientKey?) {
    return new Promise<any>((resolve, reject) => {
       this.firestore
        .collection("Client")
        .doc(id)
        .set({serverGuessAmount: guessAmount,secretClientKey:secretClientKey, completed:'complete', updated: new Date() }, { merge: true })
        .then(res => { 
          resolve(res)     
         }, err => reject(err));
      });
 }

 deleteClient(data) {
  return this.firestore
      .collection("Client")
      .doc(data.payload.doc.id)
      .delete();
}
 
//END  CLIENT 🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶
 

// VENUE 🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈
  createVenu(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("Venu")
        .add(data)
        .then(res => { 
         resolve(res.id)     
        }, err => reject(err));
    });
  }

  getVenus(venuId) { 
    return this.firestore.collection("Venu").doc(venuId).snapshotChanges();  
  }


  getAllVenus() { 
    return this.firestore.collection("Venu").snapshotChanges();  
  }


  updateVenu(id, guessAmount, secretVenuKey?) {
    return new Promise<any>((resolve, reject) => {
       this.firestore
        .collection("Venu")
        .doc(id)
        .set({serverGuessAmount: guessAmount,secretVenuKey:secretVenuKey, completed:'complete', updated: new Date() }, { merge: true })
        .then(res => { 
          resolve(res)     
         }, err => reject(err));
      });
 }

 deleteVenu(data) {
  return this.firestore
      .collection("Venu")
      .doc(data.payload.doc.id)
      .delete();
}
 //END VENUE 🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈
 
 // PROMOTORES 🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍
  createPromotore(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("Promotore")
        .add(data)
        .then(res => { 
         resolve(res.id)     
        }, err => reject(err));
    });
  }

  getPromotores(venuId) { 
    return this.firestore.collection("Promotore").doc(venuId).snapshotChanges();  
  }


  getAllPromotores() { 
    return this.firestore.collection("Promotore").snapshotChanges();  
  }


  updatePromotore(id, guessAmount, secretPromotoreKey?) {
    return new Promise<any>((resolve, reject) => {
       this.firestore
        .collection("Promotore")
        .doc(id)
        .set({serverGuessAmount: guessAmount,secretPromotoreKey:secretPromotoreKey, completed:'complete', updated: new Date() }, { merge: true })
        .then(res => { 
          resolve(res)     
         }, err => reject(err));
      });
 }

 deletePromotore(data) {
  return this.firestore
      .collection("Promotore")
      .doc(data.payload.doc.id)
      .delete();
}
 
   //END PROMOTORES 🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍

}
