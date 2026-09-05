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
import { IAssetDowntime } from './assetDowntime';
import { AssetDowntimeService } from './assetDowntime.service';

@Component({
  selector: 'app-assetDowntime-create',
  standalone: false,
  templateUrl: './assetDowntime-create.component.html' ,
   providers: [ MessageService]
})
export class AssetDowntimeCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetDowntime: IAssetDowntime = null;
  assetidOptions: ISelectItem[] = [];
maintenanceworkorderidOptions: ISelectItem[] = [];
insuranceincidentidOptions: ISelectItem[] = [];
downtimereasoncodeOptions: ISelectItem[] = [];
customerimpactcodeOptions: ISelectItem[] = [];
replacementassetidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetDowntime = {} as IAssetDowntime;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetDowntimeService: AssetDowntimeService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetDowntime };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MaintenanceWorkOrderId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
InsuranceIncidentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DowntimeStartAt: new FormControl(new Date(), [Validators.required]),
DowntimeEndAt: new FormControl(new Date(), []),
DowntimeReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CustomerImpactCode: new FormControl('', [Validators.maxLength(20), ]), 
ReplacementAssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create AssetDowntime';
    this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId1', Value: 'MaintenanceWorkOrderId1' });
this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId2', Value: 'MaintenanceWorkOrderId2' });
this.insuranceincidentidOptions.push({Text: 'InsuranceIncidentId1', Value: 'InsuranceIncidentId1' });
this.insuranceincidentidOptions.push({Text: 'InsuranceIncidentId2', Value: 'InsuranceIncidentId2' });
this.downtimereasoncodeOptions = this.loggedInUserService.getPicklistOptions('DowntimeReasonCode');
this.customerimpactcodeOptions = this.loggedInUserService.getPicklistOptions('CustomerImpactCode');
this.replacementassetidOptions.push({Text: 'ReplacementAssetId1', Value: 'ReplacementAssetId1' });
this.replacementassetidOptions.push({Text: 'ReplacementAssetId2', Value: 'ReplacementAssetId2' });
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetDowntimeService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetDowntime = data;
        this.objMaster = { ...this.assetDowntime };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetDowntime): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
InsuranceIncidentId: obj.InsuranceIncidentId || 0,
DowntimeStartAt:  obj.DowntimeStartAt || new Date(),
DowntimeEndAt:  obj.DowntimeEndAt || new Date(),
DowntimeReasonCode: obj.DowntimeReasonCode || '',
CustomerImpactCode: obj.CustomerImpactCode || '',
ReplacementAssetId: obj.ReplacementAssetId || 0,
Remarks: obj.Remarks || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetDowntimes/create']);
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
    this.assetDowntime = { ...this.objMaster };
    var obj  = this.assetDowntime;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
InsuranceIncidentId: obj.InsuranceIncidentId || 0,
DowntimeStartAt:  obj.DowntimeStartAt || new Date(),
DowntimeEndAt:  obj.DowntimeEndAt || new Date(),
DowntimeReasonCode: obj.DowntimeReasonCode || '',
CustomerImpactCode: obj.CustomerImpactCode || '',
ReplacementAssetId: obj.ReplacementAssetId || 0,
Remarks: obj.Remarks || '',
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
MaintenanceWorkOrderId: formValues.MaintenanceWorkOrderId || 0,
InsuranceIncidentId: formValues.InsuranceIncidentId || 0,
DowntimeStartAt: formValues.DowntimeStartAt || null,
DowntimeEndAt: formValues.DowntimeEndAt || null,
DowntimeReasonCode: formValues.DowntimeReasonCode || null,
CustomerImpactCode: formValues.CustomerImpactCode || null,
ReplacementAssetId: formValues.ReplacementAssetId || 0,
Remarks: formValues.Remarks || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetDowntime ; 
	
	  this.spinner.show(); 
    this.assetDowntimeService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetDowntime +  'Details Updated sucessfully.');
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



