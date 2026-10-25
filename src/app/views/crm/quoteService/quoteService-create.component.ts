import { Component, DestroyRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IQuoteService } from './quoteService';
import { QuoteServiceService } from './quoteService.service';

@Component({
  selector: 'app-quoteService-create',
  standalone: false,
  templateUrl: './quoteService-create.component.html' ,
   providers: [ MessageService]
})
export class QuoteServiceCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  quoteService: IQuoteService = null;
  quoteidOptions: ISelectItem[] = [];
quoteassetidOptions: ISelectItem[] = [];
leaseserviceidOptions: ISelectItem[] = [];
chargefrequencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IQuoteService = {} as IQuoteService;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private quoteServiceService: QuoteServiceService,
	private loggedInUserService : LoggedInUserService,
    private destroyRef: DestroyRef
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.quoteService };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
QuoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
QuoteAssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseServiceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
IsIncluded: new FormControl(false, [Validators.required]),
IsSeparatelyChargeable: new FormControl(false, [Validators.required]),
ChargeFrequencyCode: new FormControl('', [Validators.maxLength(20), ]), 
UnitAmount: new FormControl(0, []),
Quantity: new FormControl(0, [Validators.required]),
ServiceTerms: new FormControl('', [Validators.maxLength(1000), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create QuoteService';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'QuoteId', 'quotes', options => this.quoteidOptions = options, error => this.messageService?.showError(error), this.destroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'QuoteAssetId', 'quote-assets', options => this.quoteassetidOptions = options, error => this.messageService?.showError(error), this.destroyRef, { QuoteId: 'QuoteId' });
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseServiceId', 'lease-services', options => this.leaseserviceidOptions = options, error => this.messageService?.showError(error), this.destroyRef);
this.chargefrequencycodeOptions = this.loggedInUserService.getPicklistOptions('ChargeFrequencyCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.quoteServiceService.getById(this.selectedId).subscribe({
      next: data => {
        this.quoteService = data;
        this.objMaster = { ...this.quoteService };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IQuoteService): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  QuoteId: obj.QuoteId || 0,
QuoteAssetId: obj.QuoteAssetId || 0,
LeaseServiceId: obj.LeaseServiceId || 0,
IsIncluded:  obj.IsIncluded || false,
IsSeparatelyChargeable:  obj.IsSeparatelyChargeable || false,
ChargeFrequencyCode: obj.ChargeFrequencyCode || '',
UnitAmount: obj.UnitAmount || 0,
Quantity: obj.Quantity || 0,
ServiceTerms: obj.ServiceTerms || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/origination/quotes/services/create']);
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
    this.quoteService = { ...this.objMaster };
    var obj  = this.quoteService;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  QuoteId: obj.QuoteId || 0,
QuoteAssetId: obj.QuoteAssetId || 0,
LeaseServiceId: obj.LeaseServiceId || 0,
IsIncluded:  obj.IsIncluded || false,
IsSeparatelyChargeable:  obj.IsSeparatelyChargeable || false,
ChargeFrequencyCode: obj.ChargeFrequencyCode || '',
UnitAmount: obj.UnitAmount || 0,
Quantity: obj.Quantity || 0,
ServiceTerms: obj.ServiceTerms || '',
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
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     QuoteId: formValues.QuoteId || 0,
QuoteAssetId: formValues.QuoteAssetId || 0,
LeaseServiceId: formValues.LeaseServiceId || 0,
IsIncluded: formValues.IsIncluded || false,
IsSeparatelyChargeable: formValues.IsSeparatelyChargeable || false,
ChargeFrequencyCode: formValues.ChargeFrequencyCode || null,
UnitAmount: formValues.UnitAmount || 0,
Quantity: formValues.Quantity || 0,
ServiceTerms: formValues.ServiceTerms || null,
RecordStatus: formValues.RecordStatus || null,

    } as IQuoteService ; 
	
	  this.spinner.show(); 
    this.quoteServiceService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(QuoteService +  'Details Updated sucessfully.');
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



