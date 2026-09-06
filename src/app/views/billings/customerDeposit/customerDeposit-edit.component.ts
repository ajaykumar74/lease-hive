import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ICustomerDeposit } from './customerDeposit';
import { CustomerDepositService } from './customerDeposit.service';


@Component({
  selector: 'app-customerDeposit-edit',
  standalone: false,
  templateUrl: './customerDeposit-edit.component.html',
  providers: [MessageService]
})
export class CustomerDepositEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  customerDeposit: ICustomerDeposit = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasecontractidOptions: ISelectItem[] = [];
  leasecontractdepositidOptions: ISelectItem[] = [];
  customerpartyidOptions: ISelectItem[] = [];
  billingorganisationidOptions: ISelectItem[] = [];
  deposittypecodeOptions: ISelectItem[] = [];
  currencycodeOptions: ISelectItem[] = [];
  depositstatusOptions: ISelectItem[] = [];
  recordstatusOptions: ISelectItem[] = [];

  editForm: any;
  objMaster: ICustomerDeposit = {} as ICustomerDeposit;


  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private customerDepositService: CustomerDepositService,
    private loggedInUserService: LoggedInUserService
  ) {
  }

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;



  ngOnInit(): void {
    this.objMaster = { ...this.customerDeposit };

    this.editForm = this.fb.group({
      Id: new FormControl(0, [Validators.required]),
      LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
      LeaseContractDepositId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      CustomerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
      BillingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
      DepositTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      RequiredAmount: new FormControl(0, [Validators.required]),
      ReceivedAmount: new FormControl(0, [Validators.required]),
      UtilizedAmount: new FormControl(0, [Validators.required]),
      RefundedAmount: new FormControl(0, [Validators.required]),
      ForfeitedAmount: new FormControl(0, [Validators.required]),
      AvailableBalance: new FormControl(0, [Validators.required]),
      DepositStatus: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20),]),

    });

    this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, { "CustomerPartyId": "CustomerPartyId" });
    this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractDepositId', 'lease-contract-deposits',
      options => this.leasecontractdepositidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, { "LeaseContractId": "LeaseContractId" });
    this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerPartyId', 'parties',
      options => this.customerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
    this.loggedInUserService.bindEntityLookup(this.editForm, 'BillingOrganisationId', 'organisations',
      options => this.billingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
    this.deposittypecodeOptions = this.loggedInUserService.getPicklistOptions('DepositTypeCode');
    this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
    this.depositstatusOptions = this.loggedInUserService.getPicklistOptions('DepositStatus');
    this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

    this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500);
  }


  loadUI(): void {
    this.isLoading = true;
    this.customerDepositService.getById(this.selectedId).subscribe({
      next: data => {
        this.customerDeposit = data.data;
        this.permission = data.permission;
        this.objMaster = { ...this.customerDeposit };
        this.populateUI(this.customerDeposit);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }

  populateUI(obj: ICustomerDeposit): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        LeaseContractId: obj.LeaseContractId || 0,
        LeaseContractDepositId: obj.LeaseContractDepositId || 0,
        CustomerPartyId: obj.CustomerPartyId || 0,
        BillingOrganisationId: obj.BillingOrganisationId || 0,
        DepositTypeCode: obj.DepositTypeCode || '',
        CurrencyCode: obj.CurrencyCode || '',
        RequiredAmount: obj.RequiredAmount || 0,
        ReceivedAmount: obj.ReceivedAmount || 0,
        UtilizedAmount: obj.UtilizedAmount || 0,
        RefundedAmount: obj.RefundedAmount || 0,
        ForfeitedAmount: obj.ForfeitedAmount || 0,
        AvailableBalance: obj.AvailableBalance || 0,
        DepositStatus: obj.DepositStatus || '',
        RecordStatus: obj.RecordStatus || '',

      }
    );

    this.Caption = "CustomerDeposit Details #" + obj.Id;
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/deposits/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.customerDeposit = { ...this.objMaster };
    var obj = this.customerDeposit;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        LeaseContractId: obj.LeaseContractId || 0,
        LeaseContractDepositId: obj.LeaseContractDepositId || 0,
        CustomerPartyId: obj.CustomerPartyId || 0,
        BillingOrganisationId: obj.BillingOrganisationId || 0,
        DepositTypeCode: obj.DepositTypeCode || '',
        CurrencyCode: obj.CurrencyCode || '',
        RequiredAmount: obj.RequiredAmount || 0,
        ReceivedAmount: obj.ReceivedAmount || 0,
        UtilizedAmount: obj.UtilizedAmount || 0,
        RefundedAmount: obj.RefundedAmount || 0,
        ForfeitedAmount: obj.ForfeitedAmount || 0,
        AvailableBalance: obj.AvailableBalance || 0,
        DepositStatus: obj.DepositStatus || '',
        RecordStatus: obj.RecordStatus || '',

      }
    );

    this.editForm.reset();
  }



  Save(): void {

    if (!this.editForm.valid) {
      this.messageService.showError('One or more validation failed. Please clear error to continue...');
      return;
    }

    const formValues = this.editForm.value;
    var updatedObj = {
      Id: this.objMaster.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      LeaseContractId: formValues.LeaseContractId || 0,
      LeaseContractDepositId: formValues.LeaseContractDepositId || 0,
      CustomerPartyId: formValues.CustomerPartyId || 0,
      BillingOrganisationId: formValues.BillingOrganisationId || 0,
      DepositTypeCode: formValues.DepositTypeCode || null,
      CurrencyCode: formValues.CurrencyCode || null,
      RequiredAmount: formValues.RequiredAmount || 0,
      ReceivedAmount: formValues.ReceivedAmount || 0,
      UtilizedAmount: formValues.UtilizedAmount || 0,
      RefundedAmount: formValues.RefundedAmount || 0,
      ForfeitedAmount: formValues.ForfeitedAmount || 0,
      AvailableBalance: formValues.AvailableBalance || 0,
      DepositStatus: formValues.DepositStatus || null,
      RecordStatus: formValues.RecordStatus || null,

    } as ICustomerDeposit;

    this.spinner.show();
    this.customerDepositService.update(this.customerDeposit.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(CustomerDeposit +  'Details Updated sucessfully.');
        //this.editForm.reset();
        this._location.back();
      },
      error: err => {
        this.messageService.showError(err);
        this.spinner.hide();
      },
      complete: () => { this.spinner.hide(); }
    });
  }
}
