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
import { ISupplierServiceArea } from './supplierServiceArea';
import { SupplierServiceAreaService } from './supplierServiceArea.service';

@Component({
  selector: 'app-supplierServiceArea-create',
  standalone: false,
  templateUrl: './supplierServiceArea-create.component.html' ,
   providers: [ MessageService]
})
export class SupplierServiceAreaCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Supplier Service Area';
  supplierServiceArea: ISupplierServiceArea = null;
  partyidOptions: ISelectItem[] = [];
supplierprofileidOptions: ISelectItem[] = [];
partylocationidOptions: ISelectItem[] = [];
countrycodeOptions: ISelectItem[] = [];
stateprovincecodeOptions: ISelectItem[] = [];
cityOptions: ISelectItem[] = [];
assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ISupplierServiceArea = {} as ISupplierServiceArea;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private supplierServiceAreaService: SupplierServiceAreaService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.supplierServiceArea };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierProfileId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CountryCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StateProvinceCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
City: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
PostalCodePattern: new FormControl('', [Validators.maxLength(7), ]), 
AssetCategoryId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CanSupply: new FormControl(false, []),
CanInstall: new FormControl(false, []),
CanMaintain: new FormControl(false, []),
CanInspect: new FormControl(false, []),
CanRecover: new FormControl(false, []),
CanDispose: new FormControl(false, []),
StandardLeadTimeDays: new FormControl(0, [Validators.min(0), Validators.max(255)]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
Description: new FormControl('', [Validators.maxLength(100), ]), 

    });
    this.loggedInUserService.getPartyOptions().subscribe({
      next: options => this.partyidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
this.countrycodeOptions = this.loggedInUserService.getPicklistOptions('CountryCode');
this.stateprovincecodeOptions = this.loggedInUserService.getPicklistOptions('StateCode');
this.cityOptions = this.loggedInUserService.getPicklistOptions('City');
this.assetcategoryidOptions = this.loggedInUserService.getPicklistOptions('AssetCategory');
this.assettypeidOptions = this.loggedInUserService.getPicklistOptions('AssetType');
    this.loggedInUserService.getLookupOptions('party-locations').subscribe({
      next: options => this.partylocationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('supplier-profiles').subscribe({
      next: options => this.supplierprofileidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.supplierServiceAreaService.getById(this.selectedId).subscribe({
      next: data => {
        this.supplierServiceArea = data;
        this.objMaster = { ...this.supplierServiceArea };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ISupplierServiceArea): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
SupplierProfileId: obj.SupplierProfileId || 0,
PartyLocationId: obj.PartyLocationId || 0,
CountryCode: obj.CountryCode || '',
StateProvinceCode: obj.StateProvinceCode || '',
City: obj.City || '',
PostalCodePattern: obj.PostalCodePattern || '',
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
CanSupply:  obj.CanSupply || false,
CanInstall:  obj.CanInstall || false,
CanMaintain:  obj.CanMaintain || false,
CanInspect:  obj.CanInspect || false,
CanRecover:  obj.CanRecover || false,
CanDispose:  obj.CanDispose || false,
StandardLeadTimeDays: obj.StandardLeadTimeDays || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/parties/supplier-service-areas/create']);
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
    this.supplierServiceArea = { ...this.objMaster };
    var obj  = this.supplierServiceArea;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
SupplierProfileId: obj.SupplierProfileId || 0,
PartyLocationId: obj.PartyLocationId || 0,
CountryCode: obj.CountryCode || '',
StateProvinceCode: obj.StateProvinceCode || '',
City: obj.City || '',
PostalCodePattern: obj.PostalCodePattern || '',
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
CanSupply:  obj.CanSupply || false,
CanInstall:  obj.CanInstall || false,
CanMaintain:  obj.CanMaintain || false,
CanInspect:  obj.CanInspect || false,
CanRecover:  obj.CanRecover || false,
CanDispose:  obj.CanDispose || false,
StandardLeadTimeDays: obj.StandardLeadTimeDays || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
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
     PartyId: formValues.PartyId || 0,
SupplierProfileId: formValues.SupplierProfileId || 0,
PartyLocationId: formValues.PartyLocationId || 0,
CountryCode: formValues.CountryCode || null,
StateProvinceCode: formValues.StateProvinceCode || null,
City: formValues.City || null,
PostalCodePattern: formValues.PostalCodePattern || null,
AssetCategoryId: formValues.AssetCategoryId || 0,
AssetTypeId: formValues.AssetTypeId || 0,
CanSupply: formValues.CanSupply || false,
CanInstall: formValues.CanInstall || false,
CanMaintain: formValues.CanMaintain || false,
CanInspect: formValues.CanInspect || false,
CanRecover: formValues.CanRecover || false,
CanDispose: formValues.CanDispose || false,
StandardLeadTimeDays: formValues.StandardLeadTimeDays || null,
RecordStatus: 'Active',
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
Description: formValues.Description || null,

    } as ISupplierServiceArea ; 
	
	  this.spinner.show(); 
    this.supplierServiceAreaService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(SupplierServiceArea +  'Details Updated sucessfully.');
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



