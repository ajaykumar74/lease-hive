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
  Caption: string = 'Loading...';
  supplierServiceArea: ISupplierServiceArea = null;
  partyidOptions: ISelectItem[] = [];
supplierprofileidOptions: ISelectItem[] = [];
partylocationidOptions: ISelectItem[] = [];
countrycodeOptions: ISelectItem[] = [];
stateprovincecodeOptions: ISelectItem[] = [];
cityOptions: ISelectItem[] = [];
assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

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
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
Description: new FormControl('', [Validators.maxLength(100), ]), 

    });
    this.loggedInUserService.getPartyOptions().subscribe({
      next: options => this.partyidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
this.supplierprofileidOptions.push({Text: 'SupProfile1', Value: 'SupProfile1' });
this.supplierprofileidOptions.push({Text: 'SubProfile2', Value: 'SubProfile2' });
this.partylocationidOptions.push({Text: 'PartyLOcation1', Value: 'PartyLOcation1' });
this.partylocationidOptions.push({Text: 'PartyLocation2', Value: 'PartyLocation2' });
this.countrycodeOptions.push({Text: 'IN', Value: 'IN' });
this.countrycodeOptions.push({Text: 'USA', Value: 'USA' });
this.countrycodeOptions.push({Text: 'UK', Value: 'UK' });
this.stateprovincecodeOptions.push({Text: 'MH', Value: 'MH' });
this.stateprovincecodeOptions.push({Text: 'DL', Value: 'DL' });
this.stateprovincecodeOptions.push({Text: 'HR', Value: 'HR' });
this.cityOptions.push({Text: 'Mumbai', Value: 'Mumbai' });
this.cityOptions.push({Text: 'Gurugram', Value: 'Gurugram' });
this.cityOptions.push({Text: 'New Delhi', Value: 'New Delhi' });
this.assetcategoryidOptions.push({Text: 'AssetCat1', Value: 'AssetCat1' });
this.assetcategoryidOptions.push({Text: 'AssetCat2', Value: 'AssetCat2' });
this.assettypeidOptions.push({Text: 'AssetYppe1', Value: 'AssetYppe1' });
this.assettypeidOptions.push({Text: 'AssetType2', Value: 'AssetType2' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Disabled', Value: 'Disabled' });

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
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/supplierServiceAreas/create']);
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
RecordStatus: obj.RecordStatus || '',
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
RecordStatus: formValues.RecordStatus || null,
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



