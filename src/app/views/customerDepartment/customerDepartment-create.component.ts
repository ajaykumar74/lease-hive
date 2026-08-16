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
import { ICustomerDepartment } from './customerDepartment';
import { CustomerDepartmentService } from './customerDepartment.service';

@Component({
  selector: 'app-customerDepartment-create',
  standalone: false,
  templateUrl: './customerDepartment-create.component.html' ,
   providers: [ MessageService]
})
export class CustomerDepartmentCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Customer Department';
  customerDepartment: ICustomerDepartment = null;
  partyidOptions: ISelectItem[] = [];
customerprofileidOptions: ISelectItem[] = [];
partylocationidOptions: ISelectItem[] = [];
parentcustomerdepartmentidOptions: ISelectItem[] = [];
costcentrecodeOptions: ISelectItem[] = [];
departmentheadcontactidOptions: ISelectItem[] = [];
billingreferenceOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ICustomerDepartment = {} as ICustomerDepartment;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private customerDepartmentService: CustomerDepartmentService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.customerDepartment };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerProfileId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ParentCustomerDepartmentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DepartmentCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DepartmentName: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
CostCentreCode: new FormControl('', [Validators.maxLength(30), ]), 
DepartmentHeadContactId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
BillingReference: new FormControl('', [Validators.maxLength(20), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    this.loggedInUserService.getPartyOptions().subscribe({
      next: options => this.partyidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
this.costcentrecodeOptions.push({Text: 'CostCenter1', Value: 'CostCenter1' });
this.costcentrecodeOptions.push({Text: 'CostCenter2', Value: 'CostCenter2' });
this.billingreferenceOptions.push({Text: 'AssetCat1', Value: 'AssetCat1' });
this.billingreferenceOptions.push({Text: 'AssetCat2', Value: 'AssetCat2' });
    this.loggedInUserService.getLookupOptions('customer-profiles').subscribe({
      next: options => this.customerprofileidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('party-contacts').subscribe({
      next: options => this.departmentheadcontactidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('customer-departments').subscribe({
      next: options => this.parentcustomerdepartmentidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('party-locations').subscribe({
      next: options => this.partylocationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.customerDepartmentService.getById(this.selectedId).subscribe({
      next: data => {
        this.customerDepartment = data;
        this.objMaster = { ...this.customerDepartment };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ICustomerDepartment): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
CustomerProfileId: obj.CustomerProfileId || 0,
PartyLocationId: obj.PartyLocationId || 0,
ParentCustomerDepartmentId: obj.ParentCustomerDepartmentId || 0,
DepartmentCode: obj.DepartmentCode || '',
DepartmentName: obj.DepartmentName || '',
CostCentreCode: obj.CostCentreCode || '',
DepartmentHeadContactId: obj.DepartmentHeadContactId || 0,
BillingReference: obj.BillingReference || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/customerDepartments/create']);
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
    this.customerDepartment = { ...this.objMaster };
    var obj  = this.customerDepartment;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
CustomerProfileId: obj.CustomerProfileId || 0,
PartyLocationId: obj.PartyLocationId || 0,
ParentCustomerDepartmentId: obj.ParentCustomerDepartmentId || 0,
DepartmentCode: obj.DepartmentCode || '',
DepartmentName: obj.DepartmentName || '',
CostCentreCode: obj.CostCentreCode || '',
DepartmentHeadContactId: obj.DepartmentHeadContactId || 0,
BillingReference: obj.BillingReference || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
     PartyId: formValues.PartyId || 0,
CustomerProfileId: formValues.CustomerProfileId || 0,
PartyLocationId: formValues.PartyLocationId || 0,
ParentCustomerDepartmentId: formValues.ParentCustomerDepartmentId || 0,
DepartmentCode: formValues.DepartmentCode || null,
DepartmentName: formValues.DepartmentName || null,
CostCentreCode: formValues.CostCentreCode || null,
DepartmentHeadContactId: formValues.DepartmentHeadContactId || 0,
BillingReference: formValues.BillingReference || null,
RecordStatus: 'Active',
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as ICustomerDepartment ; 
	
	  this.spinner.show(); 
    this.customerDepartmentService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(CustomerDepartment +  'Details Updated sucessfully.');
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



