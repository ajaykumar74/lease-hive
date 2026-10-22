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
import { IITAsset } from './iTAsset';
import { ITAssetService } from './iTAsset.service';

@Component({
  selector: 'app-iTAsset-create',
  standalone: false,
  templateUrl: './iTAsset-create.component.html' ,
   providers: [ MessageService]
})
export class ITAssetCreateComponent implements OnInit {
   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create IT Asset';
  iTAsset: IITAsset = null;
  assetidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IITAsset = {} as IITAsset;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private iTAssetService: ITAssetService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.iTAsset };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
DeviceSerialNo: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
Processor: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
RAMGB: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
StorageGB: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
OperatingSystem: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
MACAddress: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
IMEI: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
WarrantyExpiryDate: new FormControl(new Date(), [Validators.required]),
MDMDeviceId: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    const assetId = Number(this.activatedRoute.snapshot.paramMap.get('assetId'));
    this.loadAssetOptions(assetId > 0 ? assetId : undefined);
    if (assetId > 0) this.editForm.patchValue({ AssetId: assetId });

  }

  private loadAssetOptions(selectedId?: number): void {
    this.loggedInUserService.getAssetOptionsForCategory('IT', selectedId).subscribe({
      next: options => this.assetidOptions = options,
      error: error => setTimeout(() => this.messageService?.showError(error))
    });
  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.iTAssetService.getById(this.selectedId).subscribe({
      next: data => {
        this.iTAsset = data;
        this.objMaster = { ...this.iTAsset };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IITAsset): void {
     this.loadAssetOptions(obj.AssetId);
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
DeviceSerialNo: obj.DeviceSerialNo || '',
Processor: obj.Processor || '',
RAMGB: obj.RAMGB || 0,
StorageGB: obj.StorageGB || 0,
OperatingSystem: obj.OperatingSystem || '',
MACAddress: obj.MACAddress || '',
IMEI: obj.IMEI || '',
WarrantyExpiryDate:  obj.WarrantyExpiryDate || new Date(),
MDMDeviceId: obj.MDMDeviceId || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/assets/specialised/it/create']);
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
    this.iTAsset = { ...this.objMaster };
    var obj  = this.iTAsset;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
DeviceSerialNo: obj.DeviceSerialNo || '',
Processor: obj.Processor || '',
RAMGB: obj.RAMGB || 0,
StorageGB: obj.StorageGB || 0,
OperatingSystem: obj.OperatingSystem || '',
MACAddress: obj.MACAddress || '',
IMEI: obj.IMEI || '',
WarrantyExpiryDate:  obj.WarrantyExpiryDate || new Date(),
MDMDeviceId: obj.MDMDeviceId || '',
 
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
DeviceSerialNo: formValues.DeviceSerialNo || null,
Processor: formValues.Processor || null,
RAMGB: formValues.RAMGB || 0,
StorageGB: formValues.StorageGB || 0,
OperatingSystem: formValues.OperatingSystem || null,
MACAddress: formValues.MACAddress || null,
IMEI: formValues.IMEI || null,
WarrantyExpiryDate: formValues.WarrantyExpiryDate || null,
MDMDeviceId: formValues.MDMDeviceId || null,
EffectiveFrom: new Date(),
EffectiveTo: null,
RecordStatus: 'Active',

    } as IITAsset ; 
	
	  this.spinner.show(); 
    this.iTAssetService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ITAsset +  'Details Updated sucessfully.');
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



