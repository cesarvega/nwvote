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
  @Input() componentSetting: any
  @Output() save = new EventEmitter();
  @Output() cancelEvent = new EventEmitter();
  @ViewChild('hotContainer', { static: false }) hotContainer!: ElementRef;
  private hotInstance!: Handsontable;
  dataSourceCopy: any[] = [];
  displayedColumnsCopy: string[] = [];

  ngAfterViewInit() {
    this.dataSourceCopy = JSON.parse(JSON.stringify(this.dataSource));
    this.displayedColumnsCopy = JSON.parse(JSON.stringify(this.displayedColumns));
    if (this.componentSetting && this.componentSetting[0].categoryName === 'Category Logo Rating') {
      const newColumnName = 'New Category Logo';
      if (!this.displayedColumns.includes(newColumnName)) {
        this.displayedColumns.push(newColumnName);
      }

      this.dataSource.forEach(row => {
        if (!row.hasOwnProperty(newColumnName)) {
          row[newColumnName] = ''
        }
      });
    }

    if (this.hotContainer) {
      const container = this.hotContainer.nativeElement;
      this.hotInstance = new Handsontable(container, {
        data: this.dataSource,
        colHeaders: [...this.displayedColumns.filter(col => col !== 'RATE'), 'Actions'], 
        columns: [
          ...this.displayedColumns
            .filter(col => col !== 'RATE' && !col.includes('RadioColumn'))
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
        contextMenu: {
          items: {
            'copy': {
              name: 'Copy',
              disabled: () => false,
            },
            'paste': {
              name: 'Paste',
              disabled: () => false,
              callback: () => this.pasteFromClipboard()
            },
            'row_below': {
              name: 'Insert row below',
              callback: () => this.addRow(), 
            },
            'row_above': {
              name: 'Insert row above',
              callback: () => this.addRow(), 
            },
          }
        },
        licenseKey: 'non-commercial-and-evaluation',
        height: 300,
        width: 1024,
        colWidths: 150,
        stretchH: 'all',
        afterChange: (changes: any[]) => {
          this.updateDataSource(changes);
        },
        afterPaste: (changes: any[]) => {
          this.pasteFromClipboard()
        }
      });

      container.style.overflowX = 'auto';
      container.style.overflowY = 'auto';
    } else {
      console.error('hotContainer is not available');
    }
  }
  handlePaste(data: string): void {
    const selected = this.hotInstance.getSelected();
    if (selected && selected.length) {
      const [startRow, startCol] = selected[0];
  
      const lines = data.split('\n').filter(line => line.trim().length > 0);
      const pastedColumnsCount = lines[0].split('\t').length;
      const numberOfRowsToAdd = (startRow + lines.length) - this.hotInstance.countRows();
      const numberOfColsToAdd = (startCol + pastedColumnsCount) - (this.hotInstance.countCols() - 1); // Exclude "Actions" column
  
      if (numberOfRowsToAdd > 0) {
        for (let i = 0; i < numberOfRowsToAdd; i++) {
          this.addRow();
        }
      }
  
      // Asegurarse de añadir suficientes columnas
      if (numberOfColsToAdd > 0) {
        const newColumns = [];
        for (let i = 0; i < numberOfColsToAdd; i++) {
          const columnName = `New Column ${this.displayedColumns.length + 1}`;
          newColumns.push(columnName);
          this.displayedColumns.splice(this.displayedColumns.length - 1, 0, columnName); // Insert before "Actions"
        }
        this.hotInstance.updateSettings({
          colHeaders: [...this.displayedColumns],
          columns: [
            ...this.displayedColumns
              .filter(col => col !== 'RATE' && !col.includes('RadioColumn'))
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
              readOnly: true,
            }
          ],
        });
      }
  
      // Ajustar las celdas pegadas correctamente
      lines.forEach((line, rowIndex) => {
        const cells = line.split('\t');
        cells.forEach((cell, colIndex) => {
          const row = startRow + rowIndex;
          const col = startCol + colIndex;
          if (row < this.hotInstance.countRows() && col < this.hotInstance.countCols() - 1) { // Exclude "Actions" column
            this.hotInstance.setDataAtCell(row, col, cell);
          }
        });
      });
    }
  }
  


  async pasteFromClipboard(): Promise<void> {
    try {
      const clipboardData = await navigator.clipboard.readText();
      this.handlePaste(clipboardData);
    } catch (error) {
      console.error('Failed to read clipboard contents: ', error);
    }
  }


  updateDataSource(changes: any[]): void {
    if (changes) {
      changes.forEach(([rowIndex, col, prop, oldValue, newValue]) => {
        if (rowIndex !== undefined) {
          if (rowIndex >= this.dataSource.length) {
            while (rowIndex >= this.dataSource.length) {
              this.dataSource.push({
                ...this.dataSource[1],
                nameCandidates: '',
                rationale: '',
                RATE: -1,
                STARS: this.dataSource[1].STARS ? [...(this.dataSource.length > 0 ? this.dataSource[1].STARS : [])] : [...(this.dataSource.length > 0 ? this.dataSource[1].STARS : [])],
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
  }

  addColumn(columnName: string, columnData: any[] = []): void {
    this.displayedColumns.push(columnName);

    this.dataSource.forEach((row, index) => {
      if (columnName !== 'RATE') {
        row[columnName] = columnData[index] !== undefined ? columnData[index] : '';
      }
    });

    this.hotInstance.updateSettings({
      colHeaders: [...this.displayedColumns.filter(col => col !== 'RATE'), 'Actions'],       columns: [
        ...this.displayedColumns
          .filter(col => col !== 'RATE' && !col.includes('RadioColumn'))
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
          readOnly: true,
        }
      ],
    });

    this.hotInstance.loadData(this.dataSource);
  }

  addRow(): void {
    const newRow = this.displayedColumns.reduce((acc, col) => {
      if (col === 'STARS') {
        acc[col] = this.dataSource.length > 0 ? [...this.dataSource[1].STARS] : []; 
      } else if (col === 'RATE') {
        acc[col] = this.dataSource.length > 0 ? this.dataSource[1].RATE : -1; 
      } else {
        acc[col] = ''; 
      }
      return acc;
    }, {});

    this.dataSource.push(newRow);
    this.hotInstance.loadData(this.dataSource);
  }
  removeDuplicateColumns(): void {
    const columnsToRemove: string[] = [];
    const seenColumns: Set<string> = new Set();
  
    this.displayedColumns.forEach((col, colIndex) => {
      if (col === 'STARS') return; // Evitar eliminar la columna STARS
      for (let i = colIndex + 1; i < this.displayedColumns.length; i++) {
        const col2 = this.displayedColumns[i];
        const isDuplicate = this.dataSource.every(row => row[col] === row[col2]);
  
        if (isDuplicate) {
          if (!seenColumns.has(col)) {
            seenColumns.add(col);
          } else {
            columnsToRemove.push(col2);
            break;
          }
        }
      }
    });
  
    columnsToRemove.forEach(col => {
      this.displayedColumns = this.displayedColumns.filter(c => c !== col);
      this.dataSource.forEach(row => delete row[col]);
    });
  
    this.hotInstance.updateSettings({
      colHeaders: [...this.displayedColumns.filter(col => col !== 'RATE'), 'Actions'], // Oculta RATE
      columns: [
        ...this.displayedColumns
          .filter(col => col !== 'RATE' && !col.includes('RadioColumn'))
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
          readOnly: true,
        }
      ],
    });
  
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
  removeColumnsWithNumbers(): void {
    console.log(this.displayedColumns);
  
    this.displayedColumns = this.displayedColumns.filter(col => !/^\d+$/.test(col) && col !== 'STARS'); // Evitar eliminar STARS
  
    this.dataSource.forEach(row => {
      Object.keys(row).forEach(key => {
        if (/^\d+$/.test(key)) {
          delete row[key];
        }
      });
    });
  
    if (this.hotInstance) {
      this.hotInstance.loadData(this.dataSource);
      this.hotInstance.updateSettings({
        columns: this.displayedColumns.map(col => ({ data: col })),
        colHeaders: [...this.displayedColumns.filter(col => col !== 'RATE'), 'Actions'],
      });
    } else {
      console.warn('hotInstance is not available');
    }
  }
  

  saveChanges(): void {
    this.save.emit(this.dataSource);
    if (this.isRanking === "rate-scale") {
    }

      this.removeColumnsWithNumbers();

      this.removeDuplicateColumns();
  }

  cancel(): void {
    this.dataSource = this.dataSourceCopy;
    this.displayedColumns = this.displayedColumnsCopy;
    this.cancelEvent.emit({ dataSource: this.dataSource, columnsNames: this.displayedColumns });
  }
}
