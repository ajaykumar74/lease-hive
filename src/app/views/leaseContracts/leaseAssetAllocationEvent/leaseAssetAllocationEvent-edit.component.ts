import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-leaseAssetAllocationEvent-edit',
  standalone: false,
  templateUrl: './leaseAssetAllocationEvent-edit.component.html',
  providers: [ MessageService]
})
export class LeaseAssetAllocationEventEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  leaseAssetAllocationEvent: ILeaseAssetAllocationEvent = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasecontractassetidOptions: ISelectItem[] = [];
eventcodeOptions: ISelectItem[] = [];
fromassetidOptions: ISelectItem[] = [];
toassetidOptions: ISelectItem[] = [];
performedbyOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ILeaseAssetAllocationEvent = {} as ILeaseAssetAllocationEvent;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private leaseAssetAllocationEventService: LeaseAssetAllocationEventService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.leaseAssetAllocationEvent };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
LeaseContractAssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EventCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EventDateTime: new FormControl(new Date(), [Validators.required]),
FromAssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ToAssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReasonCode: new FormControl('', [Validators.maxLength(20), ]), 
Comments: new FormControl('', [Validators.maxLength(250), ]), 
PerformedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });

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

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.leaseAssetAllocationEventService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.leaseAssetAllocationEvent = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.leaseAssetAllocationEvent };
        this.populateUI(this.leaseAssetAllocationEvent);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "LeaseAssetAllocationEvent Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contracts/assets/history/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     LeaseContractAssetId:  formValues.LeaseContractAssetId || null,
EventCode:  formValues.EventCode || null,
EventDateTime:  formValues.EventDateTime || null,
FromAssetId:  formValues.FromAssetId || null,
ToAssetId:  formValues.ToAssetId || null,
ReasonCode:  formValues.ReasonCode || null,
Comments:  formValues.Comments || null,
PerformedBy:  formValues.PerformedBy || null,

    } as ILeaseAssetAllocationEvent ;
	
	this.spinner.show();  	   
    this.leaseAssetAllocationEventService.update(this.leaseAssetAllocationEvent.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(LeaseAssetAllocationEvent +  'Details Updated sucessfully.');
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
