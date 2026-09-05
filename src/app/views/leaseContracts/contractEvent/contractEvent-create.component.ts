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
import { IContractEvent } from './contractEvent';
import { ContractEventService } from './contractEvent.service';

@Component({
  selector: 'app-contractEvent-create',
  standalone: false,
  templateUrl: './contractEvent-create.component.html' ,
   providers: [ MessageService]
})
export class ContractEventCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractEvent: IContractEvent = null;
  leasecontractidOptions: ISelectItem[] = [];
eventtypecodeOptions: ISelectItem[] = [];
performedbyOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractEvent = {} as IContractEvent;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractEventService: ContractEventService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractEvent };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EventTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EventDateTime: new FormControl(new Date(), [Validators.required]),
ReferenceType: new FormControl('', [Validators.maxLength(30), ]), 
ReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
EventSummary: new FormControl('', [Validators.required, Validators.maxLength(500), ]),
EventPayloadJson: new FormControl('', [Validators.maxLength(8000), ]), 
PerformedBy: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create ContractEvent';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.eventtypecodeOptions = this.loggedInUserService.getPicklistOptions('ContractEventEventTypeCode');
this.performedbyOptions.push({Text: 'PerformedBy1', Value: 'PerformedBy1' });
this.performedbyOptions.push({Text: 'PerformedBy2', Value: 'PerformedBy2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractEventService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractEvent = data;
        this.objMaster = { ...this.contractEvent };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractEvent): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
EventTypeCode: obj.EventTypeCode || '',
EventDateTime:  obj.EventDateTime || new Date(),
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
EventSummary: obj.EventSummary || '',
EventPayloadJson: obj.EventPayloadJson || '',
PerformedBy: obj.PerformedBy || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractEvents/create']);
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
    this.contractEvent = { ...this.objMaster };
    var obj  = this.contractEvent;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
EventTypeCode: obj.EventTypeCode || '',
EventDateTime:  obj.EventDateTime || new Date(),
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
EventSummary: obj.EventSummary || '',
EventPayloadJson: obj.EventPayloadJson || '',
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
     LeaseContractId: formValues.LeaseContractId || 0,
EventTypeCode: formValues.EventTypeCode || null,
EventDateTime: formValues.EventDateTime || null,
ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || 0,
EventSummary: formValues.EventSummary || null,
EventPayloadJson: formValues.EventPayloadJson || null,
PerformedBy: formValues.PerformedBy || 0,

    } as IContractEvent ; 
	
	  this.spinner.show(); 
    this.contractEventService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractEvent +  'Details Updated sucessfully.');
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



