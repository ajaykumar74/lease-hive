import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-iTAsset-edit',
  standalone: false,
  templateUrl: './iTAsset-edit.component.html',
  providers: [ MessageService]
})
export class ITAssetEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  iTAsset: IITAsset = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IITAsset = {} as IITAsset;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private iTAssetService: ITAssetService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.iTAsset };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
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
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
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
    this.iTAssetService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.iTAsset = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.iTAsset };
        this.populateUI(this.iTAsset);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IITAsset): void {  
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
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "ITAsset Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/iTAsset/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
     AssetId:  formValues.AssetId || 0,
DeviceSerialNo:  formValues.DeviceSerialNo || null,
Processor:  formValues.Processor || null,
RAMGB:  formValues.RAMGB || 0,
StorageGB:  formValues.StorageGB || 0,
OperatingSystem:  formValues.OperatingSystem || null,
MACAddress:  formValues.MACAddress || null,
IMEI:  formValues.IMEI || null,
WarrantyExpiryDate:  formValues.WarrantyExpiryDate || null,
MDMDeviceId:  formValues.MDMDeviceId || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IITAsset ;
	
	this.spinner.show();  	   
    this.iTAssetService.update(this.iTAsset.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ITAsset +  'Details Updated sucessfully.');
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
