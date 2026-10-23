import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IEquipmentAsset } from './equipmentAsset';
import { EquipmentAssetService } from './equipmentAsset.service';

@Component({
  selector: 'app-equipmentAsset-create',
  standalone: false,
  templateUrl: './equipmentAsset-create.component.html' ,
   providers: [ MessageService]
})
export class EquipmentAssetCreateComponent implements OnInit {
   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Equipment Asset';
  equipmentAsset: IEquipmentAsset = null;
  assetidOptions: ISelectItem[] = [];
safetyclassOptions: ISelectItem[] = [];
capacityuomidOptions: ISelectItem[] = [];
poweruomidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IEquipmentAsset = {} as IEquipmentAsset;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private equipmentAssetService: EquipmentAssetService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.equipmentAsset };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
EquipmentSerialNo: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
CapacityValue: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
CapacityUOMId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(32767)]),
PowerRating: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
PowerUOMId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(32767)]),
ManufactureDate: new FormControl(new Date(), [Validators.required]),
SafetyClass: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    const assetId = Number(this.activatedRoute.snapshot.paramMap.get('assetId'));
    this.loadAssetOptions(assetId > 0 ? assetId : undefined);
    if (assetId > 0) this.editForm.patchValue({ AssetId: assetId });
this.safetyclassOptions = this.loggedInUserService.getPicklistOptions('SafetyClass');
this.capacityuomidOptions = this.loggedInUserService.getPicklistOptions('UnitOfMeasure');
this.poweruomidOptions = this.capacityuomidOptions;

  }

  private loadAssetOptions(selectedId?: number): void {
    this.loggedInUserService.getAssetOptionsForCategory('Equipment', selectedId).subscribe({
      next: options => this.assetidOptions = options,
      error: error => setTimeout(() => this.messageService?.showError(error))
    });
  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.equipmentAssetService.getById(this.selectedId).subscribe({
      next: data => {
        this.equipmentAsset = data;
        this.objMaster = { ...this.equipmentAsset };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IEquipmentAsset): void {
     this.loadAssetOptions(obj.AssetId);
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
EquipmentSerialNo: obj.EquipmentSerialNo || '',
CapacityValue: obj.CapacityValue || 0,
CapacityUOMId: obj.CapacityUOMId || 0,
PowerRating: obj.PowerRating || 0,
PowerUOMId: obj.PowerUOMId || 0,
ManufactureDate:  obj.ManufactureDate || new Date(),
SafetyClass: obj.SafetyClass || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/assets/specialised/equipment/create']);
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
    this.equipmentAsset = { ...this.objMaster };
    var obj  = this.equipmentAsset;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
EquipmentSerialNo: obj.EquipmentSerialNo || '',
CapacityValue: obj.CapacityValue || 0,
CapacityUOMId: obj.CapacityUOMId || 0,
PowerRating: obj.PowerRating || 0,
PowerUOMId: obj.PowerUOMId || 0,
ManufactureDate:  obj.ManufactureDate || new Date(),
SafetyClass: obj.SafetyClass || '',
 
      }
    );
    this.editForm.markAsPristine();
    this.editForm.markAsUntouched();
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
     AssetId: formValues.AssetId || 0,
EquipmentSerialNo: formValues.EquipmentSerialNo || null,
CapacityValue: formValues.CapacityValue || 0,
CapacityUOMId: formValues.CapacityUOMId || 0,
PowerRating: formValues.PowerRating || 0,
PowerUOMId: formValues.PowerUOMId || 0,
ManufactureDate: formValues.ManufactureDate || null,
SafetyClass: formValues.SafetyClass || null,
EffectiveFrom: new Date(),
EffectiveTo: null,
RecordStatus: 'Active',

    } as IEquipmentAsset ; 
	
	  this.spinner.show(); 
    this.equipmentAssetService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(EquipmentAsset +  'Details Updated sucessfully.');
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



