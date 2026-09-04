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
import { ISettlementChargeType } from './settlementChargeType';
import { SettlementChargeTypeService } from './settlementChargeType.service';

@Component({
  selector: 'app-settlementChargeType-create',
  standalone: false,
  templateUrl: './settlementChargeType-create.component.html' ,
   providers: [ MessageService]
})
export class SettlementChargeTypeCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  settlementChargeType: ISettlementChargeType = null;
  directioncodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ISettlementChargeType = {} as ISettlementChargeType;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private settlementChargeTypeService: SettlementChargeTypeService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.settlementChargeType };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ChargeTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ChargeTypeName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
DirectionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TaxableFlag: new FormControl(false, [Validators.required]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create SettlementChargeType';
    this.directioncodeOptions.push({Text: 'CHARGE', Value: 'CHARGE' });
this.directioncodeOptions.push({Text: 'CREDIT', Value: 'CREDIT' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.settlementChargeTypeService.getById(this.selectedId).subscribe({
      next: data => {
        this.settlementChargeType = data;
        this.objMaster = { ...this.settlementChargeType };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ISettlementChargeType): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ChargeTypeCode: obj.ChargeTypeCode || '',
ChargeTypeName: obj.ChargeTypeName || '',
DirectionCode: obj.DirectionCode || '',
TaxableFlag:  obj.TaxableFlag || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/settlementChargeTypes/create']);
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
    this.settlementChargeType = { ...this.objMaster };
    var obj  = this.settlementChargeType;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ChargeTypeCode: obj.ChargeTypeCode || '',
ChargeTypeName: obj.ChargeTypeName || '',
DirectionCode: obj.DirectionCode || '',
TaxableFlag:  obj.TaxableFlag || false,
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
     ChargeTypeCode: formValues.ChargeTypeCode || null,
ChargeTypeName: formValues.ChargeTypeName || null,
DirectionCode: formValues.DirectionCode || null,
TaxableFlag: formValues.TaxableFlag || false,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as ISettlementChargeType ; 
	
	  this.spinner.show(); 
    this.settlementChargeTypeService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(SettlementChargeType +  'Details Updated sucessfully.');
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



