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
import { IReceiptInspection } from './receiptInspection';
import { ReceiptInspectionService } from './receiptInspection.service';

@Component({
  selector: 'app-receiptInspection-create',
  standalone: false,
  templateUrl: './receiptInspection-create.component.html' ,
   providers: [ MessageService]
})
export class ReceiptInspectionCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  receiptInspection: IReceiptInspection = null;
  goodsreceiptlineidOptions: ISelectItem[] = [];
goodsreceiptserialidOptions: ISelectItem[] = [];
inspectoruseridOptions: ISelectItem[] = [];
resultcodeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IReceiptInspection = {} as IReceiptInspection;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private receiptInspectionService: ReceiptInspectionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.receiptInspection };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
GoodsReceiptLineId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
GoodsReceiptSerialId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
InspectionDateTime: new FormControl(new Date(), [Validators.required]),
InspectorUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ResultCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ChecklistJson: new FormControl('', [Validators.maxLength(8000), ]), 
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
DocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create ReceiptInspection';
    this.goodsreceiptlineidOptions.push({Text: 'GoodsReceiptLineId1', Value: 'GoodsReceiptLineId1' });
this.goodsreceiptlineidOptions.push({Text: 'GoodsReceiptLineId2', Value: 'GoodsReceiptLineId2' });
this.goodsreceiptserialidOptions.push({Text: 'GoodsReceiptSerialId1', Value: 'GoodsReceiptSerialId1' });
this.goodsreceiptserialidOptions.push({Text: 'GoodsReceiptSerialId2', Value: 'GoodsReceiptSerialId2' });
this.inspectoruseridOptions.push({Text: 'InspectorUserId1', Value: 'InspectorUserId1' });
this.inspectoruseridOptions.push({Text: 'InspectorUserId2', Value: 'InspectorUserId2' });
this.resultcodeOptions.push({Text: 'PASS', Value: 'PASS' });
this.resultcodeOptions.push({Text: 'FAIL', Value: 'FAIL' });
this.resultcodeOptions.push({Text: 'HOLD', Value: 'HOLD' });
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.receiptInspectionService.getById(this.selectedId).subscribe({
      next: data => {
        this.receiptInspection = data;
        this.objMaster = { ...this.receiptInspection };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IReceiptInspection): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  GoodsReceiptLineId: obj.GoodsReceiptLineId || 0,
GoodsReceiptSerialId: obj.GoodsReceiptSerialId || 0,
InspectionDateTime:  obj.InspectionDateTime || new Date(),
InspectorUserId: obj.InspectorUserId || 0,
ResultCode: obj.ResultCode || '',
ChecklistJson: obj.ChecklistJson || '',
Remarks: obj.Remarks || '',
DocumentId: obj.DocumentId || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/receiptInspections/create']);
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
    this.receiptInspection = { ...this.objMaster };
    var obj  = this.receiptInspection;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  GoodsReceiptLineId: obj.GoodsReceiptLineId || 0,
GoodsReceiptSerialId: obj.GoodsReceiptSerialId || 0,
InspectionDateTime:  obj.InspectionDateTime || new Date(),
InspectorUserId: obj.InspectorUserId || 0,
ResultCode: obj.ResultCode || '',
ChecklistJson: obj.ChecklistJson || '',
Remarks: obj.Remarks || '',
DocumentId: obj.DocumentId || 0,
 
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
     GoodsReceiptLineId: formValues.GoodsReceiptLineId || 0,
GoodsReceiptSerialId: formValues.GoodsReceiptSerialId || 0,
InspectionDateTime: formValues.InspectionDateTime || null,
InspectorUserId: formValues.InspectorUserId || 0,
ResultCode: formValues.ResultCode || null,
ChecklistJson: formValues.ChecklistJson || null,
Remarks: formValues.Remarks || null,
DocumentId: formValues.DocumentId || 0,

    } as IReceiptInspection ; 
	
	  this.spinner.show(); 
    this.receiptInspectionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ReceiptInspection +  'Details Updated sucessfully.');
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



