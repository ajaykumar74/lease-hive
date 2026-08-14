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
import { IPartyLocation } from './partyLocation';
import { PartyLocationService } from './partyLocation.service';

@Component({
  selector: 'app-partyLocation-create',
  standalone: false,
  templateUrl: './partyLocation-create.component.html' ,
   providers: [ MessageService]
})
export class PartyLocationCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyLocation: IPartyLocation = null;
  partyidOptions: ISelectItem[] = [];
locationidOptions: ISelectItem[] = [];
partygstregistrationidOptions: ISelectItem[] = [];
locationtypeOptions: ISelectItem[] = [];
cityOptions: ISelectItem[] = [];
statecodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IPartyLocation = {} as IPartyLocation;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private partyLocationService: PartyLocationService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.partyLocation };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
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
IsRegisteredOffice: new FormControl(false, []),
IsBillTo: new FormControl(false, []),
IsShipTo: new FormControl(false, []),
IsDefaultBillTo: new FormControl(false, [Validators.required]),
IsDefaultShipTo: new FormControl(false, [Validators.required]),
WorkingHours: new FormControl('', [Validators.maxLength(20), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    this.loggedInUserService.getPartyOptions().subscribe({
      next: options => this.partyidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
this.locationtypeOptions.push({Text: 'RegisteredOffice', Value: 'RegisteredOffice' });
this.locationtypeOptions.push({Text: 'Billing', Value: 'Billing' });
this.locationtypeOptions.push({Text: 'Delivery', Value: 'Delivery' });
this.locationtypeOptions.push({Text: 'Warehouse', Value: 'Warehouse' });
this.locationtypeOptions.push({Text: 'Branch', Value: 'Branch' });
this.locationtypeOptions.push({Text: 'ServiceCentre', Value: 'ServiceCentre' });
this.cityOptions.push({Text: 'New Delhi', Value: 'New Delhi' });
this.cityOptions.push({Text: 'Gurugram', Value: 'Gurugram' });
this.cityOptions.push({Text: 'Mumbai', Value: 'Mumbai' });
this.statecodeOptions.push({Text: 'HR', Value: 'HR' });
this.statecodeOptions.push({Text: 'MH', Value: 'MH' });
this.statecodeOptions.push({Text: 'DL', Value: 'DL' });
    this.loggedInUserService.getLookupOptions('locations').subscribe({
      next: options => this.locationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('party-gst-registrations').subscribe({
      next: options => this.partygstregistrationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Disabled', Value: 'Disabled' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.partyLocationService.getById(this.selectedId).subscribe({
      next: data => {
        this.partyLocation = data;
        this.objMaster = { ...this.partyLocation };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IPartyLocation): void {
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
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/partyLocations/create']);
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
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PartyId: formValues.PartyId || null,
LocationId: formValues.LocationId || null,
TenantId: this.loggedInUserService.loggedInUser.Tenant.Id || 0,
PartyGSTRegistrationId: formValues.PartyGSTRegistrationId || null,
LocationCode: formValues.LocationCode || null,
LocationName: formValues.LocationName || null,
LocationType: formValues.LocationType || null,
AddressLine1: formValues.AddressLine1 || null,
AddressLine2: formValues.AddressLine2 || null,
City: formValues.City || null,
StateCode: formValues.StateCode || null,
PostalCode: formValues.PostalCode || null,
IsRegisteredOffice: formValues.IsRegisteredOffice || false,
IsBillTo: formValues.IsBillTo || false,
IsShipTo: formValues.IsShipTo || false,
IsDefaultBillTo: formValues.IsDefaultBillTo || false,
IsDefaultShipTo: formValues.IsDefaultShipTo || false,
WorkingHours: formValues.WorkingHours || null,
RecordStatus: formValues.RecordStatus || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IPartyLocation ; 
	
	  this.spinner.show(); 
    this.partyLocationService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PartyLocation +  'Details Updated sucessfully.');
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



