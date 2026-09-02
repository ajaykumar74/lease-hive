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
import { IContractObligationEvent } from './contractObligationEvent';
import { ContractObligationEventService } from './contractObligationEvent.service';

@Component({
  selector: 'app-contractObligationEvent-create',
  standalone: false,
  templateUrl: './contractObligationEvent-create.component.html' ,
   providers: [ MessageService]
})
export class ContractObligationEventCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractObligationEvent: IContractObligationEvent = null;
  contractobligationidOptions: ISelectItem[] = [];
eventtypecodeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
performedbyOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractObligationEvent = {} as IContractObligationEvent;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractObligationEventService: ContractObligationEventService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractObligationEvent };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ContractObligationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EventTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EventDateTime: new FormControl(new Date(), [Validators.required]),
DocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReferenceType: new FormControl('', [Validators.maxLength(30), ]), 
ReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Notes: new FormControl('', [Validators.maxLength(500), ]), 
PerformedBy: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create ContractObligationEvent';
    this.contractobligationidOptions.push({Text: 'ContractObligationId1', Value: 'ContractObligationId1' });
this.contractobligationidOptions.push({Text: 'ContractObligationId2', Value: 'ContractObligationId2' });
this.eventtypecodeOptions.push({Text: 'DUE', Value: 'DUE' });
this.eventtypecodeOptions.push({Text: 'SATISFIED', Value: 'SATISFIED' });
this.eventtypecodeOptions.push({Text: 'BREACH', Value: 'BREACH' });
this.eventtypecodeOptions.push({Text: 'WAIVER', Value: 'WAIVER' });
this.eventtypecodeOptions.push({Text: 'CLOSE', Value: 'CLOSE' });
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.performedbyOptions.push({Text: 'PerformedBy1', Value: 'PerformedBy1' });
this.performedbyOptions.push({Text: 'PerformedBy2', Value: 'PerformedBy2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractObligationEventService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractObligationEvent = data;
        this.objMaster = { ...this.contractObligationEvent };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractObligationEvent): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractObligationId: obj.ContractObligationId || 0,
EventTypeCode: obj.EventTypeCode || '',
EventDateTime:  obj.EventDateTime || new Date(),
DocumentId: obj.DocumentId || 0,
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
Notes: obj.Notes || '',
PerformedBy: obj.PerformedBy || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractObligationEvents/create']);
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
    this.contractObligationEvent = { ...this.objMaster };
    var obj  = this.contractObligationEvent;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractObligationId: obj.ContractObligationId || 0,
EventTypeCode: obj.EventTypeCode || '',
EventDateTime:  obj.EventDateTime || new Date(),
DocumentId: obj.DocumentId || 0,
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
Notes: obj.Notes || '',
PerformedBy: obj.PerformedBy || 0,
 
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
     ContractObligationId: formValues.ContractObligationId || 0,
EventTypeCode: formValues.EventTypeCode || null,
EventDateTime: formValues.EventDateTime || null,
DocumentId: formValues.DocumentId || 0,
ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || 0,
Notes: formValues.Notes || null,
PerformedBy: formValues.PerformedBy || 0,

    } as IContractObligationEvent ; 
	
	  this.spinner.show(); 
    this.contractObligationEventService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractObligationEvent +  'Details Updated sucessfully.');
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



