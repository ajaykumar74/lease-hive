import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
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
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
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

    });
    this.Caption = 'Create AssetReturn';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'EndOfLeaseCaseId', 'end-of-lease-cases',
      options => this.endofleasecaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetReturnScheduleId', 'asset-return-schedules',
      options => this.assetreturnscheduleidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId","EndOfLeaseCaseId":"EndOfLeaseCaseId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'ReturnLocationId', 'locations',
      options => this.returnlocationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ReceivedByUserId', 'application-users',
      options => this.receivedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'FinalMeasureReadingId', 'asset-measure-readings',
      options => this.finalmeasurereadingidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ReturnInspectionId', 'asset-inspections',
      options => this.returninspectionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.returnstatuscodeOptions = this.loggedInUserService.getPicklistOptions('ReturnStatusCode');

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
RecordStatus: 'Active',

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



