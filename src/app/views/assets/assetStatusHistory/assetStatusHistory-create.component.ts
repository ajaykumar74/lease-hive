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
import { IAssetStatusHistory } from './assetStatusHistory';
import { AssetStatusHistoryService } from './assetStatusHistory.service';

@Component({
  selector: 'app-assetStatusHistory-create',
  standalone: false,
  templateUrl: './assetStatusHistory-create.component.html' ,
   providers: [ MessageService]
})
export class AssetStatusHistoryCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetStatusHistory: IAssetStatusHistory = null;
  fromstatusidOptions: ISelectItem[] = [];
tostatusidOptions: ISelectItem[] = [];
reasoncodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetStatusHistory = {} as IAssetStatusHistory;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetStatusHistoryService: AssetStatusHistoryService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetStatusHistory };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
FromStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ToStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Remarks: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.fromstatusidOptions.push({Text: 'Status1', Value: 'Status1' });
this.fromstatusidOptions.push({Text: 'Status', Value: 'Status' });
this.tostatusidOptions.push({Text: 'Status1', Value: 'Status1' });
this.tostatusidOptions.push({Text: 'Status', Value: 'Status' });
this.reasoncodeOptions.push({Text: 'StatusChange1', Value: 'StatusChange1' });
this.reasoncodeOptions.push({Text: 'StatusChange2', Value: 'StatusChange2' });
this.recordstatusOptions.push({Text: '', Value: '' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetStatusHistoryService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetStatusHistory = data;
        this.objMaster = { ...this.assetStatusHistory };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetStatusHistory): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FromStatusId: obj.FromStatusId || 0,
ToStatusId: obj.ToStatusId || 0,
ReasonCode: obj.ReasonCode || '',
Remarks: obj.Remarks || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetStatusHistorys/create']);
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
    this.assetStatusHistory = { ...this.objMaster };
    var obj  = this.assetStatusHistory;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FromStatusId: obj.FromStatusId || 0,
ToStatusId: obj.ToStatusId || 0,
ReasonCode: obj.ReasonCode || '',
Remarks: obj.Remarks || '',
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
     FromStatusId: formValues.FromStatusId || 0,
ToStatusId: formValues.ToStatusId || 0,
ReasonCode: formValues.ReasonCode || null,
Remarks: formValues.Remarks || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetStatusHistory ; 
	
	  this.spinner.show(); 
    this.assetStatusHistoryService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetStatusHistory +  'Details Updated sucessfully.');
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



