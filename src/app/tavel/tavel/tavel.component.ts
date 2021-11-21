import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { min, max } from 'rxjs/operators'
import { from } from 'rxjs';
@Component({
  selector: 'app-tavel',
  templateUrl: './tavel.component.html',
  styleUrls: ['./tavel.component.scss']
})
export class TavelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    let testArray = [13, 4, 15, 6, 17, 8, 19]

    let behaviorSubject = new BehaviorSubject(testArray)

    let currentValue = behaviorSubject.asObservable()

    let observableArray = of(...testArray)
    let observableArray2 = from(testArray)

    let subject = new Subject()

    let observable = new Observable(observer => {
      observer.next(testArray)
    })

    setTimeout(() => {
      behaviorSubject.next([10, 20])
      subject.next('1')
    }, 2000);

    // observable.subscribe(data => {
    //   console.log(data)
    // })

    // observableArray.subscribe(data => {
    //   console.log(data)
    // })

    // behaviorSubject.subscribe(data => {
    //   console.log(data)
    // })

    // currentValue.subscribe(data => {
    //   console.log(data)
    // })

    observableArray2.pipe(
      min(),
    ).subscribe(data => {
      console.log('behavior: ' + data)
    })

    observableArray.pipe(
      min((a, b) => a - b),
    )
      .subscribe(x => {
        console.log(x)
      })


    behaviorSubject.subscribe(data => {
      from(data).pipe(min(), max(), ).subscribe(x => {
        console.log('behavior 2: ' + x)
      })
    })

    const arrayfrom = {...testArray}
    console.log(arrayfrom);


   console.log('return '+ this.palindrome(this.palindromeWord));
   
  
   console.log('max: ' + this.maxNumber(testArray));
  //  let max 
  //   max  =  testArray.reduce((a,b)=>{
  //   return (a>b)?a:b
  // })

  //  console.log('max: ' + testArray.reduce((a,b)=>{
  //   return (a<b)?a:b
  // })); 


  }


  palindromeWord = 'anna'

  palindrome(string: string): string {
    const arrayFromSting = [...string]

    if(arrayFromSting.length > 0 ){
      if(arrayFromSting[0] === arrayFromSting[arrayFromSting.length -1]){
        // const newPalindromeToTest  = arrayFromSting.slice(1, arrayFromSting.length-1)
        arrayFromSting.shift()
        arrayFromSting.pop()
        const newPalindromeToTest  = arrayFromSting
        if(newPalindromeToTest.length > 0 ){
          this.palindrome(newPalindromeToTest.join(''))
        }else { 
          return this.palindromeWord
        }
      }else {
        return 'false'
      }
    }

  }



  maxNumber(arrayOfNumbers: number[]){
    arrayOfNumbers.reduce((a,b)=>{
      return (a>b)?a:b
    })
  }
 minNumber(arrayOfNumbers: number[]){
    arrayOfNumbers.reduce((a,b)=>{
      return (a<b)?a:b
    })
  }



}
