import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IReceivable } from './receivable';
import { ReceivableService } from './receivable.service';

@Component({
  selector: 'app-receivable-create',
  standalone: false,
  templateUrl: './receivable-create.component.html' ,
   providers: [ MessageService]
})
export class ReceivableCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  receivable: IReceivable = null;
  billingorganisationidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
sourcedocumenttypeOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
receivablestatusOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IReceivable = {} as IReceivable;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private receivableService: ReceivableService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.receivable };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
BillingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SourceDocumentType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SourceDocumentId: new FormControl(0, [Validators.required, ]),
LeaseContractId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
DocumentDate: new FormControl(new Date(), [Validators.required]),
DueDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OriginalAmount: new FormControl(0, [Validators.required]),
AllocatedAmount: new FormControl(0, [Validators.required]),
CreditAppliedAmount: new FormControl(0, [Validators.required]),
WriteOffAmount: new FormControl(0, [Validators.required]),
OutstandingAmount: new FormControl(0, [Validators.required]),
ReceivableStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DisputeHoldFlag: new FormControl(false, [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create Receivable';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'BillingOrganisationId', 'organisations',
      options => this.billingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerPartyId', 'parties',
      options => this.customerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.sourcedocumenttypeOptions = this.loggedInUserService.getPicklistOptions('SourceDocumentType');
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"CustomerPartyId":"CustomerPartyId"});
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.receivablestatusOptions = this.loggedInUserService.getPicklistOptions('ReceivableStatus');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.receivableService.getById(this.selectedId).subscribe({
      next: data => {
        this.receivable = data;
        this.objMaster = { ...this.receivable };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IReceivable): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
SourceDocumentType: obj.SourceDocumentType || '',
SourceDocumentId: obj.SourceDocumentId || 0,
LeaseContractId: obj.LeaseContractId || 0,
DocumentNo: obj.DocumentNo || '',
DocumentDate:  obj.DocumentDate || new Date(),
DueDate:  obj.DueDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
OriginalAmount: obj.OriginalAmount || 0,
AllocatedAmount: obj.AllocatedAmount || 0,
CreditAppliedAmount: obj.CreditAppliedAmount || 0,
WriteOffAmount: obj.WriteOffAmount || 0,
OutstandingAmount: obj.OutstandingAmount || 0,
ReceivableStatus: obj.ReceivableStatus || '',
DisputeHoldFlag:  obj.DisputeHoldFlag || false,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/receivables/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }
    else if (key == "Refresh") {
      this.loadUI();
    }
  }

  onCancel(): void {
    this.receivable = { ...this.objMaster };
    var obj  = this.receivable;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
SourceDocumentType: obj.SourceDocumentType || '',
SourceDocumentId: obj.SourceDocumentId || 0,
LeaseContractId: obj.LeaseContractId || 0,
DocumentNo: obj.DocumentNo || '',
DocumentDate:  obj.DocumentDate || new Date(),
DueDate:  obj.DueDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
OriginalAmount: obj.OriginalAmount || 0,
AllocatedAmount: obj.AllocatedAmount || 0,
CreditAppliedAmount: obj.CreditAppliedAmount || 0,
WriteOffAmount: obj.WriteOffAmount || 0,
OutstandingAmount: obj.OutstandingAmount || 0,
ReceivableStatus: obj.ReceivableStatus || '',
DisputeHoldFlag:  obj.DisputeHoldFlag || false,
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
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     BillingOrganisationId: formValues.BillingOrganisationId || 0,
CustomerPartyId: formValues.CustomerPartyId || 0,
SourceDocumentType: formValues.SourceDocumentType || null,
SourceDocumentId: formValues.SourceDocumentId || null,
LeaseContractId: formValues.LeaseContractId || 0,
DocumentNo: formValues.DocumentNo || null,
DocumentDate: formValues.DocumentDate || null,
DueDate: formValues.DueDate || null,
CurrencyCode: formValues.CurrencyCode || null,
OriginalAmount: formValues.OriginalAmount || 0,
AllocatedAmount: formValues.AllocatedAmount || 0,
CreditAppliedAmount: formValues.CreditAppliedAmount || 0,
WriteOffAmount: formValues.WriteOffAmount || 0,
OutstandingAmount: formValues.OutstandingAmount || 0,
ReceivableStatus: formValues.ReceivableStatus || null,
DisputeHoldFlag: formValues.DisputeHoldFlag || false,
RecordStatus: formValues.RecordStatus || null,

    } as IReceivable ; 
	
	  this.spinner.show(); 
    this.receivableService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(Receivable +  'Details Updated sucessfully.');
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



