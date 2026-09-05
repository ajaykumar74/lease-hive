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
import { ILocation } from './location';
import { LocationService } from './location.service';


@Component({
  selector: 'app-location-edit',
  standalone: false,
  templateUrl: './location-edit.component.html',
  providers: [ MessageService]
})
export class LocationEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  location: ILocation = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  locationtypeOptions: ISelectItem[] = [];
cityOptions: ISelectItem[] = [];
stateprovincecodeOptions: ISelectItem[] = [];
countrycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ILocation = {} as ILocation;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private locationService: LocationService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.location };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.locationService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.location = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.location };
        this.populateUI(this.location);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "Location Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/organisations/locations/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     LocationCode:  formValues.LocationCode || null,
LocationName:  formValues.LocationName || null,
LocationType:  formValues.LocationType || null,
AddressLine1:  formValues.AddressLine1 || null,
AddressLine2:  formValues.AddressLine2 || null,
Landmark:  formValues.Landmark || null,
City:  formValues.City || null,
StateProvinceCode:  formValues.StateProvinceCode || null,
PostalCode:  formValues.PostalCode || null,
CountryCode:  formValues.CountryCode || null,
GeoLocation:  formValues.GeoLocation || null,
Email:  formValues.Email || null,
ContactPhone:  formValues.ContactPhone || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as ILocation ;
	
	this.spinner.show();  	   
    this.locationService.update(this.location.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(Location +  'Details Updated sucessfully.');
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
