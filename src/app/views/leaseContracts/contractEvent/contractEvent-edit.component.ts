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
import { IContractEvent } from './contractEvent';
import { ContractEventService } from './contractEvent.service';


@Component({
  selector: 'app-contractEvent-edit',
  standalone: false,
  templateUrl: './contractEvent-edit.component.html',
  providers: [ MessageService]
})
export class ContractEventEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  contractEvent: IContractEvent = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasecontractidOptions: ISelectItem[] = [];
eventtypecodeOptions: ISelectItem[] = [];
performedbyOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IContractEvent = {} as IContractEvent;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private contractEventService: ContractEventService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.contractEvent };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EventTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EventDateTime: new FormControl(new Date(), [Validators.required]),
ReferenceType: new FormControl('', [Validators.maxLength(30), ]), 
ReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
EventSummary: new FormControl('', [Validators.required, Validators.maxLength(500), ]),
EventPayloadJson: new FormControl('', [Validators.maxLength(8000), ]), 
PerformedBy: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });

   this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.eventtypecodeOptions.push({Text: 'CREATED', Value: 'CREATED' });
this.eventtypecodeOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.eventtypecodeOptions.push({Text: 'EXECUTED', Value: 'EXECUTED' });
this.eventtypecodeOptions.push({Text: 'ACTIVATED', Value: 'ACTIVATED' });
this.eventtypecodeOptions.push({Text: 'AMENDED', Value: 'AMENDED' });
this.eventtypecodeOptions.push({Text: 'SUSPENDED', Value: 'SUSPENDED' });
this.eventtypecodeOptions.push({Text: 'TERMINATED', Value: 'TERMINATED' });
this.eventtypecodeOptions.push({Text: 'CLOSED', Value: 'CLOSED' });
this.performedbyOptions.push({Text: 'PerformedBy1', Value: 'PerformedBy1' });
this.performedbyOptions.push({Text: 'PerformedBy2', Value: 'PerformedBy2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.contractEventService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.contractEvent = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.contractEvent };
        this.populateUI(this.contractEvent);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "ContractEvent Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractEvent/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     LeaseContractId:  formValues.LeaseContractId || null,
EventTypeCode:  formValues.EventTypeCode || null,
EventDateTime:  formValues.EventDateTime || null,
ReferenceType:  formValues.ReferenceType || null,
ReferenceId:  formValues.ReferenceId || null,
EventSummary:  formValues.EventSummary || null,
EventPayloadJson:  formValues.EventPayloadJson || null,
PerformedBy:  formValues.PerformedBy || null,

    } as IContractEvent ;
	
	this.spinner.show();  	   
    this.contractEventService.update(this.contractEvent.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ContractEvent +  'Details Updated sucessfully.');
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
