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
        .collection("Transaction")
        .add(data)
        .then(res => {
          resolve(res.id)
        }, err => reject(err));
    });
  }

  getPromoters(venuId) {
    return this.firestore.collection("Transaction").doc(venuId).snapshotChanges();
  }


  getAllPromoters() {
    return this.firestore.collection("Transaction").snapshotChanges();
  }


  updatePromoter(id, guessAmount, secretTransactionKey?) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("Transaction")
        .doc(id)
        .set({ serverGuessAmount: guessAmount, secretTransactionKey: secretTransactionKey, completed: 'complete', updated: new Date() }, { merge: true })
        .then(res => {
          resolve(res)
        }, err => reject(err));
    });
  }

  updateClientGuess(id, clientguessAmount) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("Transaction")
        .doc(id)
        .set({ clientguessAmount: clientguessAmount, serverGuessAmount: 'guessAmount', secretTransactionKey: 'secretTransactionKey', updated: new Date() }, { merge: true })
        .then(res => {
          resolve(res)
        }, err => reject(err));
    });
  }

  deletePromoter(data) {
    return this.firestore
      .collection("Transaction")
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
        .set({ serverGuessAmount: guessAmount, secretClientKey: secretClientKey, completed: 'complete', updated: new Date() }, { merge: true })
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
        .doc(data.VenueEmail)
        .set(data).then(res =>{
          resolve(res)
        })
    });
  }

  getVenueByAtribute(venueAttribute) {
    return this.firestore.collection('Venue', ref => ref.where('VenueEmail', '==', venueAttribute)).snapshotChanges()
    
  }

  getVenueById(venueId) {
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
        .set({ serverGuessAmount: guessAmount, secretVenueKey: secretVenueKey, completed: 'complete', updated: new Date() }, { merge: true })
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
  createPromotor(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("Promotor")
        .doc(data.PromoterEmail)
        .set(data).then(res =>{
          resolve(res)
        })
    });
  }

  getAllPromotors() {
    return this.firestore.collection("Promotor").snapshotChanges();
  }

  getPromoterById(venueId) {
    return this.firestore.collection("Promoter").doc(venueId).snapshotChanges();
  }


  updatePromotor(id, guessAmount, secretPromotorKey?) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("Promotor")
        .doc(id)
        .set({ serverGuessAmount: guessAmount, secretPromotorKey: secretPromotorKey, completed: 'complete', updated: new Date() }, { merge: true })
        .then(res => {
          resolve(res)
        }, err => reject(err));
    });
  }

  deletePromotor(data) {
    return this.firestore
      .collection("Promotor")
      .doc(data.payload.doc.id)
      .delete();
  }

  //END PROMOTorS 🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍




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

  getPromotionById(venuId) {
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
        .set({ serverGuessAmount: guessAmount, secretPromotionKey: secretPromotionKey, completed: 'complete', updated: new Date() }, { merge: true })
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
        .set({ serverGuessAmount: guessAmount, secretTransactionKey: secretTransactionKey, completed: 'complete', updated: new Date() }, { merge: true })
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















  /***
   * THIS IS FOR THE BUSINESS CARD APPLICATION 
   */
  // BUSINESS_CARD 🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻
  createBusiness(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("Business")
        .add(data)
        .then(res => {
          resolve(res.id)
        }, err => reject(err));
    });
  }

  getBusinesss(venuId) {
    return this.firestore.collection("Business").doc(venuId).snapshotChanges();
  }


  getAllBusinesss() {
    return this.firestore.collection("Business").snapshotChanges();
  }


  updateBusiness(id, guessAmount, secretBusinessKey?) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("Business")
        .doc(id)
        .set({ serverGuessAmount: guessAmount, secretBusinessKey: secretBusinessKey, completed: 'complete', updated: new Date() }, { merge: true })
        .then(res => {
          resolve(res)
        }, err => reject(err));
    });
  }

  deleteBusiness(data) {
    return this.firestore
      .collection("Business")
      .doc(data.payload.doc.id)
      .delete();
  }

  //END BUSINESS_CARD 🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻

}
