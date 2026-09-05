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
import { ILeaseAssetAllocationEvent } from './leaseAssetAllocationEvent';
import { LeaseAssetAllocationEventService } from './leaseAssetAllocationEvent.service';

@Component({
  selector: 'app-leaseAssetAllocationEvent-create',
  standalone: false,
  templateUrl: './leaseAssetAllocationEvent-create.component.html' ,
   providers: [ MessageService]
})
export class LeaseAssetAllocationEventCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leaseAssetAllocationEvent: ILeaseAssetAllocationEvent = null;
  leasecontractassetidOptions: ISelectItem[] = [];
eventcodeOptions: ISelectItem[] = [];
fromassetidOptions: ISelectItem[] = [];
toassetidOptions: ISelectItem[] = [];
performedbyOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ILeaseAssetAllocationEvent = {} as ILeaseAssetAllocationEvent;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private leaseAssetAllocationEventService: LeaseAssetAllocationEventService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.leaseAssetAllocationEvent };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeaseContractAssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EventCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EventDateTime: new FormControl(new Date(), [Validators.required]),
FromAssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ToAssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReasonCode: new FormControl('', [Validators.maxLength(20), ]), 
Comments: new FormControl('', [Validators.maxLength(250), ]), 
PerformedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create LeaseAssetAllocationEvent';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractAssetId', 'lease-contract-assets',
      options => this.leasecontractassetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.eventcodeOptions = this.loggedInUserService.getPicklistOptions('EventCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'FromAssetId', 'assets',
      options => this.fromassetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ToAssetId', 'assets',
      options => this.toassetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.performedbyOptions.push({Text: 'PerformedBy1', Value: 'PerformedBy1' });
this.performedbyOptions.push({Text: 'PerformedBy2', Value: 'PerformedBy2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.leaseAssetAllocationEventService.getById(this.selectedId).subscribe({
      next: data => {
        this.leaseAssetAllocationEvent = data;
        this.objMaster = { ...this.leaseAssetAllocationEvent };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ILeaseAssetAllocationEvent): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractAssetId: obj.LeaseContractAssetId || 0,
EventCode: obj.EventCode || '',
EventDateTime:  obj.EventDateTime || new Date(),
FromAssetId: obj.FromAssetId || 0,
ToAssetId: obj.ToAssetId || 0,
ReasonCode: obj.ReasonCode || '',
Comments: obj.Comments || '',
PerformedBy: obj.PerformedBy || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/leaseAssetAllocationEvents/create']);
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
    this.leaseAssetAllocationEvent = { ...this.objMaster };
    var obj  = this.leaseAssetAllocationEvent;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractAssetId: obj.LeaseContractAssetId || 0,
EventCode: obj.EventCode || '',
EventDateTime:  obj.EventDateTime || new Date(),
FromAssetId: obj.FromAssetId || 0,
ToAssetId: obj.ToAssetId || 0,
ReasonCode: obj.ReasonCode || '',
Comments: obj.Comments || '',
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     LeaseContractAssetId: formValues.LeaseContractAssetId || 0,
EventCode: formValues.EventCode || null,
EventDateTime: formValues.EventDateTime || null,
FromAssetId: formValues.FromAssetId || 0,
ToAssetId: formValues.ToAssetId || 0,
ReasonCode: formValues.ReasonCode || null,
Comments: formValues.Comments || null,
PerformedBy: formValues.PerformedBy || 0,

    } as ILeaseAssetAllocationEvent ; 
	
	  this.spinner.show(); 
    this.leaseAssetAllocationEventService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(LeaseAssetAllocationEvent +  'Details Updated sucessfully.');
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



