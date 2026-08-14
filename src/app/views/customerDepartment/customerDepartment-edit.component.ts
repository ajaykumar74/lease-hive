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
import { ICustomerDepartment } from './customerDepartment';
import { CustomerDepartmentService } from './customerDepartment.service';


@Component({
  selector: 'app-customerDepartment-edit',
  standalone: false,
  templateUrl: './customerDepartment-edit.component.html',
  providers: [ MessageService]
})
export class CustomerDepartmentEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  customerDepartment: ICustomerDepartment = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyidOptions: ISelectItem[] = [];
customerprofileidOptions: ISelectItem[] = [];
partylocationidOptions: ISelectItem[] = [];
parentcustomerdepartmentidOptions: ISelectItem[] = [];
costcentrecodeOptions: ISelectItem[] = [];
departmentheadcontactidOptions: ISelectItem[] = [];
billingreferenceOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ICustomerDepartment = {} as ICustomerDepartment;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private customerDepartmentService: CustomerDepartmentService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.customerDepartment };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerProfileId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ParentCustomerDepartmentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DepartmentCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DepartmentName: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
CostCentreCode: new FormControl('', [Validators.maxLength(30), ]), 
DepartmentHeadContactId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
BillingReference: new FormControl('', [Validators.maxLength(20), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.costcentrecodeOptions.push({Text: 'CostCenter1', Value: 'CostCenter1' });
this.costcentrecodeOptions.push({Text: 'CostCenter2', Value: 'CostCenter2' });
this.billingreferenceOptions.push({Text: 'AssetCat1', Value: 'AssetCat1' });
this.billingreferenceOptions.push({Text: 'AssetCat2', Value: 'AssetCat2' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Disabled', Value: 'Disabled' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.customerDepartmentService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.customerDepartment = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.customerDepartment };
        this.populateUI(this.customerDepartment);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ICustomerDepartment): void {
    this.loggedInUserService.getLookupOptions('customer-profiles', obj.CustomerProfileId).subscribe({
      next: options => this.customerprofileidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('party-contacts', obj.DepartmentHeadContactId).subscribe({
      next: options => this.departmentheadcontactidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('customer-departments', obj.ParentCustomerDepartmentId).subscribe({
      next: options => this.parentcustomerdepartmentidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('party-locations', obj.PartyLocationId).subscribe({
      next: options => this.partylocationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });  
    this.loggedInUserService.getPartyOptions(obj.PartyId).subscribe({
      next: options => this.partyidOptions = options,
      error: err => this.messageService?.showError(err)
    });
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
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "CustomerDepartment Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/customerDepartment/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
RecordStatus: obj.RecordStatus || '',
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PartyId:  formValues.PartyId || null,
CustomerProfileId:  formValues.CustomerProfileId || null,
PartyLocationId:  formValues.PartyLocationId || null,
ParentCustomerDepartmentId:  formValues.ParentCustomerDepartmentId || null,
DepartmentCode:  formValues.DepartmentCode || null,
DepartmentName:  formValues.DepartmentName || null,
CostCentreCode:  formValues.CostCentreCode || null,
DepartmentHeadContactId:  formValues.DepartmentHeadContactId || null,
BillingReference:  formValues.BillingReference || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as ICustomerDepartment ;
	
	this.spinner.show();  	   
    this.customerDepartmentService.update(this.customerDepartment.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(CustomerDepartment +  'Details Updated sucessfully.');
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
