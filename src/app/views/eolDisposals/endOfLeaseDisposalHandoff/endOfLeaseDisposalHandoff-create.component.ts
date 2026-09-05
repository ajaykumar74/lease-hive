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
import { IEndOfLeaseDisposalHandoff } from './endOfLeaseDisposalHandoff';
import { EndOfLeaseDisposalHandoffService } from './endOfLeaseDisposalHandoff.service';

@Component({
  selector: 'app-endOfLeaseDisposalHandoff-create',
  standalone: false,
  templateUrl: './endOfLeaseDisposalHandoff-create.component.html' ,
   providers: [ MessageService]
})
export class EndOfLeaseDisposalHandoffCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  endOfLeaseDisposalHandoff: IEndOfLeaseDisposalHandoff = null;
  sourcetypecodeOptions: ISelectItem[] = [];
targetmodulecodeOptions: ISelectItem[] = [];
handofftypecodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IEndOfLeaseDisposalHandoff = {} as IEndOfLeaseDisposalHandoff;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private endOfLeaseDisposalHandoffService: EndOfLeaseDisposalHandoffService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.endOfLeaseDisposalHandoff };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
SourceTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SourceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TargetModuleCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
HandoffTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RequestedAt: new FormControl(new Date(), [Validators.required]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TargetReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CompletedAt: new FormControl(new Date(), []),
FailureReason: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create EndOfLeaseDisposalHandoff';
    this.sourcetypecodeOptions = this.loggedInUserService.getPicklistOptions('EndOfLeaseDisposalHandoffSourceTypeCode');
this.targetmodulecodeOptions = this.loggedInUserService.getPicklistOptions('EndOfLeaseDisposalHandoffTargetModuleCode');
this.handofftypecodeOptions = this.loggedInUserService.getPicklistOptions('EndOfLeaseDisposalHandoffHandoffTypeCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('EndOfLeaseDisposalHandoffStatusCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.endOfLeaseDisposalHandoffService.getById(this.selectedId).subscribe({
      next: data => {
        this.endOfLeaseDisposalHandoff = data;
        this.objMaster = { ...this.endOfLeaseDisposalHandoff };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IEndOfLeaseDisposalHandoff): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SourceTypeCode: obj.SourceTypeCode || '',
SourceId: obj.SourceId || 0,
TargetModuleCode: obj.TargetModuleCode || '',
HandoffTypeCode: obj.HandoffTypeCode || '',
RequestedAt:  obj.RequestedAt || new Date(),
StatusCode: obj.StatusCode || '',
TargetReferenceId: obj.TargetReferenceId || 0,
CompletedAt:  obj.CompletedAt || new Date(),
FailureReason: obj.FailureReason || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/endOfLeaseDisposalHandoffs/create']);
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
    this.endOfLeaseDisposalHandoff = { ...this.objMaster };
    var obj  = this.endOfLeaseDisposalHandoff;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SourceTypeCode: obj.SourceTypeCode || '',
SourceId: obj.SourceId || 0,
TargetModuleCode: obj.TargetModuleCode || '',
HandoffTypeCode: obj.HandoffTypeCode || '',
RequestedAt:  obj.RequestedAt || new Date(),
StatusCode: obj.StatusCode || '',
TargetReferenceId: obj.TargetReferenceId || 0,
CompletedAt:  obj.CompletedAt || new Date(),
FailureReason: obj.FailureReason || '',
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     SourceTypeCode: formValues.SourceTypeCode || null,
SourceId: formValues.SourceId || 0,
TargetModuleCode: formValues.TargetModuleCode || null,
HandoffTypeCode: formValues.HandoffTypeCode || null,
RequestedAt: formValues.RequestedAt || null,
StatusCode: formValues.StatusCode || null,
TargetReferenceId: formValues.TargetReferenceId || 0,
CompletedAt: formValues.CompletedAt || null,
FailureReason: formValues.FailureReason || null,
RecordStatus: formValues.RecordStatus || null,

    } as IEndOfLeaseDisposalHandoff ; 
	
	  this.spinner.show(); 
    this.endOfLeaseDisposalHandoffService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(EndOfLeaseDisposalHandoff +  'Details Updated sucessfully.');
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



