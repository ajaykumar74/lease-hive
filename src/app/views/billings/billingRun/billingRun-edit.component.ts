import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  
 
 
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IBillingRun } from './billingRun';
import { BillingRunService } from './billingRun.service';
import { IBillingRunItem } from '../billingRunItem/billingRunItem';
import { CustomerInvoiceService } from '../customerInvoice/customerInvoice.service';
import { ICustomerInvoice } from '../customerInvoice/customerInvoice';


@Component({
  selector: 'app-billingRun-edit',
  standalone: false,
  templateUrl: './billingRun-edit.component.html',
  styleUrls: ['./billingRun-workflow.css'],
  providers: [ MessageService, ConfirmationService]
})
export class BillingRunEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  billingRun: IBillingRun = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  billingorganisationidOptions: ISelectItem[] = [];
billingrunstatusidOptions: ISelectItem[] = [];
runtypeOptions: ISelectItem[] = [];
approvedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
leasepaymentschedulelineidOptions: ISelectItem[] = [];
leasecontractchargeidOptions: ISelectItem[] = [];
customerinvoiceidOptions: ISelectItem[] = [];
sourcetypeOptions: ISelectItem[] = [];
validationstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IBillingRun = {} as IBillingRun;
  isValidating = false;
  isApproving = false;
  isGeneratingInvoices = false;
  isIssuingInvoices = false;
  isInvoiceIssuanceSummaryLoading = false;
  draftInvoiceCount = 0;
  issuedInvoiceCount = 0;
  invoiceIssuanceSummaryError = '';
  invoiceIssueResult: any = null;
  private invoiceIssuanceSummaryRequest = 0;

  get billingRunStatusCode(): string {
    return String(this.billingRun?.BillingRunStatusCode || '').toUpperCase();
  }

  get isDraft(): boolean {
    return this.billingRunStatusCode === 'DRAFT';
  }

  get isValidated(): boolean {
    return this.billingRunStatusCode === 'VALIDATED';
  }

  get isApprovedForInvoiceGeneration(): boolean {
    return this.billingRunStatusCode === 'APPROVED';
  }

  get hasGeneratedInvoices(): boolean {
    return Number(this.billingRun?.InvoiceCount || 0) > 0
      || (this.billingRun?.BillingRunItems || []).some(item => Number(item.CustomerInvoiceId || 0) > 0);
  }

  get isWorkflowActionInProgress(): boolean {
    return this.isValidating || this.isApproving || this.isGeneratingInvoices || this.isIssuingInvoices;
  }

  get workflowItems(): IBillingRunItem[] {
    return this.billingRun?.BillingRunItems || [];
  }

  get validItemCount(): number {
    return this.workflowItems.filter(item => this.validationStatus(item) === 'VALID').length;
  }

  get excludedItemCount(): number {
    return this.workflowItems.filter(item => this.validationStatus(item) === 'EXCLUDED').length;
  }

  get errorItemCount(): number {
    return this.workflowItems.filter(item => this.validationStatus(item) === 'INVALID' || this.validationStatus(item) === 'ERROR').length;
  }

  get validationStatusLabel(): string {
    return this.isDraft ? (this.errorItemCount ? 'Action required' : 'Ready to validate') : 'Validated';
  }

  get approvalStatusLabel(): string {
    return this.isApprovedForInvoiceGeneration ? 'Approved' : this.isValidated ? 'Ready for approval' : 'Pending validation';
  }

  get invoiceGenerationStatusLabel(): string {
    return this.hasGeneratedInvoices ? 'Draft invoices generated' : this.isApprovedForInvoiceGeneration ? 'Ready to execute' : 'Awaiting approval';
  }

  get invoiceIssuanceStatusLabel(): string {
    if (!this.hasGeneratedInvoices) return 'Awaiting draft invoices';
    if (this.isInvoiceIssuanceSummaryLoading) return 'Loading invoice status';
    if (this.draftInvoiceCount > 0) return 'Invoices ready to issue';
    return this.issuedInvoiceCount > 0 ? 'All listed invoices issued' : 'No invoices available';
  }

  get bulkIssueFailures(): any[] {
    return (this.invoiceIssueResult?.Invoices || []).filter((invoice: any) => invoice?.Outcome === 'Failed');
  }


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private billingRunService: BillingRunService, 
	private customerInvoiceService: CustomerInvoiceService,
	private loggedInUserService : LoggedInUserService,
    private confirmationService: ConfirmationService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.billingRun };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
BillingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BillingDate: new FormControl(new Date(), [Validators.required]),
PeriodFrom: new FormControl(new Date(), []),
PeriodTo: new FormControl(new Date(), []),
BillingRunStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RunType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CandidateCount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InvoiceCount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TotalAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
ApprovedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovedAtUtc: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
BillingRunItems: this.fb.array([]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'BillingOrganisationId', 'organisations',
      options => this.billingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'BillingRunStatusId', 'billing-run-statuses',
      options => this.billingrunstatusidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.runtypeOptions = this.loggedInUserService.getPicklistOptions('RunType');
this.loggedInUserService.bindEntityLookup(this.editForm, 'ApprovedByUserId', 'application-users',
      options => this.approvedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');
this.loadBillingRunItemOptions();

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.billingRunService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.billingRun = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.billingRun };
        this.populateUI(this.billingRun);
        this.loadInvoiceIssuanceSummary();
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IBillingRun): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
BillingDate:  obj.BillingDate || null,
PeriodFrom:  obj.PeriodFrom || null,
PeriodTo:  obj.PeriodTo || null,
BillingRunStatusId: obj.BillingRunStatusId || 0,
RunType: obj.RunType || '',
CandidateCount: obj.CandidateCount || 0,
InvoiceCount: obj.InvoiceCount || 0,
TotalAmount: obj.TotalAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAtUtc:  obj.ApprovedAtUtc || null,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
    this.setBillingRunItems(obj.BillingRunItems || []);
    this.applyWorkflowEditability();
   
	 this.Caption = "BillingRun Details #" + obj.Id;
  } 

  get billingRunItems(): FormArray<FormGroup> { return this.editForm.get('BillingRunItems') as FormArray<FormGroup>; }

  addBillingRunItem(item?: Partial<IBillingRunItem>): void {
    if (this.billingRun && !this.isDraft) return;
    const line = this.fb.group({
      Id: new FormControl(item?.Id || 0),
      RowVersionStr: new FormControl(item?.RowVersionStr || ''),
      LeaseContractId: new FormControl(item?.LeaseContractId || 0, [Validators.required, Validators.min(1)]),
      LeasePaymentScheduleLineId: new FormControl(item?.LeasePaymentScheduleLineId || 0, [Validators.min(0)]),
      LeaseContractChargeId: new FormControl(item?.LeaseContractChargeId || 0, [Validators.min(0)]),
      SourceType: new FormControl(item?.SourceType || '', [Validators.required, Validators.maxLength(20)]),
      DueDate: new FormControl(item?.DueDate || new Date(), [Validators.required]),
      Amount: new FormControl(item?.Amount || 0, [Validators.required, Validators.min(0)]),
      CurrencyCode: new FormControl(item?.CurrencyCode || '', [Validators.required, Validators.maxLength(20)]),
      ValidationStatus: new FormControl(item?.ValidationStatus || '', [Validators.required, Validators.maxLength(20)]),
      ExclusionReason: new FormControl(item?.ExclusionReason || '', [Validators.maxLength(100)]),
      CustomerInvoiceId: new FormControl(item?.CustomerInvoiceId || 0, [Validators.min(0)]),
      RecordStatus: new FormControl(item?.RecordStatus || 'Active', [Validators.required, Validators.maxLength(20)])
    });
    line.valueChanges.subscribe(() => this.recalculateBillingRunItems());
    this.billingRunItems.push(line);
    this.recalculateBillingRunItems();
  }

  removeBillingRunItem(index: number): void {
    if (!this.isDraft) return;
    this.billingRunItems.removeAt(index);
    this.recalculateBillingRunItems();
  }

  private setBillingRunItems(items: IBillingRunItem[]): void {
    this.billingRunItems.clear();
    items.forEach(item => this.addBillingRunItem(item));
    this.recalculateBillingRunItems();
  }

  private recalculateBillingRunItems(): void {
    const items = this.billingRunItems.getRawValue() as IBillingRunItem[];
    this.editForm.patchValue({
      CandidateCount: items.length,
      InvoiceCount: items.filter((item: IBillingRunItem) => Number(item.CustomerInvoiceId) > 0).length,
      TotalAmount: items.reduce((total: number, item: IBillingRunItem) => total + Number(item.Amount || 0), 0)
    }, { emitEvent: false });
  }

  private applyWorkflowEditability(): void {
    const workflowControls = ['BillingRunStatusId', 'CandidateCount', 'InvoiceCount', 'TotalAmount', 'ApprovedByUserId', 'ApprovedAtUtc'];

    this.editForm.enable({ emitEvent: false });
    if (!this.isDraft) {
      this.editForm.disable({ emitEvent: false });
      return;
    }

    workflowControls.forEach(controlName => this.editForm.get(controlName)?.disable({ emitEvent: false }));
    this.billingRunItems.controls.forEach(item => {
      // These fields are derived by validation and invoice generation, not by a draft editor.
      ['ValidationStatus', 'ExclusionReason', 'CustomerInvoiceId'].forEach(controlName =>
        item.get(controlName)?.disable({ emitEvent: false }));
    });
  }

  private loadBillingRunItemOptions(): void {
    const load = (lookupType: string, assign: (options: ISelectItem[]) => void) =>
      this.loggedInUserService.getEntityLookupOptions(lookupType).subscribe({ next: assign, error: error => setTimeout(() => this.messageService?.showError(error)) });
    load('lease-contracts', options => this.leasecontractidOptions = options);
    load('lease-payment-schedule-lines', options => this.leasepaymentschedulelineidOptions = options);
    load('lease-contract-charges', options => this.leasecontractchargeidOptions = options);
    load('customer-invoices', options => this.customerinvoiceidOptions = options);
    this.sourcetypeOptions = this.loggedInUserService.getPicklistOptions('SourceType');
    this.validationstatusOptions = this.loggedInUserService.getPicklistOptions('ValidationStatus');
  }

  validateBillingRun(): void {
    if (!this.isDraft || !this.permission?.CanUpdate || this.isWorkflowActionInProgress) return;

    this.isValidating = true;
    this.spinner.show();
    this.billingRunService.validateBillingRun(this.selectedId).subscribe({
      next: response => {
        this.messageService.showSuccess(response?.Message || response?.message || 'Billing run validated.');
        this.loadUI();
      },
      error: err => {
        this.isValidating = false;
        this.spinner.hide();
        this.messageService.showError(this.getErrorMessage(err));
        this.loadUI();
      },
      complete: () => {
        this.isValidating = false;
        this.spinner.hide();
      }
    });
  }

  approveBillingRun(): void {
    if (!this.isValidated || !this.permission?.CanUpdate || this.isWorkflowActionInProgress) return;

    this.isApproving = true;
    this.spinner.show();
    this.billingRunService.approveBillingRun(this.selectedId).subscribe({
      next: response => {
        this.messageService.showSuccess(response?.Message || response?.message || 'Billing run approved.');
        this.loadUI();
      },
      error: err => {
        this.isApproving = false;
        this.spinner.hide();
        this.messageService.showError(this.getErrorMessage(err));
      },
      complete: () => {
        this.isApproving = false;
        this.spinner.hide();
      }
    });
  }

  confirmExecution(): void {
    if (!this.isApprovedForInvoiceGeneration || !this.permission?.CanUpdate || this.isWorkflowActionInProgress) return;
    this.confirmationService.confirm({
      key: 'billing-run-edit-execution',
      header: 'Generate draft invoices',
      icon: 'pi pi-exclamation-triangle',
      message: 'Generate draft invoices for every valid, uninvoiced item in this approved billing run?',
      acceptLabel: 'Generate invoices',
      rejectLabel: 'Cancel',
      accept: () => this.generateDraftInvoices()
    });
  }

  confirmIssueAllInvoices(): void {
    if (!this.hasGeneratedInvoices || this.draftInvoiceCount <= 0 || !this.permission?.CanUpdate || this.isWorkflowActionInProgress) return;
    const count = this.draftInvoiceCount;
    this.confirmationService.confirm({
      key: 'billing-run-edit-execution',
      header: 'Issue customer invoices',
      icon: 'pi pi-exclamation-triangle',
      message: `Issue ${count} eligible draft customer invoice${count === 1 ? '' : 's'}? Each invoice will be validated and processed independently.`,
      acceptLabel: 'Issue invoices',
      rejectLabel: 'Cancel',
      accept: () => this.issueAllInvoices()
    });
  }

  private issueAllInvoices(): void {
    if (!this.hasGeneratedInvoices || this.draftInvoiceCount <= 0 || !this.permission?.CanUpdate || this.isIssuingInvoices) return;

    this.isIssuingInvoices = true;
    this.invoiceIssueResult = null;
    this.spinner.show();
    this.billingRunService.issueInvoices(this.selectedId).subscribe({
      next: response => {
        this.invoiceIssueResult = response?.data || response;
        const result = this.invoiceIssueResult || {};
        this.messageService.showSuccess(`${result.IssuedCount || 0} invoice(s) issued; ${result.SkippedCount || 0} skipped; ${result.FailedCount || 0} failed.`);
        this.loadUI();
      },
      error: err => this.messageService.showError(this.getErrorMessage(err)),
      complete: () => {
        this.isIssuingInvoices = false;
        this.spinner.hide();
      }
    });
  }

  private generateDraftInvoices(): void {
    if (!this.isApprovedForInvoiceGeneration || !this.permission?.CanUpdate || this.isGeneratingInvoices) return;

    this.isGeneratingInvoices = true;
    this.spinner.show();
    this.billingRunService.generateDraftInvoices(this.selectedId).subscribe({
      next: response => {
        this.messageService.showSuccess(response?.Message || response?.message || 'Draft invoices generated.');
        this.loadUI();
      },
      error: err => {
        this.isGeneratingInvoices = false;
        this.spinner.hide();
        this.messageService.showError(this.getErrorMessage(err));
      },
      complete: () => {
        this.isGeneratingInvoices = false;
        this.spinner.hide();
      }
    });
  }

  viewGeneratedInvoices(): void {
    const contractIds = Array.from(new Set((this.billingRun.BillingRunItems || [])
      .map(item => Number(item.LeaseContractId))
      .filter(contractId => Number.isInteger(contractId) && contractId > 0)));
    const queryParams: any = { billingRunId: this.selectedId };
    if (contractIds.length === 1) queryParams.leaseContractId = contractIds[0];
    this.router.navigate(['/billing-finance/invoices'], { queryParams });
  }

  private loadInvoiceIssuanceSummary(): void {
    const requestId = ++this.invoiceIssuanceSummaryRequest;
    this.draftInvoiceCount = 0;
    this.issuedInvoiceCount = 0;
    this.invoiceIssuanceSummaryError = '';
    if (!this.hasGeneratedInvoices) {
      this.isInvoiceIssuanceSummaryLoading = false;
      return;
    }

    this.isInvoiceIssuanceSummaryLoading = true;
    this.loadInvoiceIssuancePage(requestId, 0, []);
  }

  private loadInvoiceIssuancePage(requestId: number, skip: number, invoices: ICustomerInvoice[]): void {
    this.customerInvoiceService.search({ Skip: skip, Take: 100, SortBy: 'Id', IsDescending: false, BillingRunId: this.selectedId, Conditions: [] })
      .subscribe({
        next: response => {
          if (requestId !== this.invoiceIssuanceSummaryRequest) return;
          const page = response?.data?.Records || [];
          const allInvoices = invoices.concat(page);
          const total = Number(response?.data?.TotalRecords || 0);
          if (page.length > 0 && allInvoices.length < total) {
            this.loadInvoiceIssuancePage(requestId, allInvoices.length, allInvoices);
            return;
          }
          this.issuedInvoiceCount = allInvoices.filter(invoice => !!invoice.IsIssued || !!invoice.IssuedAtUtc).length;
          this.draftInvoiceCount = allInvoices.length - this.issuedInvoiceCount;
          this.isInvoiceIssuanceSummaryLoading = false;
        },
        error: error => {
          if (requestId !== this.invoiceIssuanceSummaryRequest) return;
          this.invoiceIssuanceSummaryError = this.getErrorMessage(error);
          this.isInvoiceIssuanceSummaryLoading = false;
        }
      });
  }

  private validationStatus(item: IBillingRunItem): string {
    return String(item?.ValidationStatus || '').trim().toUpperCase();
  }

  private getErrorMessage(error: any): string {
    if (typeof error === 'string' && error.trim()) return error;
    const payload = error?.error || error;
    const errors = payload?.Errors || payload?.errors;
    if (Array.isArray(errors) && errors.length > 0) return errors.join(' ');
    return payload?.ErrorMessage || payload?.message || payload?.Message || 'The billing-run action could not be completed.';
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/billing/runs/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.billingRun = { ...this.objMaster };
	var obj  = this.billingRun;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
BillingDate:  obj.BillingDate || null,
PeriodFrom:  obj.PeriodFrom || null,
PeriodTo:  obj.PeriodTo || null,
BillingRunStatusId: obj.BillingRunStatusId || 0,
RunType: obj.RunType || '',
CandidateCount: obj.CandidateCount || 0,
InvoiceCount: obj.InvoiceCount || 0,
TotalAmount: obj.TotalAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAtUtc:  obj.ApprovedAtUtc || null,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
    this.setBillingRunItems(this.objMaster.BillingRunItems || []);
    this.applyWorkflowEditability();
   
  }



  Save(): void {
        if (!this.isDraft) {
            this.messageService.showError('Validated and approved billing runs are read-only. Use the workflow actions on the details page.');
            return;
        }
  
        if (!this.editForm.valid || this.billingRunItems.length === 0) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }
	
     const formValues = this.editForm.getRawValue(); 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     BillingOrganisationId:  formValues.BillingOrganisationId || 0,
BillingDate:  formValues.BillingDate || null,
PeriodFrom:  formValues.PeriodFrom || null,
PeriodTo:  formValues.PeriodTo || null,
BillingRunStatusId:  formValues.BillingRunStatusId || 0,
RunType:  formValues.RunType || null,
CandidateCount:  formValues.CandidateCount || 0,
InvoiceCount:  formValues.InvoiceCount || 0,
TotalAmount:  formValues.TotalAmount || 0,
CurrencyCode:  formValues.CurrencyCode || null,
ApprovedByUserId:  formValues.ApprovedByUserId || 0,
ApprovedAtUtc:  formValues.ApprovedAtUtc || null,
RecordStatus:  formValues.RecordStatus || null,
BillingRunItems: this.billingRunItems.getRawValue().map((item: any) => ({ ...item, BillingRunId: this.billingRun.Id, TenantId: this.loggedInUserService.loggedInUser.Tenant.Id })),

    } as IBillingRun ;
	
	this.spinner.show();  	   
    this.billingRunService.update(this.billingRun.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(BillingRun +  'Details Updated sucessfully.');
		//this.editForm.reset();
		this._location.back();
      },
      error: err => { 
       this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide();}
    });
  }
}
