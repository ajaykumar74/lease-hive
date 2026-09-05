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
import { IOrganisationUnit } from './organisationUnit';
import { OrganisationUnitService } from './organisationUnit.service';

@Component({
  selector: 'app-organisationUnit-create',
  standalone: false,
  templateUrl: './organisationUnit-create.component.html' ,
   providers: [ MessageService]
})
export class OrganisationUnitCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Organisation Unit';
  organisationUnit: IOrganisationUnit = null;
  parentorganisationunitidOptions: ISelectItem[] = [];
unittypeOptions: ISelectItem[] = [];
costcentrecodeOptions: ISelectItem[] = [];
profitcentrecodeOptions: ISelectItem[] = [];
defaultlocationidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IOrganisationUnit = {} as IOrganisationUnit;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private organisationUnitService: OrganisationUnitService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.organisationUnit };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ParentOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
UnitCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
UnitName: new FormControl('', [Validators.required, Validators.maxLength(256), ]),
UnitType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CostCentreCode: new FormControl('', [Validators.maxLength(20), ]), 
ProfitCentreCode: new FormControl('', [Validators.maxLength(20), ]), 
ManagerUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DefaultLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
IsContractingUnit: new FormControl(false, [Validators.required]),
IsBillingUnit: new FormControl(false, [Validators.required]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
HierarchyPath: new FormControl('', [Validators.maxLength(256), ]), 
Description: new FormControl('', [Validators.maxLength(256), ]), 

    });
    // Keep the optional entry visually blank without allowing the dropdown label to collapse.
this.unittypeOptions = this.loggedInUserService.getPicklistOptions('UnitType');
this.costcentrecodeOptions.push({Text: 'U001', Value: 'U001' });
this.costcentrecodeOptions.push({Text: 'U002', Value: 'U002' });
this.profitcentrecodeOptions.push({Text: 'U001', Value: 'U001' });
this.profitcentrecodeOptions.push({Text: 'U002', Value: 'U002' });
    this.loggedInUserService.getLookupOptions('locations').subscribe({
      next: options => this.defaultlocationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('organisation-units').subscribe({
      next: options => this.parentorganisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.organisationUnitService.getById(this.selectedId).subscribe({
      next: data => {
        this.organisationUnit = data;
        this.objMaster = { ...this.organisationUnit };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IOrganisationUnit): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ParentOrganisationUnitId: obj.ParentOrganisationUnitId || 0,
UnitCode: obj.UnitCode || '',
UnitName: obj.UnitName || '',
UnitType: obj.UnitType || '',
CostCentreCode: obj.CostCentreCode || '',
ProfitCentreCode: obj.ProfitCentreCode || '',
ManagerUserId: obj.ManagerUserId || 0,
DefaultLocationId: obj.DefaultLocationId || 0,
IsContractingUnit:  obj.IsContractingUnit || false,
IsBillingUnit:  obj.IsBillingUnit || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
HierarchyPath: obj.HierarchyPath || '',
Description: obj.Description || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/organisations/units/create']);
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
    this.organisationUnit = { ...this.objMaster };
    var obj  = this.organisationUnit;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ParentOrganisationUnitId: obj.ParentOrganisationUnitId || 0,
UnitCode: obj.UnitCode || '',
UnitName: obj.UnitName || '',
UnitType: obj.UnitType || '',
CostCentreCode: obj.CostCentreCode || '',
ProfitCentreCode: obj.ProfitCentreCode || '',
ManagerUserId: obj.ManagerUserId || 0,
DefaultLocationId: obj.DefaultLocationId || 0,
IsContractingUnit:  obj.IsContractingUnit || false,
IsBillingUnit:  obj.IsBillingUnit || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
HierarchyPath: obj.HierarchyPath || '',
Description: obj.Description || '',
 
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
     ParentOrganisationUnitId: formValues.ParentOrganisationUnitId || null,
UnitCode: formValues.UnitCode || null,
UnitName: formValues.UnitName || null,
UnitType: formValues.UnitType || null,
CostCentreCode: formValues.CostCentreCode || null,
ProfitCentreCode: formValues.ProfitCentreCode || null,
ManagerUserId: formValues.ManagerUserId || null,
DefaultLocationId: formValues.DefaultLocationId || null,
IsContractingUnit: formValues.IsContractingUnit || null,
IsBillingUnit: formValues.IsBillingUnit || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
Status: 'Active',
HierarchyPath: formValues.HierarchyPath || null,
Description: formValues.Description || null,

    } as IOrganisationUnit ; 
	
	  this.spinner.show(); 
    this.organisationUnitService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(OrganisationUnit +  'Details Updated sucessfully.');
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



