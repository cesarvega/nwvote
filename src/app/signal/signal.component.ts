import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { StandAloneTestComponentComponent } from '../stand-alone-test-component/stand-alone-test-component.component';
@Component({
  selector: 'app-signal',
  standalone: true,
  imports: [StandAloneTestComponentComponent],
  templateUrl: './signal.component.html',
  styleUrl: './signal.component.scss'
})
export class SignalComponent {
count = signal<number>(0);
ngOnInit(): void {
  this.count.set(10);
}
}
