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
import { IAssetLifecycleEvent } from './assetLifecycleEvent';
import { AssetLifecycleEventService } from './assetLifecycleEvent.service';
import { applyAssetPayloadDefaults } from '@/views/assets/asset-payload-defaults';


@Component({
  selector: 'app-assetLifecycleEvent-edit',
  standalone: false,
  templateUrl: './assetLifecycleEvent-edit.component.html',
  providers: [ MessageService]
})
export class AssetLifecycleEventEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  assetLifecycleEvent: IAssetLifecycleEvent = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
eventtypeidOptions: ISelectItem[] = [];
organisationunitidOptions: ISelectItem[] = [];
partyidOptions: ISelectItem[] = [];
locationidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetLifecycleEvent = {} as IAssetLifecycleEvent;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetLifecycleEventService: AssetLifecycleEventService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetLifecycleEvent };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets', options => this.assetidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'EventTypeId', 'asset-event-types', options => this.eventtypeidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'OrganisationUnitId', 'organisation-units', options => this.organisationunitidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PartyId', 'parties', options => this.partyidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'LocationId', 'locations', options => this.locationidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetLifecycleEventService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetLifecycleEvent = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetLifecycleEvent };
        this.populateUI(this.assetLifecycleEvent);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "AssetLifecycleEvent Details #" + obj.Id;
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetId:  formValues.AssetId || null,
EventTypeId:  formValues.EventTypeId || null,
EventDateTime:  formValues.EventDateTime || null,
OrganisationUnitId:  formValues.OrganisationUnitId || null,
PartyId:  formValues.PartyId || null,
LocationId:  formValues.LocationId || null,
ReferenceType:  formValues.ReferenceType || null,
ReferenceId:  formValues.ReferenceId || null,
Summary:  formValues.Summary || null,

    } as IAssetLifecycleEvent ;
	applyAssetPayloadDefaults(updatedObj, formValues, ['AssetId', 'EventTypeId', 'OrganisationUnitId', 'PartyId', 'LocationId', 'ReferenceId'], [], ['EventDateTime']);
	
	this.spinner.show();  	   
    this.assetLifecycleEventService.update(this.assetLifecycleEvent.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetLifecycleEvent +  'Details Updated sucessfully.');
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
