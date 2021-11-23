import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from, } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface Person {
  name: string;
  age: number;
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})



export class TestComponent implements OnInit {
  lengthOptions = [
    {
      id: 0,
      label: 'Kilometre',
      unit: 'km'
    },
    {
      id: 1,
      label: 'Metre',
      unit: 'm'
    },
    {
      id: 2,
      label: 'Centimetre',
      unit: 'cm'
    }
  ];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    const person: Person[] = [
      {
        name: 'John',
        age: 30,
      },
      {
        name: 'Cesar',
        age: 30,
      }
    ];

    const person$: Observable<Person> = from(person);
    const personPromise: Promise<Person[]> = Promise.resolve(person);
    // person$.subscribe(p => console.log(p.name));
    const personFromPromise$: Observable<Person[]> = from(personPromise);

    personFromPromise$.subscribe((p:Person[]) => {
      // p.map(p => console.log(p.name));
    });

    personFromPromise$.pipe(
      map((p, index) => p[0].name.toUpperCase()),
    ).subscribe(c => {
      console.log(c)
    });

    


  }

  myfunc() {

  }

}
