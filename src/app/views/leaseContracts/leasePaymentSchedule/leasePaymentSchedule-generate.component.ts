import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { IGenerateLeasePaymentScheduleRequest, ILeasePaymentSchedule } from './leasePaymentSchedule';
import { LeasePaymentScheduleService } from './leasePaymentSchedule.service';
import { ILeasePaymentScheduleLine } from '../leasePaymentScheduleLine/leasePaymentScheduleLine';

@Component({
  selector: 'app-leasePaymentSchedule-generate',
  standalone: false,
  templateUrl: './leasePaymentSchedule-generate.component.html',
  providers: [MessageService]
})
export class LeasePaymentScheduleGenerateComponent implements OnInit {
  selectedId: number;
  isLoading = false;
  isGenerating = false;
  Caption = 'Generate Schedule';
  permission = {} as IPermission;
  leasePaymentSchedule: ILeasePaymentSchedule = null;
  generatedLines: ILeasePaymentScheduleLine[] = [];
  editForm: any;

  readonly paymentTimingOptions: ISelectItem[] = [
    { Value: 'ADVANCE', Text: 'Advance' },
    { Value: 'ARREAR', Text: 'Arrear' }
  ];
  readonly monthlyDueDayOptions: ISelectItem[] = Array.from({ length: 28 }, (_, index) => {
    const day = index + 1;
    return { Value: String(day), Text: this.ordinal(day) };
  });

  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private leasePaymentScheduleService: LeasePaymentScheduleService
  ) { }

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    this.editForm = this.fb.group({
      TotalAmount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      TaxRate: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      Months: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(600)]),
      PaymentTiming: new FormControl('ARREAR', [Validators.required]),
      Roi: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      MonthlyDueDay: new FormControl('5', [Validators.required])
    });
    this.selectedId = Number(this.activatedRouter.snapshot.params['id']);
    this.loadUI();
  }

  loadUI(): void {
    this.isLoading = true;
    this.leasePaymentScheduleService.getById(this.selectedId).subscribe({
      next: data => {
        this.leasePaymentSchedule = data.data;
        this.permission = data.permission;
        this.editForm.patchValue({
          TotalAmount: this.leasePaymentSchedule.TotalRentalAmount || 0,
          TaxRate: this.getDefaultTaxRate(this.leasePaymentSchedule),
          Months: this.leasePaymentSchedule.NumberOfPayments || 1,
          PaymentTiming: 'ARREAR',
          Roi: 0,
          MonthlyDueDay: String(this.getDefaultDueDay(this.leasePaymentSchedule))
        });
        this.Caption = `Generate Schedule #${this.leasePaymentSchedule.LeasePaymentScheduleId || this.leasePaymentSchedule.Id}`;
        this.editForm.markAsPristine();
      },
      error: err => this.messageService.showError(err),
      complete: () => this.isLoading = false
    });
  }

  onOptionItemClicked(key: string): void {
    if (key === 'Generate') this.generate();
  }

  generate(): void {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) {
      this.messageService.showError('Complete the schedule generation fields before continuing.');
      return;
    }

    const values = this.editForm.value;
    const request: IGenerateLeasePaymentScheduleRequest = {
      TotalAmount: Number(values.TotalAmount),
      TaxRate: Number(values.TaxRate),
      Months: Number(values.Months),
      PaymentTiming: values.PaymentTiming,
      Roi: Number(values.Roi),
      MonthlyDueDay: Number(values.MonthlyDueDay),
      RowVersionStr: this.leasePaymentSchedule.RowVersionStr
    };

    this.isGenerating = true;
    this.spinner.showLoadingMsg('Generating payment schedule...');
    this.leasePaymentScheduleService.generate(this.selectedId, request).subscribe({
      next: response => {
        this.leasePaymentSchedule = response.data.Schedule;
        this.generatedLines = response.data.Lines || [];
        this.leasePaymentScheduleService.CacheData.IsLoaded = false;
        this.editForm.markAsPristine();
        this.messageService.showSuccess(`${this.generatedLines.length} payment lines generated successfully.`);
      },
      error: err => this.messageService.showError(err),
      complete: () => {
        this.isGenerating = false;
        this.spinner.hide();
      }
    });
  }

  private getDefaultTaxRate(schedule: ILeasePaymentSchedule): number {
    if (!schedule?.TotalRentalAmount) return 0;
    return Number((((schedule.TotalTaxAmount || 0) * 100) / schedule.TotalRentalAmount).toFixed(4));
  }

  private getDefaultDueDay(schedule: ILeasePaymentSchedule): number {
    const startDate = schedule?.StartDate ? new Date(schedule.StartDate) : new Date();
    return Math.min(28, Math.max(1, startDate.getDate()));
  }

  private ordinal(day: number): string {
    const suffix = day % 10 === 1 && day % 100 !== 11 ? 'st'
      : day % 10 === 2 && day % 100 !== 12 ? 'nd'
        : day % 10 === 3 && day % 100 !== 13 ? 'rd' : 'th';
    return `${day}${suffix}`;
  }
}
