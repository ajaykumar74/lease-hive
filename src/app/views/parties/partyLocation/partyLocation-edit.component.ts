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
import { IPartyLocation } from './partyLocation';
import { PartyLocationService } from './partyLocation.service';


@Component({
  selector: 'app-partyLocation-edit',
  standalone: false,
  templateUrl: './partyLocation-edit.component.html',
  providers: [ MessageService]
})
export class PartyLocationEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  partyId: number | null = null;
  isLoading: boolean = false;
  partyLocation: IPartyLocation = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyidOptions: ISelectItem[] = [];
locationidOptions: ISelectItem[] = [];
partygstregistrationidOptions: ISelectItem[] = [];
locationtypeOptions: ISelectItem[] = [];
cityOptions: ISelectItem[] = [];
statecodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPartyLocation = {} as IPartyLocation;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private partyLocationService: PartyLocationService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.partyLocation };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PartyGSTRegistrationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LocationCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
LocationName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
LocationType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AddressLine1: new FormControl('', [Validators.required, Validators.maxLength(150), ]),
AddressLine2: new FormControl('', [Validators.maxLength(150), ]), 
City: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
StateCode: new FormControl('', [Validators.required, Validators.maxLength(2), ]),
PostalCode: new FormControl('', [Validators.required, Validators.maxLength(7), ]),
IsRegisteredOffice: new FormControl(false), 
IsBillTo: new FormControl(false), 
IsShipTo: new FormControl(false), 
IsDefaultBillTo: new FormControl(false, [Validators.required]),
IsDefaultShipTo: new FormControl(false, [Validators.required]),
WorkingHours: new FormControl('', [Validators.maxLength(20), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    this.loggedInUserService.bindEntityLookup(this.editForm, 'PartyGSTRegistrationId', 'party-gst-registrations',
      options => this.partygstregistrationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, { PartyId: 'PartyId' });
this.locationtypeOptions = this.loggedInUserService.getPicklistOptions('LocationType');
this.cityOptions = this.loggedInUserService.getPicklistOptions('City');
this.statecodeOptions = this.loggedInUserService.getPicklistOptions('StateCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
     const routePartyId = Number(this.activatedRouter.snapshot.paramMap.get('partyId'));
     this.partyId = routePartyId > 0 ? routePartyId : null;
     if (this.partyId) this.editForm.controls.PartyId.disable();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.partyLocationService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.partyLocation = data.data;
		if (this.partyId && this.partyLocation.PartyId !== this.partyId) {
		  this.messageService.showError('This record does not belong to the selected party.');
		  this.router.navigate(['/business/parties/locations/party', this.partyId]);
		  return;
		}
		this.permission = data.permission;
        this.objMaster = { ...this.partyLocation };
        this.populateUI(this.partyLocation);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPartyLocation): void {
    this.loggedInUserService.getLookupOptions('locations', obj.LocationId).subscribe({
      next: options => this.locationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getPartyOptions(obj.PartyId).subscribe({
      next: options => this.partyidOptions = options,
      error: err => this.messageService?.showError(err)
    });
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
LocationId: obj.LocationId || 0,
PartyGSTRegistrationId: obj.PartyGSTRegistrationId || 0,
LocationCode: obj.LocationCode || '',
LocationName: obj.LocationName || '',
LocationType: obj.LocationType || '',
AddressLine1: obj.AddressLine1 || '',
AddressLine2: obj.AddressLine2 || '',
City: obj.City || '',
StateCode: obj.StateCode || '',
PostalCode: obj.PostalCode || '',
IsRegisteredOffice:  obj.IsRegisteredOffice || false,
IsBillTo:  obj.IsBillTo || false,
IsShipTo:  obj.IsShipTo || false,
IsDefaultBillTo:  obj.IsDefaultBillTo || false,
IsDefaultShipTo:  obj.IsDefaultShipTo || false,
WorkingHours: obj.WorkingHours || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "PartyLocation Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/parties/locations/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.partyLocation = { ...this.objMaster };
	var obj  = this.partyLocation;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
LocationId: obj.LocationId || 0,
PartyGSTRegistrationId: obj.PartyGSTRegistrationId || 0,
LocationCode: obj.LocationCode || '',
LocationName: obj.LocationName || '',
LocationType: obj.LocationType || '',
AddressLine1: obj.AddressLine1 || '',
AddressLine2: obj.AddressLine2 || '',
City: obj.City || '',
StateCode: obj.StateCode || '',
PostalCode: obj.PostalCode || '',
IsRegisteredOffice:  obj.IsRegisteredOffice || false,
IsBillTo:  obj.IsBillTo || false,
IsShipTo:  obj.IsShipTo || false,
IsDefaultBillTo:  obj.IsDefaultBillTo || false,
IsDefaultShipTo:  obj.IsDefaultShipTo || false,
WorkingHours: obj.WorkingHours || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
     PartyId:  this.partyId ?? formValues.PartyId ?? this.objMaster.PartyId,
LocationId:  formValues.LocationId || 0,
PartyGSTRegistrationId:  formValues.PartyGSTRegistrationId || 0,
LocationCode:  formValues.LocationCode || null,
LocationName:  formValues.LocationName || null,
LocationType:  formValues.LocationType || null,
AddressLine1:  formValues.AddressLine1 || null,
AddressLine2:  formValues.AddressLine2 || null,
City:  formValues.City || null,
StateCode:  formValues.StateCode || null,
PostalCode:  formValues.PostalCode || null,
IsRegisteredOffice:  formValues.IsRegisteredOffice || false,
IsBillTo:  formValues.IsBillTo || false,
IsShipTo:  formValues.IsShipTo || false,
IsDefaultBillTo:  formValues.IsDefaultBillTo || false,
IsDefaultShipTo:  formValues.IsDefaultShipTo || false,
WorkingHours:  formValues.WorkingHours || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IPartyLocation ;
	
	this.spinner.show();  	   
    this.partyLocationService.update(this.partyLocation.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PartyLocation +  'Details Updated sucessfully.');
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
