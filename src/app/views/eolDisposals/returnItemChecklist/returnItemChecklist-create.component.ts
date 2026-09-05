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
import { IReturnItemChecklist } from './returnItemChecklist';
import { ReturnItemChecklistService } from './returnItemChecklist.service';

@Component({
  selector: 'app-returnItemChecklist-create',
  standalone: false,
  templateUrl: './returnItemChecklist-create.component.html' ,
   providers: [ MessageService]
})
export class ReturnItemChecklistCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  returnItemChecklist: IReturnItemChecklist = null;
  assetreturnidOptions: ISelectItem[] = [];
conditioncodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IReturnItemChecklist = {} as IReturnItemChecklist;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private returnItemChecklistService: ReturnItemChecklistService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.returnItemChecklist };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetReturnId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
ItemCode: new FormControl('', [Validators.maxLength(20), ]), 
ItemDescription: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
ExpectedQuantity: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReturnedQuantity: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ConditionCode: new FormControl('', [Validators.maxLength(20), ]), 
ChargeableFlag: new FormControl(false, [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create ReturnItemChecklist';
    this.assetreturnidOptions.push({Text: 'AssetReturnId1', Value: 'AssetReturnId1' });
this.assetreturnidOptions.push({Text: 'AssetReturnId2', Value: 'AssetReturnId2' });
this.conditioncodeOptions = this.loggedInUserService.getPicklistOptions('ConditionCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.returnItemChecklistService.getById(this.selectedId).subscribe({
      next: data => {
        this.returnItemChecklist = data;
        this.objMaster = { ...this.returnItemChecklist };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IReturnItemChecklist): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetReturnId: obj.AssetReturnId || 0,
LineNo: obj.LineNo || 0,
ItemCode: obj.ItemCode || '',
ItemDescription: obj.ItemDescription || '',
ExpectedQuantity: obj.ExpectedQuantity || 0,
ReturnedQuantity: obj.ReturnedQuantity || 0,
ConditionCode: obj.ConditionCode || '',
ChargeableFlag:  obj.ChargeableFlag || false,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/returnItemChecklists/create']);
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
    this.returnItemChecklist = { ...this.objMaster };
    var obj  = this.returnItemChecklist;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetReturnId: obj.AssetReturnId || 0,
LineNo: obj.LineNo || 0,
ItemCode: obj.ItemCode || '',
ItemDescription: obj.ItemDescription || '',
ExpectedQuantity: obj.ExpectedQuantity || 0,
ReturnedQuantity: obj.ReturnedQuantity || 0,
ConditionCode: obj.ConditionCode || '',
ChargeableFlag:  obj.ChargeableFlag || false,
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
     AssetReturnId: formValues.AssetReturnId || 0,
LineNo: formValues.LineNo || null,
ItemCode: formValues.ItemCode || null,
ItemDescription: formValues.ItemDescription || null,
ExpectedQuantity: formValues.ExpectedQuantity || 0,
ReturnedQuantity: formValues.ReturnedQuantity || 0,
ConditionCode: formValues.ConditionCode || null,
ChargeableFlag: formValues.ChargeableFlag || false,
RecordStatus: formValues.RecordStatus || null,

    } as IReturnItemChecklist ; 
	
	  this.spinner.show(); 
    this.returnItemChecklistService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ReturnItemChecklist +  'Details Updated sucessfully.');
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



