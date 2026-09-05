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
import { IDisposalCase } from './disposalCase';
import { DisposalCaseService } from './disposalCase.service';

@Component({
  selector: 'app-disposalCase-create',
  standalone: false,
  templateUrl: './disposalCase-create.component.html' ,
   providers: [ MessageService]
})
export class DisposalCaseCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  disposalCase: IDisposalCase = null;
  assetdispositiondecisionidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
organisationidOptions: ISelectItem[] = [];
dispositionmethodidOptions: ISelectItem[] = [];
assignedtouseridOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDisposalCase = {} as IDisposalCase;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private disposalCaseService: DisposalCaseService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.disposalCase };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetDispositionDecisionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DispositionMethodId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OpenedAt: new FormControl(new Date(), [Validators.required]),
TargetCompletionDate: new FormControl(new Date(), []),
AssignedToUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ClosedAt: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create DisposalCase';
    this.assetdispositiondecisionidOptions.push({Text: 'AssetDispositionDecisionId1', Value: 'AssetDispositionDecisionId1' });
this.assetdispositiondecisionidOptions.push({Text: 'AssetDispositionDecisionId2', Value: 'AssetDispositionDecisionId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.organisationidOptions.push({Text: 'OrganisationId1', Value: 'OrganisationId1' });
this.organisationidOptions.push({Text: 'OrganisationId2', Value: 'OrganisationId2' });
this.dispositionmethodidOptions.push({Text: 'DispositionMethodId1', Value: 'DispositionMethodId1' });
this.dispositionmethodidOptions.push({Text: 'DispositionMethodId2', Value: 'DispositionMethodId2' });
this.assignedtouseridOptions.push({Text: 'AssignedToUserId1', Value: 'AssignedToUserId1' });
this.assignedtouseridOptions.push({Text: 'AssignedToUserId2', Value: 'AssignedToUserId2' });
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('DisposalCaseStatusCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.disposalCaseService.getById(this.selectedId).subscribe({
      next: data => {
        this.disposalCase = data;
        this.objMaster = { ...this.disposalCase };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDisposalCase): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetDispositionDecisionId: obj.AssetDispositionDecisionId || 0,
AssetId: obj.AssetId || 0,
OrganisationId: obj.OrganisationId || 0,
DispositionMethodId: obj.DispositionMethodId || 0,
OpenedAt:  obj.OpenedAt || new Date(),
TargetCompletionDate:  obj.TargetCompletionDate || new Date(),
AssignedToUserId: obj.AssignedToUserId || 0,
StatusCode: obj.StatusCode || '',
ClosedAt:  obj.ClosedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/disposalCases/create']);
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
    this.disposalCase = { ...this.objMaster };
    var obj  = this.disposalCase;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetDispositionDecisionId: obj.AssetDispositionDecisionId || 0,
AssetId: obj.AssetId || 0,
OrganisationId: obj.OrganisationId || 0,
DispositionMethodId: obj.DispositionMethodId || 0,
OpenedAt:  obj.OpenedAt || new Date(),
TargetCompletionDate:  obj.TargetCompletionDate || new Date(),
AssignedToUserId: obj.AssignedToUserId || 0,
StatusCode: obj.StatusCode || '',
ClosedAt:  obj.ClosedAt || new Date(),
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
     AssetDispositionDecisionId: formValues.AssetDispositionDecisionId || 0,
AssetId: formValues.AssetId || 0,
OrganisationId: formValues.OrganisationId || 0,
DispositionMethodId: formValues.DispositionMethodId || 0,
OpenedAt: formValues.OpenedAt || null,
TargetCompletionDate: formValues.TargetCompletionDate || null,
AssignedToUserId: formValues.AssignedToUserId || 0,
StatusCode: formValues.StatusCode || null,
ClosedAt: formValues.ClosedAt || null,
RecordStatus: formValues.RecordStatus || null,

    } as IDisposalCase ; 
	
	  this.spinner.show(); 
    this.disposalCaseService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(DisposalCase +  'Details Updated sucessfully.');
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



