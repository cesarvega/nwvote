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
  createVenue(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("Venue")
        .add(data)
        .then(res => { 
         resolve(res.id)     
        }, err => reject(err));
    });
  }

  getVenues(venueId) { 
    return this.firestore.collection("Venue").doc(venueId).snapshotChanges();  
  }


  getAllVenues() { 
    return this.firestore.collection("Venue").snapshotChanges();  
  }


  updateVenue(id, guessAmount, secretVenueKey?) {
    return new Promise<any>((resolve, reject) => {
       this.firestore
        .collection("Venue")
        .doc(id)
        .set({serverGuessAmount: guessAmount,secretVenueKey:secretVenueKey, completed:'complete', updated: new Date() }, { merge: true })
        .then(res => { 
          resolve(res)     
         }, err => reject(err));
      });
 }

 deleteVenue(data) {
  return this.firestore
      .collection("Venue")
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


   // PROMOTION 🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀
  createPromotion(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("Promotion")
        .add(data)
        .then(res => { 
         resolve(res.id)     
        }, err => reject(err));
    });
  }

  getPromotions(venuId) { 
    return this.firestore.collection("Promotion").doc(venuId).snapshotChanges();  
  }


  getAllPromotions() { 
    return this.firestore.collection("Promotion").snapshotChanges();  
  }


  updatePromotion(id, guessAmount, secretPromotionKey?) {
    return new Promise<any>((resolve, reject) => {
       this.firestore
        .collection("Promotion")
        .doc(id)
        .set({serverGuessAmount: guessAmount,secretPromotionKey:secretPromotionKey, completed:'complete', updated: new Date() }, { merge: true })
        .then(res => { 
          resolve(res)     
         }, err => reject(err));
      });
 }

 deletePromotion(data) {
  return this.firestore
      .collection("Promotion")
      .doc(data.payload.doc.id)
      .delete();
}
 
   //END PROMOTION 🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀

   // TRANSACTION 🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎
  createTransaction(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("Transaction")
        .add(data)
        .then(res => { 
         resolve(res.id)     
        }, err => reject(err));
    });
  }

  getTransactions(venuId) { 
    return this.firestore.collection("Transaction").doc(venuId).snapshotChanges();  
  }


  getAllTransactions() { 
    return this.firestore.collection("Transaction").snapshotChanges();  
  }


  updateTransaction(id, guessAmount, secretTransactionKey?) {
    return new Promise<any>((resolve, reject) => {
       this.firestore
        .collection("Transaction")
        .doc(id)
        .set({serverGuessAmount: guessAmount,secretTransactionKey:secretTransactionKey, completed:'complete', updated: new Date() }, { merge: true })
        .then(res => { 
          resolve(res)     
         }, err => reject(err));
      });
 }

 deleteTransaction(data) {
  return this.firestore
      .collection("Transaction")
      .doc(data.payload.doc.id)
      .delete();
}
 
   //END TRANSACTION 🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎

}
