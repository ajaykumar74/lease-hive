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
import { IAssetReturnSchedule } from './assetReturnSchedule';
import { AssetReturnScheduleService } from './assetReturnSchedule.service';

@Component({
  selector: 'app-assetReturnSchedule-create',
  standalone: false,
  templateUrl: './assetReturnSchedule-create.component.html' ,
   providers: [ MessageService]
})
export class AssetReturnScheduleCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetReturnSchedule: IAssetReturnSchedule = null;
  endofleasecaseidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
returnlocationidOptions: ISelectItem[] = [];
responsibleorganisationunitidOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
customercontactpartyidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetReturnSchedule = {} as IAssetReturnSchedule;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetReturnScheduleService: AssetReturnScheduleService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetReturnSchedule };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
EndOfLeaseCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ScheduledReturnAt: new FormControl(new Date(), [Validators.required]),
ReturnLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ResponsibleOrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CustomerContactPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create AssetReturnSchedule';
    this.endofleasecaseidOptions.push({Text: 'EndOfLeaseCaseId1', Value: 'EndOfLeaseCaseId1' });
this.endofleasecaseidOptions.push({Text: 'EndOfLeaseCaseId2', Value: 'EndOfLeaseCaseId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.returnlocationidOptions.push({Text: 'ReturnLocationId1', Value: 'ReturnLocationId1' });
this.returnlocationidOptions.push({Text: 'ReturnLocationId2', Value: 'ReturnLocationId2' });
this.responsibleorganisationunitidOptions.push({Text: 'ResponsibleOrganisationUnitId1', Value: 'ResponsibleOrganisationUnitId1' });
this.responsibleorganisationunitidOptions.push({Text: 'ResponsibleOrganisationUnitId2', Value: 'ResponsibleOrganisationUnitId2' });
this.statuscodeOptions.push({Text: 'SCHEDULED', Value: 'SCHEDULED' });
this.statuscodeOptions.push({Text: 'RESCHEDULED', Value: 'RESCHEDULED' });
this.statuscodeOptions.push({Text: 'COMPLETED', Value: 'COMPLETED' });
this.statuscodeOptions.push({Text: 'CANCELLED', Value: 'CANCELLED' });
this.customercontactpartyidOptions.push({Text: 'CustomerContactPartyId1', Value: 'CustomerContactPartyId1' });
this.customercontactpartyidOptions.push({Text: 'CustomerContactPartyId2', Value: 'CustomerContactPartyId2' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetReturnScheduleService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetReturnSchedule = data;
        this.objMaster = { ...this.assetReturnSchedule };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetReturnSchedule): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
AssetId: obj.AssetId || 0,
ScheduledReturnAt:  obj.ScheduledReturnAt || new Date(),
ReturnLocationId: obj.ReturnLocationId || 0,
ResponsibleOrganisationUnitId: obj.ResponsibleOrganisationUnitId || 0,
StatusCode: obj.StatusCode || '',
CustomerContactPartyId: obj.CustomerContactPartyId || 0,
Remarks: obj.Remarks || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetReturnSchedules/create']);
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
    this.assetReturnSchedule = { ...this.objMaster };
    var obj  = this.assetReturnSchedule;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
AssetId: obj.AssetId || 0,
ScheduledReturnAt:  obj.ScheduledReturnAt || new Date(),
ReturnLocationId: obj.ReturnLocationId || 0,
ResponsibleOrganisationUnitId: obj.ResponsibleOrganisationUnitId || 0,
StatusCode: obj.StatusCode || '',
CustomerContactPartyId: obj.CustomerContactPartyId || 0,
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
     EndOfLeaseCaseId: formValues.EndOfLeaseCaseId || 0,
AssetId: formValues.AssetId || 0,
ScheduledReturnAt: formValues.ScheduledReturnAt || null,
ReturnLocationId: formValues.ReturnLocationId || 0,
ResponsibleOrganisationUnitId: formValues.ResponsibleOrganisationUnitId || 0,
StatusCode: formValues.StatusCode || null,
CustomerContactPartyId: formValues.CustomerContactPartyId || 0,
Remarks: formValues.Remarks || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetReturnSchedule ; 
	
	  this.spinner.show(); 
    this.assetReturnScheduleService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetReturnSchedule +  'Details Updated sucessfully.');
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



