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
import { ILocation } from './location';
import { LocationService } from './location.service';

@Component({
  selector: 'app-location-create',
  standalone: false,
  templateUrl: './location-create.component.html' ,
   providers: [ MessageService]
})
export class LocationCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  location: ILocation = null;
  locationtypeOptions: ISelectItem[] = [];
cityOptions: ISelectItem[] = [];
stateprovincecodeOptions: ISelectItem[] = [];
countrycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ILocation = {} as ILocation;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private locationService: LocationService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.location };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LocationCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
LocationName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
LocationType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AddressLine1: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
AddressLine2: new FormControl('', [Validators.maxLength(100), ]), 
Landmark: new FormControl('', [Validators.maxLength(20), ]), 
City: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StateProvinceCode: new FormControl('', [Validators.required, Validators.maxLength(2), ]),
PostalCode: new FormControl('', [Validators.required, Validators.maxLength(7), ]),
CountryCode: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
GeoLocation: new FormControl('', [Validators.maxLength(100), ]), 
Email: new FormControl('', [Validators.maxLength(100), ]), 
ContactPhone: new FormControl('', [Validators.maxLength(30), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.locationtypeOptions = this.loggedInUserService.getPicklistOptions('LocationType');
this.cityOptions = this.loggedInUserService.getPicklistOptions('City');
this.stateprovincecodeOptions = this.loggedInUserService.getPicklistOptions('StateCode');
this.countrycodeOptions = this.loggedInUserService.getPicklistOptions('CountryCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.locationService.getById(this.selectedId).subscribe({
      next: data => {
        this.location = data;
        this.objMaster = { ...this.location };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ILocation): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LocationCode: obj.LocationCode || '',
LocationName: obj.LocationName || '',
LocationType: obj.LocationType || '',
AddressLine1: obj.AddressLine1 || '',
AddressLine2: obj.AddressLine2 || '',
Landmark: obj.Landmark || '',
City: obj.City || '',
StateProvinceCode: obj.StateProvinceCode || '',
PostalCode: obj.PostalCode || '',
CountryCode: obj.CountryCode || '',
GeoLocation: obj.GeoLocation || '',
Email: obj.Email || '',
ContactPhone: obj.ContactPhone || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/locations/create']);
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
    this.location = { ...this.objMaster };
    var obj  = this.location;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LocationCode: obj.LocationCode || '',
LocationName: obj.LocationName || '',
LocationType: obj.LocationType || '',
AddressLine1: obj.AddressLine1 || '',
AddressLine2: obj.AddressLine2 || '',
Landmark: obj.Landmark || '',
City: obj.City || '',
StateProvinceCode: obj.StateProvinceCode || '',
PostalCode: obj.PostalCode || '',
CountryCode: obj.CountryCode || '',
GeoLocation: obj.GeoLocation || '',
Email: obj.Email || '',
ContactPhone: obj.ContactPhone || '',
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
        TenantId: this.loggedInUserService.loggedInUser.Tenant.TenantId,
     LocationCode: formValues.LocationCode || null,
LocationName: formValues.LocationName || null,
LocationType: formValues.LocationType || null,
AddressLine1: formValues.AddressLine1 || null,
AddressLine2: formValues.AddressLine2 || null,
Landmark: formValues.Landmark || null,
City: formValues.City || null,
StateProvinceCode: formValues.StateProvinceCode || null,
PostalCode: formValues.PostalCode || null,
CountryCode: formValues.CountryCode || null,
GeoLocation: formValues.GeoLocation || null,
Email: formValues.Email || null,
ContactPhone: formValues.ContactPhone || null,
RecordStatus: formValues.RecordStatus || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as ILocation ; 
	
	  this.spinner.show(); 
    this.locationService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(Location +  'Details Updated sucessfully.');
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



