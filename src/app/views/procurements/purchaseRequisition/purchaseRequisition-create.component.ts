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
import { IPurchaseRequisition } from './purchaseRequisition';
import { PurchaseRequisitionService } from './purchaseRequisition.service';

@Component({
  selector: 'app-purchaseRequisition-create',
  standalone: false,
  templateUrl: './purchaseRequisition-create.component.html' ,
   providers: [ MessageService]
})
export class PurchaseRequisitionCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  purchaseRequisition: IPurchaseRequisition = null;
  buyingorganisationidOptions: ISelectItem[] = [];
requestingorganisationunitidOptions: ISelectItem[] = [];
requestedbyuseridOptions: ISelectItem[] = [];
purchaserequisitionstatusidOptions: ISelectItem[] = [];
sourcereferencetypeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IPurchaseRequisition = {} as IPurchaseRequisition;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private purchaseRequisitionService: PurchaseRequisitionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.purchaseRequisition };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PRNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
BuyingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RequestingOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RequestedByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PurchaseRequisitionStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RequisitionDate: new FormControl(new Date(), [Validators.required]),
RequiredByDate: new FormControl(new Date(), []),
SourceReferenceType: new FormControl('', [Validators.maxLength(30), ]), 
SourceReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
EstimatedTotal: new FormControl(0, []),
Justification: new FormControl('', [Validators.maxLength(250), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create PurchaseRequisition';
    this.buyingorganisationidOptions.push({Text: 'BuyingOrganisationId1', Value: 'BuyingOrganisationId1' });
this.buyingorganisationidOptions.push({Text: 'BuyingOrganisationId2', Value: 'BuyingOrganisationId2' });
this.requestingorganisationunitidOptions.push({Text: 'RequestingOrganisationUnitId1', Value: 'RequestingOrganisationUnitId1' });
this.requestingorganisationunitidOptions.push({Text: 'RequestingOrganisationUnitId2', Value: 'RequestingOrganisationUnitId2' });
this.requestedbyuseridOptions.push({Text: 'RequestedByUserId1', Value: 'RequestedByUserId1' });
this.requestedbyuseridOptions.push({Text: 'RequestedByUserId2', Value: 'RequestedByUserId2' });
this.purchaserequisitionstatusidOptions.push({Text: 'PurchaseRequisitionStatusId1', Value: 'PurchaseRequisitionStatusId1' });
this.purchaserequisitionstatusidOptions.push({Text: 'PurchaseRequisitionStatusId2', Value: 'PurchaseRequisitionStatusId2' });
this.sourcereferencetypeOptions.push({Text: 'STOCK', Value: 'STOCK' });
this.sourcereferencetypeOptions.push({Text: 'QUOTE', Value: 'QUOTE' });
this.sourcereferencetypeOptions.push({Text: 'CONTRACT', Value: 'CONTRACT' });
this.sourcereferencetypeOptions.push({Text: 'PROJECT', Value: 'PROJECT' });
this.sourcereferencetypeOptions.push({Text: 'MANUAL', Value: 'MANUAL' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.purchaseRequisitionService.getById(this.selectedId).subscribe({
      next: data => {
        this.purchaseRequisition = data;
        this.objMaster = { ...this.purchaseRequisition };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IPurchaseRequisition): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PRNo: obj.PRNo || '',
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
RequestingOrganisationUnitId: obj.RequestingOrganisationUnitId || 0,
RequestedByUserId: obj.RequestedByUserId || 0,
PurchaseRequisitionStatusId: obj.PurchaseRequisitionStatusId || 0,
RequisitionDate:  obj.RequisitionDate || new Date(),
RequiredByDate:  obj.RequiredByDate || new Date(),
SourceReferenceType: obj.SourceReferenceType || '',
SourceReferenceId: obj.SourceReferenceId || 0,
CurrencyCode: obj.CurrencyCode || '',
EstimatedTotal: obj.EstimatedTotal || 0,
Justification: obj.Justification || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/purchaseRequisitions/create']);
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
    this.purchaseRequisition = { ...this.objMaster };
    var obj  = this.purchaseRequisition;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PRNo: obj.PRNo || '',
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
RequestingOrganisationUnitId: obj.RequestingOrganisationUnitId || 0,
RequestedByUserId: obj.RequestedByUserId || 0,
PurchaseRequisitionStatusId: obj.PurchaseRequisitionStatusId || 0,
RequisitionDate:  obj.RequisitionDate || new Date(),
RequiredByDate:  obj.RequiredByDate || new Date(),
SourceReferenceType: obj.SourceReferenceType || '',
SourceReferenceId: obj.SourceReferenceId || 0,
CurrencyCode: obj.CurrencyCode || '',
EstimatedTotal: obj.EstimatedTotal || 0,
Justification: obj.Justification || '',
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
     PRNo: formValues.PRNo || null,
BuyingOrganisationId: formValues.BuyingOrganisationId || 0,
RequestingOrganisationUnitId: formValues.RequestingOrganisationUnitId || 0,
RequestedByUserId: formValues.RequestedByUserId || 0,
PurchaseRequisitionStatusId: formValues.PurchaseRequisitionStatusId || 0,
RequisitionDate: formValues.RequisitionDate || null,
RequiredByDate: formValues.RequiredByDate || null,
SourceReferenceType: formValues.SourceReferenceType || null,
SourceReferenceId: formValues.SourceReferenceId || 0,
CurrencyCode: formValues.CurrencyCode || null,
EstimatedTotal: formValues.EstimatedTotal || 0,
Justification: formValues.Justification || null,
RecordStatus: formValues.RecordStatus || null,

    } as IPurchaseRequisition ; 
	
	  this.spinner.show(); 
    this.purchaseRequisitionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PurchaseRequisition +  'Details Updated sucessfully.');
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



