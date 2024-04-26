import {Component, effect, EventEmitter, inject, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import { BMX_STORE } from 'src/app/signals/+store/brs.store';

@Component({
  selector: 'message',
  standalone: true,
  imports: [
    NgIf,
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatDivider,
    MatCardActions,
    MatCardFooter
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  readonly bmxStore = inject(BMX_STORE);

  @Output() accept: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();


  onAccept() {
    this.bmxStore.resetMessageInfo();
    this.accept.emit(); // Emit event

  }

  onCancel() {
    this.bmxStore.resetMessageInfo();
    this.cancel.emit(); // Emit event
  }
}
