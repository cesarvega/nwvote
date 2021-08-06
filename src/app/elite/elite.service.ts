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
        .then(res => { }, err => reject(err));
    });
  }

  getPromoters() { 
    return this.firestore.collection("venue").snapshotChanges();
  }


  updatePromoter(data) {
    return this.firestore
        .collection("venue")
        .doc(data.payload.doc.id)
        .set({qrcodeId: 8, name: 'Tommy Candy', userid: 8 }, { merge: true });
 }

 deletePromoter(data) {
  return this.firestore
      .collection("venue")
      .doc(data.payload.doc.id)
      .delete();
}

}
