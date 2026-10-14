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
import { ICustomerDepartment } from './customerDepartment';
import { CustomerDepartmentService } from './customerDepartment.service';

@Component({
  selector: 'app-customerDepartment-create',
  standalone: false,
  templateUrl: './customerDepartment-create.component.html' ,
   providers: [ MessageService]
})
export class CustomerDepartmentCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
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
PartyId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
CustomerProfileId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
PartyLocationId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
ParentCustomerDepartmentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DepartmentCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DepartmentName: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
CostCentreCode: new FormControl('', [Validators.maxLength(30), ]), 
DepartmentHeadContactId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
BillingReference: new FormControl('', [Validators.maxLength(20), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    this.loggedInUserService.getEntityLookupOptions('customer-parties').subscribe({
      next: options => this.partyidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerProfileId', 'customer-profiles',
      options => this.customerprofileidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, { PartyId: 'PartyId' });
this.loggedInUserService.bindEntityLookup(this.editForm, 'PartyLocationId', 'party-locations',
      options => this.partylocationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, { PartyId: 'PartyId' });
this.loggedInUserService.bindEntityLookup(this.editForm, 'DepartmentHeadContactId', 'party-contacts',
      options => this.departmentheadcontactidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, { PartyId: 'PartyId' });
this.loggedInUserService.bindEntityLookup(this.editForm, 'ParentCustomerDepartmentId', 'customer-departments',
      options => this.parentcustomerdepartmentidOptions = options.filter(option => option.Id !== Number(this.editForm.get('Id')?.value)),
      error => setTimeout(() => this.messageService?.showError(error)), this.entityLookupDestroyRef,
      { PartyId: 'PartyId', CustomerProfileId: 'CustomerProfileId' });

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
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/parties/customer-departments/create']);
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
EffectiveFrom: new Date(),
EffectiveTo: null,

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



