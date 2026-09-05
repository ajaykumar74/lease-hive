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
import { IDisposalValuationReference } from './disposalValuationReference';
import { DisposalValuationReferenceService } from './disposalValuationReference.service';

@Component({
  selector: 'app-disposalValuationReference-create',
  standalone: false,
  templateUrl: './disposalValuationReference-create.component.html' ,
   providers: [ MessageService]
})
export class DisposalValuationReferenceCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  disposalValuationReference: IDisposalValuationReference = null;
  disposalcaseidOptions: ISelectItem[] = [];
assetvaluationidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDisposalValuationReference = {} as IDisposalValuationReference;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private disposalValuationReferenceService: DisposalValuationReferenceService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.disposalValuationReference };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
DisposalCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetValuationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReferenceDate: new FormControl(new Date(), [Validators.required]),
MarketValueAmount: new FormControl(0, []),
ReserveAmount: new FormControl(0, []),
TargetAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 

    });
    this.Caption = 'Create DisposalValuationReference';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'DisposalCaseId', 'disposal-cases',
      options => this.disposalcaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.assetvaluationidOptions.push({Text: 'AssetValuationId1', Value: 'AssetValuationId1' });
this.assetvaluationidOptions.push({Text: 'AssetValuationId2', Value: 'AssetValuationId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.disposalValuationReferenceService.getById(this.selectedId).subscribe({
      next: data => {
        this.disposalValuationReference = data;
        this.objMaster = { ...this.disposalValuationReference };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDisposalValuationReference): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetValuationId: obj.AssetValuationId || 0,
ReferenceDate:  obj.ReferenceDate || new Date(),
MarketValueAmount: obj.MarketValueAmount || 0,
ReserveAmount: obj.ReserveAmount || 0,
TargetAmount: obj.TargetAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
Remarks: obj.Remarks || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/disposalValuationReferences/create']);
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
    this.disposalValuationReference = { ...this.objMaster };
    var obj  = this.disposalValuationReference;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetValuationId: obj.AssetValuationId || 0,
ReferenceDate:  obj.ReferenceDate || new Date(),
MarketValueAmount: obj.MarketValueAmount || 0,
ReserveAmount: obj.ReserveAmount || 0,
TargetAmount: obj.TargetAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
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
     DisposalCaseId: formValues.DisposalCaseId || 0,
AssetValuationId: formValues.AssetValuationId || 0,
ReferenceDate: formValues.ReferenceDate || null,
MarketValueAmount: formValues.MarketValueAmount || 0,
ReserveAmount: formValues.ReserveAmount || 0,
TargetAmount: formValues.TargetAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
Remarks: formValues.Remarks || null,
RecordStatus: 'Active',

    } as IDisposalValuationReference ; 
	
	  this.spinner.show(); 
    this.disposalValuationReferenceService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(DisposalValuationReference +  'Details Updated sucessfully.');
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



