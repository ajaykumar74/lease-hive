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
import { IVehicleAsset } from './vehicleAsset';
import { VehicleAssetService } from './vehicleAsset.service';

@Component({
  selector: 'app-vehicleAsset-create',
  standalone: false,
  templateUrl: './vehicleAsset-create.component.html' ,
   providers: [ MessageService]
})
export class VehicleAssetCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  vehicleAsset: IVehicleAsset = null;
  fueltypecodeOptions: ISelectItem[] = [];
emissionnormcodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IVehicleAsset = {} as IVehicleAsset;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private vehicleAssetService: VehicleAssetService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.vehicleAsset };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
VIN: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
RegistrationNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
RegistrationDate: new FormControl(new Date(), [Validators.required]),
RegistrationExpiryDate: new FormControl(new Date(), []),
EngineNo: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
ChassisNo: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
FuelTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EmissionNormCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SeatingCapacity: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
GrossVehicleWeightKg: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.fueltypecodeOptions.push({Text: '', Value: '' });
this.emissionnormcodeOptions.push({Text: '', Value: '' });
this.recordstatusOptions.push({Text: '', Value: '' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.vehicleAssetService.getById(this.selectedId).subscribe({
      next: data => {
        this.vehicleAsset = data;
        this.objMaster = { ...this.vehicleAsset };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IVehicleAsset): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
VIN: obj.VIN || '',
RegistrationNo: obj.RegistrationNo || '',
RegistrationDate:  obj.RegistrationDate || new Date(),
RegistrationExpiryDate:  obj.RegistrationExpiryDate || new Date(),
EngineNo: obj.EngineNo || '',
ChassisNo: obj.ChassisNo || '',
FuelTypeCode: obj.FuelTypeCode || '',
EmissionNormCode: obj.EmissionNormCode || '',
SeatingCapacity: obj.SeatingCapacity || 0,
GrossVehicleWeightKg: obj.GrossVehicleWeightKg || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/vehicleAssets/create']);
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
    this.vehicleAsset = { ...this.objMaster };
    var obj  = this.vehicleAsset;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
VIN: obj.VIN || '',
RegistrationNo: obj.RegistrationNo || '',
RegistrationDate:  obj.RegistrationDate || new Date(),
RegistrationExpiryDate:  obj.RegistrationExpiryDate || new Date(),
EngineNo: obj.EngineNo || '',
ChassisNo: obj.ChassisNo || '',
FuelTypeCode: obj.FuelTypeCode || '',
EmissionNormCode: obj.EmissionNormCode || '',
SeatingCapacity: obj.SeatingCapacity || 0,
GrossVehicleWeightKg: obj.GrossVehicleWeightKg || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
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
     AssetId: formValues.AssetId || 0,
VIN: formValues.VIN || null,
RegistrationNo: formValues.RegistrationNo || null,
RegistrationDate: formValues.RegistrationDate || null,
RegistrationExpiryDate: formValues.RegistrationExpiryDate || null,
EngineNo: formValues.EngineNo || null,
ChassisNo: formValues.ChassisNo || null,
FuelTypeCode: formValues.FuelTypeCode || null,
EmissionNormCode: formValues.EmissionNormCode || null,
SeatingCapacity: formValues.SeatingCapacity || null,
GrossVehicleWeightKg: formValues.GrossVehicleWeightKg || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IVehicleAsset ; 
	
	  this.spinner.show(); 
    this.vehicleAssetService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(VehicleAsset +  'Details Updated sucessfully.');
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



