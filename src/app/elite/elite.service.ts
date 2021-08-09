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


  updatePromoter(id, guessAmount,secretVenueKey?) {
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

}
