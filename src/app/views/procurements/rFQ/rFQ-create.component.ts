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
import { IRFQ } from './rFQ';
import { RFQService } from './rFQ.service';

@Component({
  selector: 'app-rFQ-create',
  standalone: false,
  templateUrl: './rFQ-create.component.html' ,
   providers: [ MessageService]
})
export class RFQCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  rFQ: IRFQ = null;
  purchaserequisitionidOptions: ISelectItem[] = [];
buyingorganisationidOptions: ISelectItem[] = [];
rfqstatuscodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IRFQ = {} as IRFQ;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private rFQService: RFQService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.rFQ };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
RFQNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
PurchaseRequisitionId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
BuyingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RFQStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IssueDateTime: new FormControl(new Date(), []),
ResponseDueDateTime: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
CommercialTerms: new FormControl('', [Validators.maxLength(2000), ]), 

    });
    this.Caption = 'Create RFQ';
    this.purchaserequisitionidOptions.push({Text: 'PurchaseRequisitionId1', Value: 'PurchaseRequisitionId1' });
this.purchaserequisitionidOptions.push({Text: 'PurchaseRequisitionId2', Value: 'PurchaseRequisitionId2' });
this.buyingorganisationidOptions.push({Text: 'BuyingOrganisationId1', Value: 'BuyingOrganisationId1' });
this.buyingorganisationidOptions.push({Text: 'BuyingOrganisationId2', Value: 'BuyingOrganisationId2' });
this.rfqstatuscodeOptions = this.loggedInUserService.getPicklistOptions('RFQStatusCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.rFQService.getById(this.selectedId).subscribe({
      next: data => {
        this.rFQ = data;
        this.objMaster = { ...this.rFQ };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IRFQ): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQNo: obj.RFQNo || '',
PurchaseRequisitionId: obj.PurchaseRequisitionId || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
RFQStatusCode: obj.RFQStatusCode || '',
IssueDateTime:  obj.IssueDateTime || new Date(),
ResponseDueDateTime:  obj.ResponseDueDateTime || new Date(),
CurrencyCode: obj.CurrencyCode || '',
CommercialTerms: obj.CommercialTerms || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/rfqs/create']);
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
    this.rFQ = { ...this.objMaster };
    var obj  = this.rFQ;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQNo: obj.RFQNo || '',
PurchaseRequisitionId: obj.PurchaseRequisitionId || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
RFQStatusCode: obj.RFQStatusCode || '',
IssueDateTime:  obj.IssueDateTime || new Date(),
ResponseDueDateTime:  obj.ResponseDueDateTime || new Date(),
CurrencyCode: obj.CurrencyCode || '',
CommercialTerms: obj.CommercialTerms || '',
 
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
     RFQNo: formValues.RFQNo || null,
PurchaseRequisitionId: formValues.PurchaseRequisitionId || 0,
BuyingOrganisationId: formValues.BuyingOrganisationId || 0,
RFQStatusCode: formValues.RFQStatusCode || null,
IssueDateTime: formValues.IssueDateTime || null,
ResponseDueDateTime: formValues.ResponseDueDateTime || null,
CurrencyCode: formValues.CurrencyCode || null,
CommercialTerms: formValues.CommercialTerms || null,
RecordStatus: 'Active',
    } as IRFQ ; 
	
	  this.spinner.show(); 
    this.rFQService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(RFQ +  'Details Updated sucessfully.');
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



