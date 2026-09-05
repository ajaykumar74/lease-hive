import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-settlementChargeType-edit',
  standalone: false,
  templateUrl: './settlementChargeType-edit.component.html',
  providers: [ MessageService]
})
export class SettlementChargeTypeEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  settlementChargeType: ISettlementChargeType = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  directioncodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ISettlementChargeType = {} as ISettlementChargeType;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private settlementChargeTypeService: SettlementChargeTypeService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.settlementChargeType };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ChargeTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ChargeTypeName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
DirectionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TaxableFlag: new FormControl(false, [Validators.required]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.directioncodeOptions = this.loggedInUserService.getPicklistOptions('DirectionCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.settlementChargeTypeService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.settlementChargeType = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.settlementChargeType };
        this.populateUI(this.settlementChargeType);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "SettlementChargeType Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/configuration/settlement-charge-types/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     ChargeTypeCode:  formValues.ChargeTypeCode || null,
ChargeTypeName:  formValues.ChargeTypeName || null,
DirectionCode:  formValues.DirectionCode || null,
TaxableFlag:  formValues.TaxableFlag || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as ISettlementChargeType ;
	
	this.spinner.show();  	   
    this.settlementChargeTypeService.update(this.settlementChargeType.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(SettlementChargeType +  'Details Updated sucessfully.');
		//this.editForm.reset();
		this._location.back();
      },
      error: err => { 
       this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide();}
    });
  }
}
