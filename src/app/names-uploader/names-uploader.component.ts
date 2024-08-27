import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit } from '@angular/core';
import Handsontable from 'handsontable';

@Component({
  selector: 'app-names-uploader',
  templateUrl: './names-uploader.component.html',
  styleUrls: ['./names-uploader.component.scss']
})
export class NamesUploaderComponent implements AfterViewInit {
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any[] = [];
  @Output() save = new EventEmitter();
  @Output() cancelEvent = new EventEmitter();
  @ViewChild('hotContainer', { static: false }) hotContainer!: ElementRef;
  private hotInstance!: Handsontable;

  ngAfterViewInit() {
    if (this.hotContainer) {
      const container = this.hotContainer.nativeElement;
      this.hotInstance = new Handsontable(container, {
        data: this.dataSource,
        colHeaders: [...this.displayedColumns.filter(col => col !== 'STARS' && col !== 'RATE'), 'Actions'],
        columns: [
          ...this.displayedColumns.filter(col => col !== 'STARS' && col !== 'RATE' && !col.includes('RadioColumn') ).map(col => ({ data: col })),
          {
            data: 'actions',
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
              Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
              const button = document.createElement('button');
              button.innerText = 'Delete';
              button.onclick = () => this.removeRow(row);
              td.appendChild(button);
              td.style.textAlign = 'center';
            }
          }
        ],
        rowHeaders: true,
        filters: true,
        dropdownMenu: true,
        contextMenu: false,
        licenseKey: 'non-commercial-and-evaluation',
        height: 300,
        width: 1024,
        afterChange: (changes: any[]) => {
          this.updateDataSource(changes);
        },
        afterPaste: (changes: any[]) => {
          this.updateDataSource(changes);
        },
      });
    } else {
      console.error('hotContainer is not available');
    }
  }

  addRow(): void {
    // Crea una nueva fila vacía basada en las columnas
    const nuevaFila = this.displayedColumns.reduce((acc: any, col: string) => {
      if (col !== 'STARS' && col !== 'RATE') {
        acc[col] = ''; // Asigna un valor vacío a cada columna
      }
      return acc;
    }, {});

    // Agrega la nueva fila al dataSource
    this.dataSource.push(nuevaFila);

    // Recarga los datos en la tabla para reflejar la nueva fila
    if (this.hotInstance) {
      this.hotInstance.loadData(this.dataSource);
    }
  }

  updateDataSource(changes: any[]): void {
    if (changes) {
      changes.forEach(([rowIndex, prop, oldValue, newValue]) => {
        if (rowIndex !== undefined) {
          if (rowIndex >= this.dataSource.length) {
            while (rowIndex >= this.dataSource.length) {
              this.dataSource.push({});
            }
          }
          const columnName = this.displayedColumns.filter(col => col !== 'STARS' && col !== 'RATE')[prop];
          if (columnName && this.dataSource[rowIndex]) {
            this.dataSource[rowIndex][columnName] = newValue;
          }
        }
      });
    } else {
      console.warn('No changes detected or changes is null');
    }
  }

  removeRow(rowIndex: number): void {
    if (rowIndex >= 0 && rowIndex < this.dataSource.length) {
      this.dataSource.splice(rowIndex, 1);
      if (this.hotInstance) {
        this.hotInstance.loadData(this.dataSource);
      }
    } else {
      console.warn('Row index out of bounds:', rowIndex);
    }
  }

  saveChanges(): void {
    this.save.emit(this.dataSource);
  }

  cancel(): void {
    this.cancelEvent.emit(true);
  }
}

