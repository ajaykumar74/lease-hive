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
import { ISupplierAward } from './supplierAward';
import { SupplierAwardService } from './supplierAward.service';

@Component({
  selector: 'app-supplierAward-create',
  standalone: false,
  templateUrl: './supplierAward-create.component.html' ,
   providers: [ MessageService]
})
export class SupplierAwardCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supplierAward: ISupplierAward = null;
  rfqidOptions: ISelectItem[] = [];
supplierquotationidOptions: ISelectItem[] = [];
supplierpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
approvalrequestidOptions: ISelectItem[] = [];
awardedbyOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ISupplierAward = {} as ISupplierAward;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private supplierAwardService: SupplierAwardService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.supplierAward };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
RFQId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierQuotationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AwardDateTime: new FormControl(new Date(), [Validators.required]),
AwardAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SelectionReason: new FormControl('', [Validators.maxLength(100), ]), 
ApprovalRequestId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AwardedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create SupplierAward';
this.loggedInUserService.bindEntityLookup(this.editForm, 'ApprovalRequestId', 'approval-requests',
      options => this.approvalrequestidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AwardedBy', 'application-users',
      options => this.awardedbyOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'RFQId', 'rfqs',
      options => this.rfqidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierPartyId', 'parties',
      options => this.supplierpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierQuotationId', 'supplier-quotations',
      options => this.supplierquotationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.supplierAwardService.getById(this.selectedId).subscribe({
      next: data => {
        this.supplierAward = data;
        this.objMaster = { ...this.supplierAward };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ISupplierAward): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQId: obj.RFQId || 0,
SupplierQuotationId: obj.SupplierQuotationId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
AwardDateTime:  obj.AwardDateTime || new Date(),
AwardAmount: obj.AwardAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
SelectionReason: obj.SelectionReason || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
AwardedBy: obj.AwardedBy || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/awards/create']);
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
    this.supplierAward = { ...this.objMaster };
    var obj  = this.supplierAward;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQId: obj.RFQId || 0,
SupplierQuotationId: obj.SupplierQuotationId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
AwardDateTime:  obj.AwardDateTime || new Date(),
AwardAmount: obj.AwardAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
SelectionReason: obj.SelectionReason || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
AwardedBy: obj.AwardedBy || 0,
 
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
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     RFQId: formValues.RFQId || 0,
SupplierQuotationId: formValues.SupplierQuotationId || 0,
SupplierPartyId: formValues.SupplierPartyId || 0,
AwardDateTime: formValues.AwardDateTime || null,
TechnicalScore: formValues.TechnicalScore || 0,
CommercialScore: formValues.CommercialScore || 0,
AwardAmount: formValues.AwardAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
SelectionReason: formValues.SelectionReason || null,
ApprovalRequestId: formValues.ApprovalRequestId || 0,
AwardedBy: formValues.AwardedBy || 0,

    } as ISupplierAward ; 
	
	  this.spinner.show(); 
    this.supplierAwardService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(SupplierAward +  'Details Updated sucessfully.');
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



