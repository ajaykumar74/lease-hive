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
import { IContractAmendmentChange } from './contractAmendmentChange';
import { ContractAmendmentChangeService } from './contractAmendmentChange.service';


@Component({
  selector: 'app-contractAmendmentChange-edit',
  standalone: false,
  templateUrl: './contractAmendmentChange-edit.component.html',
  providers: [ MessageService]
})
export class ContractAmendmentChangeEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  contractAmendmentChange: IContractAmendmentChange = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractamendmentidOptions: ISelectItem[] = [];
changesectioncodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IContractAmendmentChange = {} as IContractAmendmentChange;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private contractAmendmentChangeService: ContractAmendmentChangeService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.contractAmendmentChange };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ContractAmendmentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ChangeSectionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceType: new FormControl('', [Validators.maxLength(30), ]), 
ReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
FieldName: new FormControl('', [Validators.maxLength(100), ]), 
OldValue: new FormControl('', [Validators.maxLength(8000), ]), 
NewValue: new FormControl('', [Validators.maxLength(8000), ]), 
ChangeSummary: new FormControl('', [Validators.required, Validators.maxLength(500), ]),

    });

   this.contractamendmentidOptions.push({Text: 'ContractAmendmentId1', Value: 'ContractAmendmentId1' });
this.contractamendmentidOptions.push({Text: 'ContractAmendmentId2', Value: 'ContractAmendmentId2' });
this.changesectioncodeOptions.push({Text: 'TERMS', Value: 'TERMS' });
this.changesectioncodeOptions.push({Text: 'ASSET', Value: 'ASSET' });
this.changesectioncodeOptions.push({Text: 'PARTY', Value: 'PARTY' });
this.changesectioncodeOptions.push({Text: 'SCHEDULE', Value: 'SCHEDULE' });
this.changesectioncodeOptions.push({Text: 'CHARGE', Value: 'CHARGE' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.contractAmendmentChangeService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.contractAmendmentChange = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.contractAmendmentChange };
        this.populateUI(this.contractAmendmentChange);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IContractAmendmentChange): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractAmendmentId: obj.ContractAmendmentId || 0,
ChangeSectionCode: obj.ChangeSectionCode || '',
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
FieldName: obj.FieldName || '',
OldValue: obj.OldValue || '',
NewValue: obj.NewValue || '',
ChangeSummary: obj.ChangeSummary || '',
 
      }
    );
   
	 this.Caption = "ContractAmendmentChange Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractAmendmentChange/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.contractAmendmentChange = { ...this.objMaster };
	var obj  = this.contractAmendmentChange;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractAmendmentId: obj.ContractAmendmentId || 0,
ChangeSectionCode: obj.ChangeSectionCode || '',
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
FieldName: obj.FieldName || '',
OldValue: obj.OldValue || '',
NewValue: obj.NewValue || '',
ChangeSummary: obj.ChangeSummary || '',
 
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
     ContractAmendmentId:  formValues.ContractAmendmentId || null,
ChangeSectionCode:  formValues.ChangeSectionCode || null,
ReferenceType:  formValues.ReferenceType || null,
ReferenceId:  formValues.ReferenceId || null,
FieldName:  formValues.FieldName || null,
OldValue:  formValues.OldValue || null,
NewValue:  formValues.NewValue || null,
ChangeSummary:  formValues.ChangeSummary || null,

    } as IContractAmendmentChange ;
	
	this.spinner.show();  	   
    this.contractAmendmentChangeService.update(this.contractAmendmentChange.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ContractAmendmentChange +  'Details Updated sucessfully.');
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
