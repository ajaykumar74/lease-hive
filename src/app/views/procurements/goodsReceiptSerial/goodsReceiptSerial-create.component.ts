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
import { IGoodsReceiptSerial } from './goodsReceiptSerial';
import { GoodsReceiptSerialService } from './goodsReceiptSerial.service';

@Component({
  selector: 'app-goodsReceiptSerial-create',
  standalone: false,
  templateUrl: './goodsReceiptSerial-create.component.html' ,
   providers: [ MessageService]
})
export class GoodsReceiptSerialCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  goodsReceiptSerial: IGoodsReceiptSerial = null;
  goodsreceiptlineidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
acceptancecodeOptions: ISelectItem[] = [];
conditioncodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IGoodsReceiptSerial = {} as IGoodsReceiptSerial;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private goodsReceiptSerialService: GoodsReceiptSerialService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.goodsReceiptSerial };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
GoodsReceiptLineId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SerialNo: new FormControl('', [Validators.required, Validators.maxLength(120), ]),
ManufacturerSerialNo: new FormControl('', [Validators.maxLength(120), ]), 
IMEIOrIdentifier: new FormControl('', [Validators.maxLength(120), ]), 
AssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AcceptanceCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ConditionCode: new FormControl('', [Validators.maxLength(20), ]), 

    });
    this.Caption = 'Create GoodsReceiptSerial';
    this.goodsreceiptlineidOptions.push({Text: 'GoodsReceiptLineId1', Value: 'GoodsReceiptLineId1' });
this.goodsreceiptlineidOptions.push({Text: 'GoodsReceiptLineId2', Value: 'GoodsReceiptLineId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.acceptancecodeOptions.push({Text: 'ACCEPTED', Value: 'ACCEPTED' });
this.acceptancecodeOptions.push({Text: 'REJECTED', Value: 'REJECTED' });
this.acceptancecodeOptions.push({Text: 'HOLD', Value: 'HOLD' });
this.conditioncodeOptions.push({Text: 'NEW', Value: 'NEW' });
this.conditioncodeOptions.push({Text: 'DAMAGED', Value: 'DAMAGED' });
this.conditioncodeOptions.push({Text: 'OTHER', Value: 'OTHER' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.goodsReceiptSerialService.getById(this.selectedId).subscribe({
      next: data => {
        this.goodsReceiptSerial = data;
        this.objMaster = { ...this.goodsReceiptSerial };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IGoodsReceiptSerial): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  GoodsReceiptLineId: obj.GoodsReceiptLineId || 0,
SerialNo: obj.SerialNo || '',
ManufacturerSerialNo: obj.ManufacturerSerialNo || '',
IMEIOrIdentifier: obj.IMEIOrIdentifier || '',
AssetId: obj.AssetId || 0,
AcceptanceCode: obj.AcceptanceCode || '',
ConditionCode: obj.ConditionCode || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/goodsReceiptSerials/create']);
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
    this.goodsReceiptSerial = { ...this.objMaster };
    var obj  = this.goodsReceiptSerial;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  GoodsReceiptLineId: obj.GoodsReceiptLineId || 0,
SerialNo: obj.SerialNo || '',
ManufacturerSerialNo: obj.ManufacturerSerialNo || '',
IMEIOrIdentifier: obj.IMEIOrIdentifier || '',
AssetId: obj.AssetId || 0,
AcceptanceCode: obj.AcceptanceCode || '',
ConditionCode: obj.ConditionCode || '',
 
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
SerialNo: formValues.SerialNo || null,
ManufacturerSerialNo: formValues.ManufacturerSerialNo || null,
IMEIOrIdentifier: formValues.IMEIOrIdentifier || null,
AssetId: formValues.AssetId || 0,
AcceptanceCode: formValues.AcceptanceCode || null,
ConditionCode: formValues.ConditionCode || null,

    } as IGoodsReceiptSerial ; 
	
	  this.spinner.show(); 
    this.goodsReceiptSerialService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(GoodsReceiptSerial +  'Details Updated sucessfully.');
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



