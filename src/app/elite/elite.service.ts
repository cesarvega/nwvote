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


  createCoffeeOrder(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("promoter")
        .add(data)
        .then(res => { }, err => reject(err));
    });
  }

  getCoffeeOrders() { 
    return this.firestore.collection("promoter").snapshotChanges();
  }


  updateCoffeeOrder(data) {
    return this.firestore
        .collection("promoter")
        .doc(data.payload.doc.id)
        .set({qrcodeId: 5, name: 'Tony vega', userid: 5 }, { merge: true });
 }

 deleteCoffeeOrder(data) {
  return this.firestore
      .collection("promoter")
      .doc(data.payload.doc.id)
      .delete();
}

}
