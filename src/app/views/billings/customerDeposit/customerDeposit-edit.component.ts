import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  providers: [ MessageService]
})
export class CustomerDepositEditComponent implements OnInit {

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
  objMaster : ICustomerDeposit = {} as ICustomerDeposit;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private customerDepositService: CustomerDepositService, 
	private loggedInUserService : LoggedInUserService
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
DepositTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RequiredAmount: new FormControl(0, [Validators.required]),
ReceivedAmount: new FormControl(0, [Validators.required]),
UtilizedAmount: new FormControl(0, [Validators.required]),
RefundedAmount: new FormControl(0, [Validators.required]),
ForfeitedAmount: new FormControl(0, [Validators.required]),
AvailableBalance: new FormControl(0, [Validators.required]),
DepositStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.leasecontractdepositidOptions.push({Text: 'LeaseContractDepositId1', Value: 'LeaseContractDepositId1' });
this.leasecontractdepositidOptions.push({Text: 'LeaseContractDepositId2', Value: 'LeaseContractDepositId2' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId1', Value: 'CustomerPartyId1' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId2', Value: 'CustomerPartyId2' });
this.billingorganisationidOptions.push({Text: 'BillingOrganisationId1', Value: 'BillingOrganisationId1' });
this.billingorganisationidOptions.push({Text: 'BillingOrganisationId2', Value: 'BillingOrganisationId2' });
this.deposittypecodeOptions.push({Text: 'SECURITY', Value: 'SECURITY' });
this.deposittypecodeOptions.push({Text: 'ADVANCE', Value: 'ADVANCE' });
this.deposittypecodeOptions.push({Text: 'OTHER', Value: 'OTHER' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.depositstatusOptions.push({Text: 'PENDING', Value: 'PENDING' });
this.depositstatusOptions.push({Text: 'HELD', Value: 'HELD' });
this.depositstatusOptions.push({Text: 'PART_USED', Value: 'PART_USED' });
this.depositstatusOptions.push({Text: 'REFUNDED', Value: 'REFUNDED' });
this.depositstatusOptions.push({Text: 'CLOSED', Value: 'CLOSED' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

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
      this.router.navigate(['/customerDeposit/create', { id: -1 }]);
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
	var obj  = this.customerDeposit;
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
      RowVersionStr : this.objMaster.RowVersionStr,
     LeaseContractId:  formValues.LeaseContractId || null,
LeaseContractDepositId:  formValues.LeaseContractDepositId || null,
CustomerPartyId:  formValues.CustomerPartyId || null,
BillingOrganisationId:  formValues.BillingOrganisationId || null,
DepositTypeCode:  formValues.DepositTypeCode || null,
CurrencyCode:  formValues.CurrencyCode || null,
RequiredAmount:  formValues.RequiredAmount || null,
ReceivedAmount:  formValues.ReceivedAmount || null,
UtilizedAmount:  formValues.UtilizedAmount || null,
RefundedAmount:  formValues.RefundedAmount || null,
ForfeitedAmount:  formValues.ForfeitedAmount || null,
AvailableBalance:  formValues.AvailableBalance || null,
DepositStatus:  formValues.DepositStatus || null,
RecordStatus:  formValues.RecordStatus || null,

    } as ICustomerDeposit ;
	
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
      complete: () => { this.spinner.hide();}
    });
  }
}
