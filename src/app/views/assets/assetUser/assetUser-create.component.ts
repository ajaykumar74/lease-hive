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
import { IAssetUser } from './assetUser';
import { AssetUserService } from './assetUser.service';

@Component({
  selector: 'app-assetUser-create',
  standalone: false,
  templateUrl: './assetUser-create.component.html' ,
   providers: [ MessageService]
})
export class AssetUserCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset User';
  assetUser: IAssetUser = null;
  customerprofileidOptions: ISelectItem[] = [];
partylocationidOptions: ISelectItem[] = [];
customerdepartmentidOptions: ISelectItem[] = [];
usertypeOptions: ISelectItem[] = [];
fullnameOptions: ISelectItem[] = [];
designationOptions: ISelectItem[] = [];
emailOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetUser = {} as IAssetUser;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetUserService: AssetUserService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetUser };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
CustomerProfileId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerDepartmentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
UserType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EmployeeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
FullName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
Designation: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Email: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
MobileCountryCode: new FormControl('', [Validators.required, Validators.maxLength(5), ]),
MobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
DrivingLicenceNumber: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DrivingLicenceExpiryDate: new FormControl(new Date(), [Validators.required]),
NationalIdMasked: new FormControl('', [Validators.maxLength(20), ]), 
EmergencyContactName: new FormControl('', [Validators.maxLength(50), ]), 
EmergencyContactMobile: new FormControl('', [Validators.maxLength(10), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.usertypeOptions = this.loggedInUserService.getPicklistOptions('UserType');
this.fullnameOptions.push({Text: 'CostCenter1', Value: 'CostCenter1' });
this.fullnameOptions.push({Text: 'CostCenter2', Value: 'CostCenter2' });
this.designationOptions.push({Text: 'CustContact1', Value: 'CustContact1' });
this.designationOptions.push({Text: 'CustContact2', Value: 'CustContact2' });
this.emailOptions.push({Text: 'AssetCat1', Value: 'AssetCat1' });
this.emailOptions.push({Text: 'AssetCat2', Value: 'AssetCat2' });
    this.loggedInUserService.getLookupOptions('customer-departments').subscribe({
      next: options => this.customerdepartmentidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('customer-profiles').subscribe({
      next: options => this.customerprofileidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('party-locations').subscribe({
      next: options => this.partylocationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetUserService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetUser = data;
        this.objMaster = { ...this.assetUser };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetUser): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CustomerProfileId: obj.CustomerProfileId || 0,
PartyLocationId: obj.PartyLocationId || 0,
CustomerDepartmentId: obj.CustomerDepartmentId || 0,
UserType: obj.UserType || '',
EmployeeCode: obj.EmployeeCode || '',
FullName: obj.FullName || '',
Designation: obj.Designation || 0,
Email: obj.Email || '',
MobileCountryCode: obj.MobileCountryCode || '',
MobileNumber: obj.MobileNumber || '',
DrivingLicenceNumber: obj.DrivingLicenceNumber || '',
DrivingLicenceExpiryDate:  obj.DrivingLicenceExpiryDate || new Date(),
NationalIdMasked: obj.NationalIdMasked || '',
EmergencyContactName: obj.EmergencyContactName || '',
EmergencyContactMobile: obj.EmergencyContactMobile || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetUsers/create']);
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
    this.assetUser = { ...this.objMaster };
    var obj  = this.assetUser;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CustomerProfileId: obj.CustomerProfileId || 0,
PartyLocationId: obj.PartyLocationId || 0,
CustomerDepartmentId: obj.CustomerDepartmentId || 0,
UserType: obj.UserType || '',
EmployeeCode: obj.EmployeeCode || '',
FullName: obj.FullName || '',
Designation: obj.Designation || 0,
Email: obj.Email || '',
MobileCountryCode: obj.MobileCountryCode || '',
MobileNumber: obj.MobileNumber || '',
DrivingLicenceNumber: obj.DrivingLicenceNumber || '',
DrivingLicenceExpiryDate:  obj.DrivingLicenceExpiryDate || new Date(),
NationalIdMasked: obj.NationalIdMasked || '',
EmergencyContactName: obj.EmergencyContactName || '',
EmergencyContactMobile: obj.EmergencyContactMobile || '',
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
     CustomerProfileId: formValues.CustomerProfileId || 0,
PartyLocationId: formValues.PartyLocationId || 0,
CustomerDepartmentId: formValues.CustomerDepartmentId || 0,
UserType: formValues.UserType || null,
EmployeeCode: formValues.EmployeeCode || null,
FullName: formValues.FullName || null,
Designation: formValues.Designation || 0,
Email: formValues.Email || null,
MobileCountryCode: formValues.MobileCountryCode || null,
MobileNumber: formValues.MobileNumber || null,
DrivingLicenceNumber: formValues.DrivingLicenceNumber || null,
DrivingLicenceExpiryDate: formValues.DrivingLicenceExpiryDate || null,
NationalIdMasked: formValues.NationalIdMasked || null,
EmergencyContactName: formValues.EmergencyContactName || null,
EmergencyContactMobile: formValues.EmergencyContactMobile || null,
RecordStatus: 'Active',
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IAssetUser ; 
	
	  this.spinner.show(); 
    this.assetUserService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetUser +  'Details Updated sucessfully.');
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



