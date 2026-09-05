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
import { IVehicleAsset } from './vehicleAsset';
import { VehicleAssetService } from './vehicleAsset.service';


@Component({
  selector: 'app-vehicleAsset-edit',
  standalone: false,
  templateUrl: './vehicleAsset-edit.component.html',
  providers: [ MessageService]
})
export class VehicleAssetEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  vehicleAsset: IVehicleAsset = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  fueltypecodeOptions: ISelectItem[] = [];
emissionnormcodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IVehicleAsset = {} as IVehicleAsset;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private vehicleAssetService: VehicleAssetService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.vehicleAsset };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.vehicleAssetService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.vehicleAsset = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.vehicleAsset };
        this.populateUI(this.vehicleAsset);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "VehicleAsset Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/vehicleAsset/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetId:  formValues.AssetId || null,
VIN:  formValues.VIN || null,
RegistrationNo:  formValues.RegistrationNo || null,
RegistrationDate:  formValues.RegistrationDate || null,
RegistrationExpiryDate:  formValues.RegistrationExpiryDate || null,
EngineNo:  formValues.EngineNo || null,
ChassisNo:  formValues.ChassisNo || null,
FuelTypeCode:  formValues.FuelTypeCode || null,
EmissionNormCode:  formValues.EmissionNormCode || null,
SeatingCapacity:  formValues.SeatingCapacity || null,
GrossVehicleWeightKg:  formValues.GrossVehicleWeightKg || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IVehicleAsset ;
	
	this.spinner.show();  	   
    this.vehicleAssetService.update(this.vehicleAsset.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(VehicleAsset +  'Details Updated sucessfully.');
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
