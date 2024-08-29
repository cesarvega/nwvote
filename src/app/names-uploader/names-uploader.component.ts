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
  private hotInstance!: Handsontable; // Store Handsontable instance

  ngAfterViewInit() {
    if (this.hotContainer) {
      const container = this.hotContainer.nativeElement;
      this.hotInstance = new Handsontable(container, {
        data: this.dataSource, // Directly use the dataSource for the table data
        colHeaders: [...this.displayedColumns.filter(col => col !== 'STARS' && col !== 'RATE'), 'Actions'], // Add Actions column
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
              td.style.textAlign = 'center'; // Center the button in the cell
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
        colWidths: 150, // maxWhit for columns
        stretchH: 'all', // Set the columns to stretch proportionally within the total available width
        afterChange: (changes: any[]) => {
          this.updateDataSource(changes);
        },
        afterPaste: (changes: any[]) => {
      //    this.displayedColumns = changes[0];
    //  console.log(this.displayedColumns)
 //     console.log(changes[0][0])
 //console.log(this.isRanking)
 //console.log("up tipo")
 if (changes[0].length >= this.displayedColumns.length) {
  const support = changes[0].length - this.displayedColumns.length;
  const newColumns: { name: string, values: any[] }[] = []; // types
//
  for (let index = 0; index < (this.isRanking === "ranking-scale" ?support :support+1) ; index++) {
   let columnIndex:number =0

    if(this.isRanking === "ranking-scale") {
      columnIndex = this.displayedColumns.length + index   ;
    }else {
      columnIndex = this.displayedColumns.length + index  - 1;

    }

    //console.log(columnIndex)
    //Extract the values of the new column from changes.

    const columnValues = changes.map(change => change[columnIndex]);


    const columnName = `New Column ${columnIndex + 1}`;

    // new column in temporal array
    newColumns.push({ name: columnName, values: columnValues });
  }

  // Add new columns
  newColumns.forEach(col => this.addColumn(col.name, col.values));

}


//this.updateDataSource(changes);

}});

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
          // Check if we need to add new rows
          if (rowIndex >= this.dataSource.length) {
            while (rowIndex >= this.dataSource.length) {
              this.dataSource.push({
                ...this.dataSource[0],
                nameCandidates: '',
                rationale: '',
                RATE: -1,
                STARS: this.dataSource[0].STARS ? [...(this.dataSource.length > 0 ? this.dataSource[0].STARS : [])] : [...(this.dataSource.length > 0 ? this.dataSource[1].STARS : [])] // Keep the STARS structure
                , // Keep the STARS structure
                Comments0: ''
              });
            }

          }

          // Update the existing row
          const columnName = this.displayedColumns.filter(col => col !== 'STARS' && col !== 'RATE')[prop];
          
        }
      });
    } else {
      console.warn('No changes detected or changes is null');
    }
  }

  addColumn(columnName: string, columnData: any[] = []): void {
    this.displayedColumns.push(columnName);

    // Add the new column to each row in dataSource with the provided data or empty strings
    this.dataSource.forEach((row, index) => {
      row[columnName] = columnData[index] !== undefined ? columnData[index] : ''; // Set the value or an empty string
    });

    // Update Handsontable with the new column
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
            td.style.textAlign = 'center'; // Center the button in the cell
          },
          width: 100,
        }
      ],
    });

    // Reload the data in Handsontable to reflect the changes
    this.hotInstance.loadData(this.dataSource);
  }

  addRow(): void {
    const newRow = this.displayedColumns.reduce((acc, col) => {
      acc[col] = ''; // Initialize each column in the new row with an empty string
      return acc;
    }, {});

    // Add the new row to the dataSource
    this.dataSource.push(newRow);

    // Re-render the table with the updated dataSource
    this.hotInstance.loadData(this.dataSource);
  }

  removeRow(rowIndex: number): void {
    // Verify that the index is valid
    if (rowIndex >= 0 && rowIndex < this.dataSource.length) {
      // Remove the row from the dataSource
      this.dataSource.splice(rowIndex, 1);

      // Re-render the table with updated data
      if (this.hotInstance) {
        this.hotInstance.loadData(this.dataSource); // Reload the data from the dataSource
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
