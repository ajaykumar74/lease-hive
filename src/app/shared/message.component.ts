import { Component, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
  standalone: false, 
  providers: [MessageService]
})
export class MessageComponent implements OnInit {

  @Input() AlertType: string = 'toast';
  constructor(
    private service: MessageService
  ) {
  }

  msgs = [];

  ngOnInit(): void {

  }

  showSuccess(msg: unknown) {
    const detail = this.getDetail(msg, 'Operation completed successfully.');
    if (this.AlertType == 'toast') {
      this.service.add({ key: 'tst', severity: 'success', summary: 'Success', detail });
    }
    else {
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Info Message', detail });
    }
 setTimeout(() => {
      this.hide();
    }, 3000);

  }

  showError(msg: unknown) {
    const detail = this.getDetail(msg, 'The action could not be completed.');
    this.msgs = [];
    if (this.AlertType == 'toast') {

      this.service.add({ key: 'tst', severity: 'error', summary: 'Action failed', detail });

    }
    else {
      this.msgs.push({ severity: 'error', summary: 'Error', detail });
    }
setTimeout(() => {
      this.hide();
    }, 5000);
  }

  showInfo(msg: unknown) {
    const detail = this.getDetail(msg, 'Information updated.');

    this.msgs = [];
    if (this.AlertType == 'toast') {
      this.service.add({ key: 'tst', severity: 'info', summary: 'Information', detail });

    }
    else {
      this.msgs.push({ severity: 'info', summary: 'Info Message', detail });
    }
setTimeout(() => {
      this.hide();
    }, 3000);
  
  }

  hide() {
    if (this.AlertType == 'toast') {
      this.service.clear('tst');
    } else {
      this.msgs = [];
    }
  }

  private getDetail(message: unknown, fallback: string): string {
    if (typeof message === 'string' && message.trim()) {
      return message.trim();
    }

    if (Array.isArray(message)) {
      const items = message.map(item => this.getDetail(item, '')).filter(Boolean);
      return items.length ? items.join(' ') : fallback;
    }

    const value = message as any;
    return value?.error?.ErrorMessage
      ?? value?.error?.message
      ?? value?.error?.Message
      ?? value?.ErrorMessage
      ?? value?.message
      ?? value?.Message
      ?? fallback;
  }

}
