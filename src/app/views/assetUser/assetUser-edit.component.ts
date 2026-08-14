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
import { IAssetUser } from './assetUser';
import { AssetUserService } from './assetUser.service';


@Component({
  selector: 'app-assetUser-edit',
  standalone: false,
  templateUrl: './assetUser-edit.component.html',
  providers: [ MessageService]
})
export class AssetUserEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetUser: IAssetUser = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  customerprofileidOptions: ISelectItem[] = [];
partylocationidOptions: ISelectItem[] = [];
customerdepartmentidOptions: ISelectItem[] = [];
usertypeOptions: ISelectItem[] = [];
fullnameOptions: ISelectItem[] = [];
designationOptions: ISelectItem[] = [];
emailOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetUser = {} as IAssetUser;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetUserService: AssetUserService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetUser };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });

   this.customerprofileidOptions.push({Text: 'CustProfile1', Value: 'CustProfile1' });
this.customerprofileidOptions.push({Text: 'CustProfile2', Value: 'CustProfile2' });
this.partylocationidOptions.push({Text: 'PartyLOcation1', Value: 'PartyLOcation1' });
this.partylocationidOptions.push({Text: 'PartyLocation2', Value: 'PartyLocation2' });
this.customerdepartmentidOptions.push({Text: 'CustDepart1', Value: 'CustDepart1' });
this.customerdepartmentidOptions.push({Text: 'CustDepart2', Value: 'CustDepart2' });
this.usertypeOptions.push({Text: 'Employee', Value: 'Employee' });
this.usertypeOptions.push({Text: 'Driver', Value: 'Driver' });
this.usertypeOptions.push({Text: 'Contractor', Value: 'Contractor' });
this.usertypeOptions.push({Text: 'Department', Value: 'Department' });
this.usertypeOptions.push({Text: 'SharedPool', Value: 'SharedPool' });
this.usertypeOptions.push({Text: 'Custodian', Value: 'Custodian' });
this.fullnameOptions.push({Text: 'CostCenter1', Value: 'CostCenter1' });
this.fullnameOptions.push({Text: 'CostCenter2', Value: 'CostCenter2' });
this.designationOptions.push({Text: 'CustContact1', Value: 'CustContact1' });
this.designationOptions.push({Text: 'CustContact2', Value: 'CustContact2' });
this.emailOptions.push({Text: 'AssetCat1', Value: 'AssetCat1' });
this.emailOptions.push({Text: 'AssetCat2', Value: 'AssetCat2' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Disabled', Value: 'Disabled' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetUserService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetUser = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetUser };
        this.populateUI(this.assetUser);
      },
      error: err => { this.messageService.showSuccess(err); },
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
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "AssetUser Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetUser/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
     CustomerProfileId:  formValues.CustomerProfileId || null,
PartyLocationId:  formValues.PartyLocationId || null,
CustomerDepartmentId:  formValues.CustomerDepartmentId || null,
UserType:  formValues.UserType || null,
EmployeeCode:  formValues.EmployeeCode || null,
FullName:  formValues.FullName || null,
Designation:  formValues.Designation || null,
Email:  formValues.Email || null,
MobileCountryCode:  formValues.MobileCountryCode || null,
MobileNumber:  formValues.MobileNumber || null,
DrivingLicenceNumber:  formValues.DrivingLicenceNumber || null,
DrivingLicenceExpiryDate:  formValues.DrivingLicenceExpiryDate || null,
NationalIdMasked:  formValues.NationalIdMasked || null,
EmergencyContactName:  formValues.EmergencyContactName || null,
EmergencyContactMobile:  formValues.EmergencyContactMobile || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IAssetUser ;
	
	this.spinner.show();  	   
    this.assetUserService.update(this.assetUser.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetUser +  'Details Updated sucessfully.');
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
