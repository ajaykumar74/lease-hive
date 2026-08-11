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

  showSuccess(msg: string) {
    if (this.AlertType == 'toast') {
      this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail: 'Message sent' });
    }
    else {
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Info Message', detail: msg });
    }
 setTimeout(() => {
      this.hide();
    }, 3000);

  }

  showError(msg: string) {
    this.msgs = [];
    if (this.AlertType == 'toast') {

      this.service.add({ key: 'tst', severity: 'error', summary: 'Error Message', detail: 'Validation failed' });

    }
    else {
      this.msgs.push({ severity: 'error', summary: 'Info Message', detail: msg });
    }
setTimeout(() => {
      this.hide();
    }, 5000);
  }

  showInfo(msg: string) {

    this.msgs = [];
    if (this.AlertType == 'toast') {
      this.service.add({ key: 'tst', severity: 'info', summary: 'Info Message', detail: 'PrimeNG rocks' });

    }
    else {
      this.msgs.push({ severity: 'info', summary: 'Info Message', detail: msg });
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

}
