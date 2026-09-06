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
import { IGoodsReceiptStatus } from './goodsReceiptStatus';
import { GoodsReceiptStatusService } from './goodsReceiptStatus.service';

@Component({
  selector: 'app-goodsReceiptStatus-create',
  standalone: false,
  templateUrl: './goodsReceiptStatus-create.component.html' ,
   providers: [ MessageService]
})
export class GoodsReceiptStatusCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  goodsReceiptStatus: IGoodsReceiptStatus = null;
  recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IGoodsReceiptStatus = {} as IGoodsReceiptStatus;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private goodsReceiptStatusService: GoodsReceiptStatusService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.goodsReceiptStatus };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StatusName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
IsTerminal: new FormControl(false, [Validators.required]),
SortOrder: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create GoodsReceiptStatus';
    this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.goodsReceiptStatusService.getById(this.selectedId).subscribe({
      next: data => {
        this.goodsReceiptStatus = data;
        this.objMaster = { ...this.goodsReceiptStatus };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IGoodsReceiptStatus): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
IsTerminal:  obj.IsTerminal || false,
SortOrder: obj.SortOrder || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/goodsReceiptStatuss/create']);
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
    this.goodsReceiptStatus = { ...this.objMaster };
    var obj  = this.goodsReceiptStatus;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
IsTerminal:  obj.IsTerminal || false,
SortOrder: obj.SortOrder || 0,
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     StatusCode: formValues.StatusCode || null,
StatusName: formValues.StatusName || null,
IsTerminal: formValues.IsTerminal || false,
SortOrder: formValues.SortOrder || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IGoodsReceiptStatus ; 
	
	  this.spinner.show(); 
    this.goodsReceiptStatusService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(GoodsReceiptStatus +  'Details Updated sucessfully.');
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



