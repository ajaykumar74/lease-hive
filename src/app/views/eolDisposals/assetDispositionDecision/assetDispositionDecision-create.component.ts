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
import { IAssetDispositionDecision } from './assetDispositionDecision';
import { AssetDispositionDecisionService } from './assetDispositionDecision.service';

@Component({
  selector: 'app-assetDispositionDecision-create',
  standalone: false,
  templateUrl: './assetDispositionDecision-create.component.html' ,
   providers: [ MessageService]
})
export class AssetDispositionDecisionCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetDispositionDecision: IAssetDispositionDecision = null;
  endofleasecaseidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
dispositionmethodidOptions: ISelectItem[] = [];
referencevaluationidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
approvedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetDispositionDecision = {} as IAssetDispositionDecision;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetDispositionDecisionService: AssetDispositionDecisionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetDispositionDecision };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
EndOfLeaseCaseId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DispositionMethodId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DecisionDate: new FormControl(new Date(), [Validators.required]),
ReferenceValuationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
TargetAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
Reason: new FormControl('', [Validators.maxLength(100), ]), 
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ApprovedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovedAt: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create AssetDispositionDecision';
    this.endofleasecaseidOptions.push({Text: 'EndOfLeaseCaseId1', Value: 'EndOfLeaseCaseId1' });
this.endofleasecaseidOptions.push({Text: 'EndOfLeaseCaseId2', Value: 'EndOfLeaseCaseId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.dispositionmethodidOptions.push({Text: 'DispositionMethodId1', Value: 'DispositionMethodId1' });
this.dispositionmethodidOptions.push({Text: 'DispositionMethodId2', Value: 'DispositionMethodId2' });
this.referencevaluationidOptions.push({Text: 'ReferenceValuationId1', Value: 'ReferenceValuationId1' });
this.referencevaluationidOptions.push({Text: 'ReferenceValuationId2', Value: 'ReferenceValuationId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.statuscodeOptions.push({Text: 'PROPOSED', Value: 'PROPOSED' });
this.statuscodeOptions.push({Text: 'APPROVAL', Value: 'APPROVAL' });
this.statuscodeOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.statuscodeOptions.push({Text: 'REJECTED', Value: 'REJECTED' });
this.statuscodeOptions.push({Text: 'EXECUTED', Value: 'EXECUTED' });
this.approvedbyuseridOptions.push({Text: 'ApprovedByUserId1', Value: 'ApprovedByUserId1' });
this.approvedbyuseridOptions.push({Text: 'ApprovedByUserId2', Value: 'ApprovedByUserId2' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetDispositionDecisionService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetDispositionDecision = data;
        this.objMaster = { ...this.assetDispositionDecision };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetDispositionDecision): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
AssetId: obj.AssetId || 0,
DispositionMethodId: obj.DispositionMethodId || 0,
DecisionDate:  obj.DecisionDate || new Date(),
ReferenceValuationId: obj.ReferenceValuationId || 0,
TargetAmount: obj.TargetAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
Reason: obj.Reason || '',
StatusCode: obj.StatusCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAt:  obj.ApprovedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetDispositionDecisions/create']);
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
    this.assetDispositionDecision = { ...this.objMaster };
    var obj  = this.assetDispositionDecision;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
AssetId: obj.AssetId || 0,
DispositionMethodId: obj.DispositionMethodId || 0,
DecisionDate:  obj.DecisionDate || new Date(),
ReferenceValuationId: obj.ReferenceValuationId || 0,
TargetAmount: obj.TargetAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
Reason: obj.Reason || '',
StatusCode: obj.StatusCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAt:  obj.ApprovedAt || new Date(),
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
     EndOfLeaseCaseId: formValues.EndOfLeaseCaseId || 0,
AssetId: formValues.AssetId || 0,
DispositionMethodId: formValues.DispositionMethodId || 0,
DecisionDate: formValues.DecisionDate || null,
ReferenceValuationId: formValues.ReferenceValuationId || 0,
TargetAmount: formValues.TargetAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
Reason: formValues.Reason || null,
StatusCode: formValues.StatusCode || null,
ApprovedByUserId: formValues.ApprovedByUserId || 0,
ApprovedAt: formValues.ApprovedAt || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetDispositionDecision ; 
	
	  this.spinner.show(); 
    this.assetDispositionDecisionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetDispositionDecision +  'Details Updated sucessfully.');
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



