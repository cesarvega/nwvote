import { Component } from '@angular/core';
import { MessageComponent } from '../bmx/components/message/message.component';

@Component({
  selector: 'app-stand-alone-test-component',
  standalone: true,
  imports: [MessageComponent],
  templateUrl: './stand-alone-test-component.component.html',
  styleUrl: './stand-alone-test-component.component.scss'
})
export class StandAloneTestComponentComponent {

}
