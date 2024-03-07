import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit{
 
  @Input() tHeader: string[] = [];
  @Input() tData: any[] = [];
  tBody: any[] = []; 

  ngOnInit(): void {
   
  }

  ngOnChanges(): void {
    let body: any = [];
    this.tBody = [];
    console.log(this.tData)
    this.tData.forEach((data: any) => {
      body = [];
      this.tHeader.forEach((key: string) => {
        //body[key.toLowerCase()] = data[key.toLowerCase()] || data[key.toLowerCase().split(' ').join('_')] || data[key.toLowerCase().split(' ').join('')];
        body.push(data[key.toLowerCase()] || data[key.toLowerCase().split(' ').join('_')] || data[key.toLowerCase().split(' ').join('')]);
      });
      this.tBody.push(body);
    });  
  }

  getUser(user: number){
    console.log(this.tData[user]);
  }
}
