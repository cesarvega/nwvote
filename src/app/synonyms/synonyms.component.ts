import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BehaviorSubject, map, forkJoin } from 'rxjs';
import { BsrService } from '../bsr/bsr.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-synonyms',
  standalone: true,
  imports: [MatCheckboxModule, CommonModule, FormsModule],
  templateUrl: './synonyms.component.html',
  styleUrl: './synonyms.component.scss'
})
export class SynonymsComponent {
  inputText: string = '';
  isSynonymBox: boolean = false;
  dataSource: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  @Output() selectedSynonyms = new EventEmitter<string[]>();

  constructor(private _BsrService: BsrService, private cdr: ChangeDetectorRef) {}

  async getSynonyms() {
    const words = this.inputText.split(',').map(word => word.trim());
    const requests = words.map(word =>
      this._BsrService.getSinonyms(word).pipe(
        map((res: any) => {
          const parsedRes = JSON.parse(res);
          return { word, synonyms: parsedRes.map((syn: any) => ({ word: syn.word, selected: false })) };
        })
      )
    );

    forkJoin(requests).subscribe((results: any[]) => {
      const data: any[] = results.map(res => ({
        word: res.word,
        synonyms: res.synonyms
      }));
      this.dataSource.next(data);
      this.isSynonymBox = true;
      this.cdr.markForCheck();
    });
  }

  toggleSelection(word: string, synonym: any) {
    this.cdr.markForCheck();
  }

  emitSelectedSynonyms() {

    const selected = this.dataSource.value.reduce((acc, item) => {

      const selectedSynonyms = item.synonyms
        .filter((synonym: any) => {
          return synonym.selected;
        })
        .map((synonym: any) => synonym.word);

      return acc.concat(selectedSynonyms);
    }, []);

    this.selectedSynonyms.emit(selected);
  }
}
