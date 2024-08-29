import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import Handsontable from 'handsontable';

@Component({
  selector: 'app-names-uploader',
  templateUrl: './names-uploader.component.html',
  styleUrls: ['./names-uploader.component.scss']
})
export class NamesUploaderComponent implements AfterViewInit, OnChanges {
  
  @Input() displayedColumns: string[] = [];  // Columnas a mostrar
  @Input() dataSource: any[] = [];  // Datos de la tabla
  @Output() save = new EventEmitter();
  @Output() cancelEvent = new EventEmitter();
  @ViewChild('hotContainer', { static: false }) hotContainer!: ElementRef;
  private hotInstance!: Handsontable;

  ngAfterViewInit() {
    this.initializeTable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource'] || changes['displayedColumns']) {
      this.updateTable();
    }
  }

  // Método para inicializar o actualizar la instancia de Handsontable
  initializeTable() {
    if (this.hotContainer) {
      const container = this.hotContainer.nativeElement;
      this.hotInstance = new Handsontable(container, {
        data: this.dataSource,
        colHeaders: [...this.displayedColumns, 'Actions'],
        columns: this.createColumnsConfig(),
        rowHeaders: true,
        filters: true,
        dropdownMenu: true,
        contextMenu: true, // Puedes habilitar el menú contextual si lo deseas
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

  // Método para actualizar la tabla cuando cambian las filas o columnas
  updateTable() {
    if (this.hotInstance) {
      this.hotInstance.updateSettings({
        data: this.dataSource,
        colHeaders: [...this.displayedColumns, 'Actions'],
        columns: this.createColumnsConfig(),
      });
      this.hotInstance.loadData(this.dataSource); // Recargar los datos con la nueva configuración
    }
  }
  // Método para crear configuraciones de columnas dinámicamente
  createColumnsConfig() {
    const dynamicColumns = this.displayedColumns.map(col => ({
      data: col,
      renderer: Handsontable.renderers.TextRenderer,  // Usa un renderer específico si es necesario
    }));

    // Añadir la columna "Actions" al final
    dynamicColumns.push({
      data: 'actions',
      renderer: (instance, td, row, col, prop, value, cellProperties) => {
        Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
        const button = document.createElement('button');
        button.innerText = 'Delete';
        button.onclick = () => this.removeRow(row);
        td.appendChild(button);
        td.style.textAlign = 'center';
      }
    });

    return dynamicColumns;
  }

  updateDataSource(changes: any[]): void {
    if (changes) {
      changes.forEach(([rowIndex, prop, oldValue, newValue]) => {
        if (rowIndex !== undefined) {
          if (rowIndex >= this.dataSource.length) {
            while (rowIndex >= this.dataSource.length) {
              this.dataSource.push({
                ...this.dataSource[0],
                nameCandidates: '',
                rationale: '',
                RATE: -1,
                STARS: this.dataSource[1].STARS,
                Comments0: ''
              });
            }
          }

          const columnName = this.displayedColumns[prop];
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
    console.log(this.dataSource)
    this.save.emit(this.dataSource);
  }

  cancel(): void {
    this.cancelEvent.emit(true);
  }
}
