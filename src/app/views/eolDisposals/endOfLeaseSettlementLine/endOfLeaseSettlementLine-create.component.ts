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
import { IEndOfLeaseSettlementLine } from './endOfLeaseSettlementLine';
import { EndOfLeaseSettlementLineService } from './endOfLeaseSettlementLine.service';

@Component({
  selector: 'app-endOfLeaseSettlementLine-create',
  standalone: false,
  templateUrl: './endOfLeaseSettlementLine-create.component.html' ,
   providers: [ MessageService]
})
export class EndOfLeaseSettlementLineCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  endOfLeaseSettlementLine: IEndOfLeaseSettlementLine = null;
  endofleasesettlementidOptions: ISelectItem[] = [];
settlementchargetypeidOptions: ISelectItem[] = [];
sourcetypecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IEndOfLeaseSettlementLine = {} as IEndOfLeaseSettlementLine;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private endOfLeaseSettlementLineService: EndOfLeaseSettlementLineService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.endOfLeaseSettlementLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
EndOfLeaseSettlementId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
SettlementChargeTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SourceTypeCode: new FormControl('', [Validators.maxLength(20), ]), 
SourceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
Quantity: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RateAmount: new FormControl(0, []),
LineAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
WaivedAmount: new FormControl(0, []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create EndOfLeaseSettlementLine';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'EndOfLeaseSettlementId', 'end-of-lease-settlements',
      options => this.endofleasesettlementidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SettlementChargeTypeId', 'settlement-charge-types',
      options => this.settlementchargetypeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.sourcetypecodeOptions = this.loggedInUserService.getPicklistOptions('EndOfLeaseSettlementLineSourceTypeCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.endOfLeaseSettlementLineService.getById(this.selectedId).subscribe({
      next: data => {
        this.endOfLeaseSettlementLine = data;
        this.objMaster = { ...this.endOfLeaseSettlementLine };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IEndOfLeaseSettlementLine): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseSettlementId: obj.EndOfLeaseSettlementId || 0,
LineNo: obj.LineNo || 0,
SettlementChargeTypeId: obj.SettlementChargeTypeId || 0,
SourceTypeCode: obj.SourceTypeCode || '',
SourceId: obj.SourceId || 0,
Description: obj.Description || '',
Quantity: obj.Quantity || 0,
RateAmount: obj.RateAmount || 0,
LineAmount: obj.LineAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
WaivedAmount: obj.WaivedAmount || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/endOfLeaseSettlementLines/create']);
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
    this.endOfLeaseSettlementLine = { ...this.objMaster };
    var obj  = this.endOfLeaseSettlementLine;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseSettlementId: obj.EndOfLeaseSettlementId || 0,
LineNo: obj.LineNo || 0,
SettlementChargeTypeId: obj.SettlementChargeTypeId || 0,
SourceTypeCode: obj.SourceTypeCode || '',
SourceId: obj.SourceId || 0,
Description: obj.Description || '',
Quantity: obj.Quantity || 0,
RateAmount: obj.RateAmount || 0,
LineAmount: obj.LineAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
WaivedAmount: obj.WaivedAmount || 0,
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
     EndOfLeaseSettlementId: formValues.EndOfLeaseSettlementId || 0,
LineNo: formValues.LineNo || null,
SettlementChargeTypeId: formValues.SettlementChargeTypeId || 0,
SourceTypeCode: formValues.SourceTypeCode || null,
SourceId: formValues.SourceId || 0,
Description: formValues.Description || null,
Quantity: formValues.Quantity || 0,
RateAmount: formValues.RateAmount || 0,
LineAmount: formValues.LineAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
WaivedAmount: formValues.WaivedAmount || 0,
RecordStatus: formValues.RecordStatus || null,

    } as IEndOfLeaseSettlementLine ; 
	
	  this.spinner.show(); 
    this.endOfLeaseSettlementLineService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(EndOfLeaseSettlementLine +  'Details Updated sucessfully.');
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



