import { Component, Input } from '@angular/core';

type StatusTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral';

@Component({
  selector: 'app-status-pill',
  standalone: false,
  templateUrl: './status-pill.component.html',
  styleUrls: ['./status-pill.component.scss']
})
export class StatusPillComponent {
  @Input() value: unknown = null;
  @Input() emptyText = '—';

  get displayValue(): string {
    if (this.value === null || this.value === undefined || this.value === '') {
      return this.emptyText;
    }

    return String(this.value);
  }

  get tone(): StatusTone {
    const status = this.displayValue
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .trim();

    if (!status || status === this.emptyText.toLowerCase()) {
      return 'neutral';
    }

    if (/(rejected|declined|failed|cancelled|canceled|void|overdue|expired|withdrawn|terminated|inactive|disabled|error)/.test(status)) {
      return 'danger';
    }

    if (/(pending|awaiting|review|draft|hold|due|progress|submitted|requested)/.test(status)) {
      return 'warning';
    }

    if (/(active|approved|accepted|paid|completed|fulfilled|resolved|verified|enabled|available|settled|successful)/.test(status)) {
      return 'success';
    }

    if (/(issued|open|new|assigned|scheduled|processing|invoiced|running)/.test(status)) {
      return 'info';
    }

    return 'neutral';
  }
}
