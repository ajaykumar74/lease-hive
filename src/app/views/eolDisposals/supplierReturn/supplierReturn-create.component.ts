import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
recordstatusOptions: ISelectItem[] = [];

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
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create SupplierReturn';
    this.disposalcaseidOptions.push({Text: 'DisposalCaseId1', Value: 'DisposalCaseId1' });
this.disposalcaseidOptions.push({Text: 'DisposalCaseId2', Value: 'DisposalCaseId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.supplierpartyidOptions.push({Text: 'SupplierPartyId1', Value: 'SupplierPartyId1' });
this.supplierpartyidOptions.push({Text: 'SupplierPartyId2', Value: 'SupplierPartyId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.statuscodeOptions.push({Text: 'PLANNED', Value: 'PLANNED' });
this.statuscodeOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.statuscodeOptions.push({Text: 'DISPATCHED', Value: 'DISPATCHED' });
this.statuscodeOptions.push({Text: 'ACCEPTED', Value: 'ACCEPTED' });
this.statuscodeOptions.push({Text: 'CLOSED', Value: 'CLOSED' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

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
RecordStatus: obj.RecordStatus || '',
 
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
     DisposalCaseId: formValues.DisposalCaseId || 0,
AssetId: formValues.AssetId || 0,
SupplierPartyId: formValues.SupplierPartyId || 0,
ReturnDate: formValues.ReturnDate || null,
ReturnReference: formValues.ReturnReference || null,
CreditExpectedAmount: formValues.CreditExpectedAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
StatusCode: formValues.StatusCode || null,
Remarks: formValues.Remarks || null,
RecordStatus: formValues.RecordStatus || null,

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



