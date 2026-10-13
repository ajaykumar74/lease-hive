import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-confirmation-message',
    standalone: false,
    templateUrl: './confirmation-message.component.html',
    providers: [ConfirmationService]
})
export class ConfirmationMessageComponent {
    @Input() key = 'confirmation-message';
    @Input() message = 'Are you sure you want to continue?';
    @Input() header = 'Confirm action';
    @Input() acceptLabel = 'Yes';
    @Input() rejectLabel = 'No';
    @Input() icon = 'pi pi-exclamation-triangle';
    @Input() acceptButtonStyleClass = '';

    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    constructor(private readonly confirmationService: ConfirmationService) {}

    show(message = this.message): void {
        this.confirmationService.confirm({
            key: this.key,
            message,
            header: this.header,
            icon: this.icon,
            acceptLabel: this.acceptLabel,
            rejectLabel: this.rejectLabel,
            acceptButtonStyleClass: this.acceptButtonStyleClass,
            defaultFocus: 'reject',
            accept: () => this.confirmed.emit(),
            reject: () => this.cancelled.emit()
        });
    }
}
