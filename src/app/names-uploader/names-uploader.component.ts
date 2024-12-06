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
    const rateColumnIndex = this.displayedColumns.findIndex(col => col === 'RATE');

    if (rateColumnIndex !== -1) {
      const rateColumn = this.displayedColumns.splice(rateColumnIndex, 1)[0];

      this.displayedColumns.push(rateColumn);
    }
    this.displayedColumnsCopy = JSON.parse(JSON.stringify(this.displayedColumns));

    if (this.componentSetting && this.componentSetting[0].categoryName === 'Category Logo Rating') {
      const newColumnName = 'NewCategoryLogo';
      if (!this.displayedColumns.includes(newColumnName)) {
        this.displayedColumns.splice(1, 0, newColumnName);
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
              if (row !== 0) {
                const button = document.createElement('button');
                button.innerText = 'Delete';
                button.onclick = () => this.removeRow(row);
                td.appendChild(button);
                td.style.textAlign = 'center';
              }
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
      // Obtenemos la primera celda seleccionada
      const [startRow, startCol] = selected[0];
  
      // Aseguramos que startCol no sea -1
      const validStartCol = startCol === -1 ? 0 : startCol;
      
      // Ajustar startRow si se está usando el menú contextual (si es necesario)
      const adjustedStartRow = (startRow === 0 && startCol === 0) ? startRow : Math.max(startRow, 0);
  
      // Procesamos los datos del portapapeles
      const lines = data.split('\n').filter(line => line.trim().length > 0);
      const pastedColumnsCount = lines[0].split('\t').length;
  
      // Calculamos el número de filas y columnas a agregar
      const numberOfRowsToAdd = (adjustedStartRow + lines.length) - this.hotInstance.countRows();
      const numberOfColsToAdd = (validStartCol + pastedColumnsCount) - (this.hotInstance.countCols() - 1);
  
      // Agregar filas si es necesario
      if (numberOfRowsToAdd > 0) {
        for (let i = 0; i < numberOfRowsToAdd; i++) {
          this.addRow();
        }
      }
  
      // Agregar columnas si es necesario
      if (numberOfColsToAdd > 0) {
        const newColumns = [];
        for (let i = 0; i < numberOfColsToAdd; i++) {
          const columnName = `New Column ${this.displayedColumns.length + 1}`;
          newColumns.push(columnName);
          this.displayedColumns.splice(this.displayedColumns.length - 1, 0, columnName);
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
  
      // Pegar los datos en las celdas
      lines.forEach((line, rowIndex) => {
        const cells = line.split('\t');
        cells.forEach((cell, colIndex) => {
          const row = adjustedStartRow + rowIndex; // Usar adjustedStartRow aquí
          const col = validStartCol + colIndex; // Usar validStartCol aquí
  
          // Validamos que no exceda el límite de filas y columnas
          if (row >= 0 && row < this.hotInstance.countRows() && col >= 0 && col < this.hotInstance.countCols() - 1) {
            // Asegúrate de que el valor no sea indefinido o nulo
            if (cell !== undefined && cell !== null) {
              this.hotInstance.setDataAtCell(row, col, cell);
            }
          }
        });
      });
  
      // Lógica adicional para manejar los comentarios
      const commentsColumnIndex = this.displayedColumns.findIndex(col => col.includes('Comments'));
      let adjustedPastedColumnsCount = pastedColumnsCount;
  
      // Aseguramos que no se dupliquen los comentarios
      if (this.componentSetting && this.componentSetting[0].categoryName === 'Category Logo Rating') {
        adjustedPastedColumnsCount++;
      } else {
        adjustedPastedColumnsCount--;
      }
  
      if (commentsColumnIndex !== -1 && adjustedPastedColumnsCount >= commentsColumnIndex) {
        // Solo actualiza los comentarios si hay algo que pegar
        if (lines.length > 0) {
          this.updateCommentsWithCopy(this.dataSource, this.dataSourceCopy);
        }
      }
  
      // Asegúrate de que no haya duplicados en la columna de comentarios
      this.removeDuplicateRowsInFirstColumn();
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
                STARS: this.dataSource[1].STARS,
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
  updateCommentsWithCopy(datasource, copy) {
    datasource.forEach((dataItem, index) => {
      const copyItem = copy[index] || {};

      Object.keys(dataItem).forEach(key => {
        if (key.startsWith("Comments")) {
          const commentValue = dataItem[key];
          const newCommentValue = copyItem[key] !== undefined ? copyItem[key] : '';
          if (commentValue) {
            let newColumnIndex = 4;
            while (dataItem[`New Column ${newColumnIndex}`] !== undefined) {
              newColumnIndex++;
            }
            dataItem[`New Column ${newColumnIndex}`] = commentValue;

            const newColumnKey = `New Column ${newColumnIndex}`;
            if (!this.displayedColumns.includes(newColumnKey)) {
              this.displayedColumns.push(newColumnKey);
            }
          }

          dataItem[key] = newCommentValue;
        }
      });

    });
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
    console.log(this.dataSource)
    return datasource;
  }


  addColumn(columnName: string, columnData: any[] = []): void {
    this.displayedColumns.push(columnName);

    this.dataSource.forEach((row, index) => {
      if (columnName !== 'RATE') {
        row[columnName] = columnData[index] !== undefined ? columnData[index] : '';
      }
    });

    this.hotInstance.updateSettings({
      colHeaders: [...this.displayedColumns.filter(col => col !== 'RATE'), 'Actions'], columns: [
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
      if (col === 'STARS') return;
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

    this.displayedColumns = this.displayedColumns.filter(col => !/^\d+$/.test(col) && col !== 'STARS');

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
    console.log(this.dataSource)

    this.removeDuplicateRowsInFirstColumn();

    if (this.isRanking === "rate-scale") {
    }

    this.removeColumnsWithNumbers();
    this.removeDuplicateColumns();
    console.log(this.dataSource)
    this.save.emit(this.dataSource);
  }
  removeDuplicateRowsInFirstColumn(): void {
    if (this.displayedColumns.length === 0) {
      console.warn('No columns available');
      return;
    }

    const firstColumn = this.displayedColumns[0];
    const secondColumn = this.displayedColumns[1]

    const columnToCheck = this.componentSetting && this.componentSetting[0].categoryName === 'Category Logo Rating' && secondColumn
      ? secondColumn
      : firstColumn;

    const uniqueValues = new Set();
    const rowsToKeep: any[] = [];

    this.dataSource.forEach(row => {
      const value = row[columnToCheck];
      if (!uniqueValues.has(value)) {
        uniqueValues.add(value);
        rowsToKeep.push(row);
      }
    });

    this.dataSource = rowsToKeep;

    if (this.hotInstance) {
      this.hotInstance.loadData(this.dataSource);
    }
  }


  cancel(): void {
    this.dataSource = this.dataSourceCopy;
    this.displayedColumns = this.displayedColumnsCopy;
    this.cancelEvent.emit({ dataSource: this.dataSource, columnsNames: this.displayedColumns });
  }
}
