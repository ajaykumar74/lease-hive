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
import { IAssetReturn } from './assetReturn';
import { AssetReturnService } from './assetReturn.service';

@Component({
  selector: 'app-assetReturn-create',
  standalone: false,
  templateUrl: './assetReturn-create.component.html' ,
   providers: [ MessageService]
})
export class AssetReturnCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetReturn: IAssetReturn = null;
  endofleasecaseidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
assetreturnscheduleidOptions: ISelectItem[] = [];
returnlocationidOptions: ISelectItem[] = [];
receivedbyuseridOptions: ISelectItem[] = [];
finalmeasurereadingidOptions: ISelectItem[] = [];
returninspectionidOptions: ISelectItem[] = [];
returnstatuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetReturn = {} as IAssetReturn;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetReturnService: AssetReturnService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetReturn };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
EndOfLeaseCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetReturnScheduleId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReturnedAt: new FormControl(new Date(), [Validators.required]),
ReturnLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReceivedByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
FinalMeasureReadingId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReturnInspectionId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReturnStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create AssetReturn';
    this.endofleasecaseidOptions.push({Text: 'EndOfLeaseCaseId1', Value: 'EndOfLeaseCaseId1' });
this.endofleasecaseidOptions.push({Text: 'EndOfLeaseCaseId2', Value: 'EndOfLeaseCaseId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.assetreturnscheduleidOptions.push({Text: 'AssetReturnScheduleId1', Value: 'AssetReturnScheduleId1' });
this.assetreturnscheduleidOptions.push({Text: 'AssetReturnScheduleId2', Value: 'AssetReturnScheduleId2' });
this.returnlocationidOptions.push({Text: 'ReturnLocationId1', Value: 'ReturnLocationId1' });
this.returnlocationidOptions.push({Text: 'ReturnLocationId2', Value: 'ReturnLocationId2' });
this.receivedbyuseridOptions.push({Text: 'ReceivedByUserId1', Value: 'ReceivedByUserId1' });
this.receivedbyuseridOptions.push({Text: 'ReceivedByUserId2', Value: 'ReceivedByUserId2' });
this.finalmeasurereadingidOptions.push({Text: 'FinalMeasureReadingId1', Value: 'FinalMeasureReadingId1' });
this.finalmeasurereadingidOptions.push({Text: 'FinalMeasureReadingId2', Value: 'FinalMeasureReadingId2' });
this.returninspectionidOptions.push({Text: 'ReturnInspectionId1', Value: 'ReturnInspectionId1' });
this.returninspectionidOptions.push({Text: 'ReturnInspectionId2', Value: 'ReturnInspectionId2' });
this.returnstatuscodeOptions.push({Text: 'RECEIVED', Value: 'RECEIVED' });
this.returnstatuscodeOptions.push({Text: 'PENDING_EVIDENCE', Value: 'PENDING_EVIDENCE' });
this.returnstatuscodeOptions.push({Text: 'CONFIRMED', Value: 'CONFIRMED' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetReturnService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetReturn = data;
        this.objMaster = { ...this.assetReturn };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetReturn): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
AssetId: obj.AssetId || 0,
AssetReturnScheduleId: obj.AssetReturnScheduleId || 0,
ReturnedAt:  obj.ReturnedAt || new Date(),
ReturnLocationId: obj.ReturnLocationId || 0,
ReceivedByUserId: obj.ReceivedByUserId || 0,
FinalMeasureReadingId: obj.FinalMeasureReadingId || 0,
ReturnInspectionId: obj.ReturnInspectionId || 0,
ReturnStatusCode: obj.ReturnStatusCode || '',
Remarks: obj.Remarks || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetReturns/create']);
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
    this.assetReturn = { ...this.objMaster };
    var obj  = this.assetReturn;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
AssetId: obj.AssetId || 0,
AssetReturnScheduleId: obj.AssetReturnScheduleId || 0,
ReturnedAt:  obj.ReturnedAt || new Date(),
ReturnLocationId: obj.ReturnLocationId || 0,
ReceivedByUserId: obj.ReceivedByUserId || 0,
FinalMeasureReadingId: obj.FinalMeasureReadingId || 0,
ReturnInspectionId: obj.ReturnInspectionId || 0,
ReturnStatusCode: obj.ReturnStatusCode || '',
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
AssetReturnScheduleId: formValues.AssetReturnScheduleId || 0,
ReturnedAt: formValues.ReturnedAt || null,
ReturnLocationId: formValues.ReturnLocationId || 0,
ReceivedByUserId: formValues.ReceivedByUserId || 0,
FinalMeasureReadingId: formValues.FinalMeasureReadingId || 0,
ReturnInspectionId: formValues.ReturnInspectionId || 0,
ReturnStatusCode: formValues.ReturnStatusCode || null,
Remarks: formValues.Remarks || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetReturn ; 
	
	  this.spinner.show(); 
    this.assetReturnService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetReturn +  'Details Updated sucessfully.');
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



