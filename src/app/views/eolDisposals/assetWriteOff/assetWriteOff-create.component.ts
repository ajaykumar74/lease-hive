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
import { IAssetWriteOff } from './assetWriteOff';
import { AssetWriteOffService } from './assetWriteOff.service';

@Component({
  selector: 'app-assetWriteOff-create',
  standalone: false,
  templateUrl: './assetWriteOff-create.component.html' ,
   providers: [ MessageService]
})
export class AssetWriteOffCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetWriteOff: IAssetWriteOff = null;
  disposalcaseidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
writeoffreasoncodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
insuranceclaimidOptions: ISelectItem[] = [];
approvedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetWriteOff = {} as IAssetWriteOff;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetWriteOffService: AssetWriteOffService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetWriteOff };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
DisposalCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
WriteOffDate: new FormControl(new Date(), [Validators.required]),
WriteOffReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceBookValue: new FormControl(0, []),
RecoveryAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
InsuranceClaimId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovedByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovedAt: new FormControl(new Date(), [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create AssetWriteOff';
    this.disposalcaseidOptions.push({Text: 'DisposalCaseId1', Value: 'DisposalCaseId1' });
this.disposalcaseidOptions.push({Text: 'DisposalCaseId2', Value: 'DisposalCaseId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.writeoffreasoncodeOptions.push({Text: 'TOTAL_LOSS', Value: 'TOTAL_LOSS' });
this.writeoffreasoncodeOptions.push({Text: 'OBSOLETE', Value: 'OBSOLETE' });
this.writeoffreasoncodeOptions.push({Text: 'UNEconomic', Value: 'UNEconomic' });
this.writeoffreasoncodeOptions.push({Text: 'LOST', Value: 'LOST' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.insuranceclaimidOptions.push({Text: 'InsuranceClaimId1', Value: 'InsuranceClaimId1' });
this.insuranceclaimidOptions.push({Text: 'InsuranceClaimId2', Value: 'InsuranceClaimId2' });
this.approvedbyuseridOptions.push({Text: 'ApprovedByUserId1', Value: 'ApprovedByUserId1' });
this.approvedbyuseridOptions.push({Text: 'ApprovedByUserId2', Value: 'ApprovedByUserId2' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetWriteOffService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetWriteOff = data;
        this.objMaster = { ...this.assetWriteOff };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetWriteOff): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetId: obj.AssetId || 0,
WriteOffDate:  obj.WriteOffDate || new Date(),
WriteOffReasonCode: obj.WriteOffReasonCode || '',
ReferenceBookValue: obj.ReferenceBookValue || 0,
RecoveryAmount: obj.RecoveryAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
InsuranceClaimId: obj.InsuranceClaimId || 0,
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAt:  obj.ApprovedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetWriteOffs/create']);
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
    this.assetWriteOff = { ...this.objMaster };
    var obj  = this.assetWriteOff;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetId: obj.AssetId || 0,
WriteOffDate:  obj.WriteOffDate || new Date(),
WriteOffReasonCode: obj.WriteOffReasonCode || '',
ReferenceBookValue: obj.ReferenceBookValue || 0,
RecoveryAmount: obj.RecoveryAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
InsuranceClaimId: obj.InsuranceClaimId || 0,
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
     DisposalCaseId: formValues.DisposalCaseId || 0,
AssetId: formValues.AssetId || 0,
WriteOffDate: formValues.WriteOffDate || null,
WriteOffReasonCode: formValues.WriteOffReasonCode || null,
ReferenceBookValue: formValues.ReferenceBookValue || 0,
RecoveryAmount: formValues.RecoveryAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
InsuranceClaimId: formValues.InsuranceClaimId || 0,
ApprovedByUserId: formValues.ApprovedByUserId || 0,
ApprovedAt: formValues.ApprovedAt || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetWriteOff ; 
	
	  this.spinner.show(); 
    this.assetWriteOffService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetWriteOff +  'Details Updated sucessfully.');
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



