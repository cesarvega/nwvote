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
  @Input() isRanking: string = "";
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
          ...this.displayedColumns
            .filter(col => col !== 'STARS' && col !== 'RATE' && !col.includes('RadioColumn'))
            .map(col => ({
              data: col,
              width: 150,
            })),
          {
            data: 'actions',
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
              Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
              const button = document.createElement('button');
              button.innerText = 'Delete';
              button.onclick = () => this.removeRow(row);
              td.appendChild(button);
              td.style.textAlign = 'center';
            },
            readOnly: true,
            width: 100,
          }
        ],
        rowHeaders: true,
        filters: true,
        dropdownMenu: true,
        contextMenu: false, 
        licenseKey: 'non-commercial-and-evaluation',
        height: 300,
        width: 1024,
        colWidths: 150,
        stretchH: 'all',
        afterChange: (changes: any[]) => {
          this.updateDataSource(changes);
        },
        afterPaste: (changes: any[]) => {
          if (changes[0].length >= this.displayedColumns.length) {
            const support = changes[0].length - this.displayedColumns.length;
            const newColumns: { name: string, values: any[] }[] = [];
            for (let index = 0; index < (this.isRanking === "ranking-scale" ?support :support+1) ; index++) {
              let columnIndex = this.isRanking === "ranking-scale" ? this.displayedColumns.length + index : this.displayedColumns.length + index - 1;
              const columnValues = changes.map(change => change[columnIndex]);
              const columnName = `New Column ${columnIndex + 1}`;
              newColumns.push({ name: columnName, values: columnValues });
            }
            newColumns.forEach(col => this.addColumn(col.name, col.values));
          }
        }
      });
      container.style.overflowX = 'auto';
      container.style.overflowY = 'auto';
    } else {
      console.error('hotContainer is not available');
    }
  }

  updateDataSource(changes: any[]): void {
    if (changes) {
      changes.forEach(([rowIndex, col, prop, oldValue, newValue]) => {
        if (rowIndex !== undefined) {
          if (rowIndex >= this.dataSource.length) {
            while (rowIndex >= this.dataSource.length) {
              this.dataSource.push({
                ...this.dataSource[0],
                nameCandidates: '',
                rationale: '',
                RATE: -1,
                STARS: this.dataSource[0].STARS ? [...(this.dataSource.length > 0 ? this.dataSource[0].STARS : [])] : [...(this.dataSource.length > 0 ? this.dataSource[1].STARS : [])],
                Comments0: ''
              });
            }
          }
          const columnName = this.displayedColumns.filter(col => col !== 'STARS' && col !== 'RATE')[prop];
        }
      });
    } else {
      console.warn('No changes detected or changes is null');
    }
    console.log(this.dataSource)

  }

  addColumn(columnName: string, columnData: any[] = []): void {
    this.displayedColumns.push(columnName);
    this.dataSource.forEach((row, index) => {
      row[columnName] = columnData[index] !== undefined ? columnData[index] : '';
    });

    this.hotInstance.updateSettings({
      colHeaders: [...this.displayedColumns, 'Actions'],
      columns: [
        ...this.displayedColumns
          .filter(col => col !== 'STARS' && col !== 'RATE' && !col.includes('RadioColumn'))
          .map(col => ({
            data: col,
            width: 150,
          })),
        {
          data: 'actions',
          renderer: (instance, td, row, col, prop, value, cellProperties) => {
            Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
            const button = document.createElement('button');
            button.innerText = 'Delete';
            button.onclick = () => this.removeRow(row);
            td.appendChild(button);
            td.style.textAlign = 'center';
          },
          width: 100,
        }
      ],
    });

    this.hotInstance.loadData(this.dataSource);
    this.removeDuplicateColumns(); // Llamar a la función para eliminar columnas duplicadas
  }

  removeDuplicateColumns(): void {
    const columnsToRemove: string[] = [];

    this.displayedColumns.forEach((col, colIndex) => {
      for (let i = colIndex + 1; i < this.displayedColumns.length; i++) {
        const col2 = this.displayedColumns[i];
        const isDuplicate = this.dataSource.every((row, rowIndex) => row[col] === row[col2]);

        if (isDuplicate) {
          columnsToRemove.push(col2);
        }
      }
    });

    columnsToRemove.forEach(col => {
      this.displayedColumns = this.displayedColumns.filter(c => c !== col);
      this.dataSource.forEach(row => delete row[col]);
    });

    this.hotInstance.updateSettings({
      colHeaders: [...this.displayedColumns, 'Actions'],
      columns: [
        ...this.displayedColumns
          .filter(col => col !== 'STARS' && col !== 'RATE' && !col.includes('RadioColumn'))
          .map(col => ({
            data: col,
            width: 150,
          })),
        {
          data: 'actions',
          renderer: (instance, td, row, col, prop, value, cellProperties) => {
            Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
            const button = document.createElement('button');
            button.innerText = 'Delete';
            button.onclick = () => this.removeRow(row);
            td.appendChild(button);
            td.style.textAlign = 'center';
          },
          width: 100,
        }
      ],
    });

    this.hotInstance.loadData(this.dataSource);
  }

  addRow(): void {
    const newRow = this.displayedColumns.reduce((acc, col) => {
      acc[col] = '';
      return acc;
    }, {});

    this.dataSource.push(newRow);
    this.hotInstance.loadData(this.dataSource);
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
