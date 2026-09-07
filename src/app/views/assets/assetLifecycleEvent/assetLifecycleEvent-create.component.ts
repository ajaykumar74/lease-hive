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
import { IAssetLifecycleEvent } from './assetLifecycleEvent';
import { AssetLifecycleEventService } from './assetLifecycleEvent.service';
import { applyAssetPayloadDefaults } from '@/views/assets/asset-payload-defaults';

@Component({
  selector: 'app-assetLifecycleEvent-create',
  standalone: false,
  templateUrl: './assetLifecycleEvent-create.component.html' ,
   providers: [ MessageService]
})
export class AssetLifecycleEventCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetLifecycleEvent: IAssetLifecycleEvent = null;
  assetidOptions: ISelectItem[] = [];
eventtypeidOptions: ISelectItem[] = [];
organisationunitidOptions: ISelectItem[] = [];
partyidOptions: ISelectItem[] = [];
locationidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetLifecycleEvent = {} as IAssetLifecycleEvent;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetLifecycleEventService: AssetLifecycleEventService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetLifecycleEvent };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EventTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EventDateTime: new FormControl(new Date(), [Validators.required]),
OrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReferenceType: new FormControl('', [Validators.maxLength(30), ]), 
ReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Summary: new FormControl('', [Validators.required, Validators.maxLength(500), ]),

    });
    this.Caption = 'Create AssetLifecycleEvent';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets', options => this.assetidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'EventTypeId', 'asset-event-types', options => this.eventtypeidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'OrganisationUnitId', 'organisation-units', options => this.organisationunitidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PartyId', 'parties', options => this.partyidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'LocationId', 'locations', options => this.locationidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetLifecycleEventService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetLifecycleEvent = data;
        this.objMaster = { ...this.assetLifecycleEvent };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetLifecycleEvent): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
EventTypeId: obj.EventTypeId || 0,
EventDateTime:  obj.EventDateTime || new Date(),
OrganisationUnitId: obj.OrganisationUnitId || 0,
PartyId: obj.PartyId || 0,
LocationId: obj.LocationId || 0,
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
Summary: obj.Summary || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/assets/lifecycle/create']);
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
    this.assetLifecycleEvent = { ...this.objMaster };
    var obj  = this.assetLifecycleEvent;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
EventTypeId: obj.EventTypeId || 0,
EventDateTime:  obj.EventDateTime || new Date(),
OrganisationUnitId: obj.OrganisationUnitId || 0,
PartyId: obj.PartyId || 0,
LocationId: obj.LocationId || 0,
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
Summary: obj.Summary || '',
 
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     AssetId: formValues.AssetId || 0,
EventTypeId: formValues.EventTypeId || 0,
EventDateTime: formValues.EventDateTime || null,
OrganisationUnitId: formValues.OrganisationUnitId || 0,
PartyId: formValues.PartyId || 0,
LocationId: formValues.LocationId || 0,
ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || 0,
Summary: formValues.Summary || null,

    } as IAssetLifecycleEvent ; 
	applyAssetPayloadDefaults(createdObj, formValues, ['AssetId', 'EventTypeId', 'OrganisationUnitId', 'PartyId', 'LocationId', 'ReferenceId'], [], ['EventDateTime']);
	
	  this.spinner.show(); 
    this.assetLifecycleEventService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetLifecycleEvent +  'Details Updated sucessfully.');
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



