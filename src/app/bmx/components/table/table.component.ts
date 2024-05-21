import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() tHeader: string[] = [];
  @Input() tData: any[] = [];
  @Input() dataSource:any = [
    { columna1: 'Valor 1-1', columna2: 'Valor 1-2', columna3: 'Valor 1-3' },
    { columna1: 'Valor 2-1', columna2: 'Valor 2-2', columna3: 'Valor 2-3' },
    { columna1: 'Valor 3-1', columna2: 'Valor 3-2', columna3: 'Valor 3-3' },
  ]; // De
  tBody: any[] = [];
  @Input() displayedColumns: any = []
  @Output() save = new EventEmitter();
  @Output() cancelEvent = new EventEmitter()
  ngOnInit(): void {
    this.displayedColumns = this.filtrarValores(this.displayedColumns)
  }

  eliminarPropiedades(objeto: any) {
    for (const key in objeto) {
      if (objeto.hasOwnProperty(key)) {
        if (key === 'RATE' || key.includes('Comments')) {
          delete objeto[key];
        }
      }
    }
  }
  filtrarValores(array: string[]) {
    return array.filter(item => !item.includes('RATE') && !item.includes('Comments'));
  }

  saveChanges(){
    this.save.emit(false)
  }
  cancel(){
    this.cancelEvent.emit(true)
  }

}


