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
  private hotInstance!: Handsontable; // Store Handsontable instance

  ngAfterViewInit() {
    console.log(this.dataSource, this.displayedColumns)
    if (this.hotContainer) {
      const container = this.hotContainer.nativeElement;
      this.hotInstance = new Handsontable(container, {
        data: this.dataSource, // Directly use the dataSource for the table data
        colHeaders: [...this.displayedColumns.filter(col => col !== 'STARS' && col !== 'RATE'), 'Actions'], // Add Actions column
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
              td.style.textAlign = 'center'; // Center the button in the cell
            }
          }
        ],
        rowHeaders: true,
        filters: true,
        dropdownMenu: true,
        contextMenu: false, // Disables default context menu
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

  updateDataSource(changes: any[]): void {
    if (changes) {
      changes.forEach(([rowIndex, prop, oldValue, newValue]) => {
        if (rowIndex !== undefined && this.displayedColumns[prop]) {
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
