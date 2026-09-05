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
import { ISupplierReturn } from './supplierReturn';
import { SupplierReturnService } from './supplierReturn.service';

@Component({
  selector: 'app-supplierReturn-create',
  standalone: false,
  templateUrl: './supplierReturn-create.component.html' ,
   providers: [ MessageService]
})
export class SupplierReturnCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supplierReturn: ISupplierReturn = null;
  disposalcaseidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
supplierpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ISupplierReturn = {} as ISupplierReturn;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private supplierReturnService: SupplierReturnService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.supplierReturn };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
DisposalCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReturnDate: new FormControl(new Date(), [Validators.required]),
ReturnReference: new FormControl('', [Validators.maxLength(50), ]), 
CreditExpectedAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 

    });
    this.Caption = 'Create SupplierReturn';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'DisposalCaseId', 'disposal-cases',
      options => this.disposalcaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierPartyId', 'parties',
      options => this.supplierpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('SupplierReturnStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.supplierReturnService.getById(this.selectedId).subscribe({
      next: data => {
        this.supplierReturn = data;
        this.objMaster = { ...this.supplierReturn };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ISupplierReturn): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetId: obj.AssetId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
ReturnDate:  obj.ReturnDate || new Date(),
ReturnReference: obj.ReturnReference || '',
CreditExpectedAmount: obj.CreditExpectedAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
StatusCode: obj.StatusCode || '',
Remarks: obj.Remarks || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/supplierReturns/create']);
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
    this.supplierReturn = { ...this.objMaster };
    var obj  = this.supplierReturn;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetId: obj.AssetId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
ReturnDate:  obj.ReturnDate || new Date(),
ReturnReference: obj.ReturnReference || '',
CreditExpectedAmount: obj.CreditExpectedAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
StatusCode: obj.StatusCode || '',
Remarks: obj.Remarks || '',
 
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
     DisposalCaseId: formValues.DisposalCaseId || 0,
AssetId: formValues.AssetId || 0,
SupplierPartyId: formValues.SupplierPartyId || 0,
ReturnDate: formValues.ReturnDate || null,
ReturnReference: formValues.ReturnReference || null,
CreditExpectedAmount: formValues.CreditExpectedAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
StatusCode: formValues.StatusCode || null,
Remarks: formValues.Remarks || null,
RecordStatus: 'Active',

    } as ISupplierReturn ; 
	
	  this.spinner.show(); 
    this.supplierReturnService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(SupplierReturn +  'Details Updated sucessfully.');
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



