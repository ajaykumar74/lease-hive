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
import { ICustomerProfile } from './customerProfile';
import { CustomerProfileService } from './customerProfile.service';

@Component({
  selector: 'app-customerProfile-create',
  standalone: false,
  templateUrl: './customerProfile-create.component.html' ,
   providers: [ MessageService]
})
export class CustomerProfileCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  customerProfile: ICustomerProfile = null;
  partyidOptions: ISelectItem[] = [];
customersegmentOptions: ISelectItem[] = [];
customercategoryOptions: ISelectItem[] = [];
relationshipmanageruseridOptions: ISelectItem[] = [];
owningorganisationunitidOptions: ISelectItem[] = [];
defaultgstregistrationidOptions: ISelectItem[] = [];
defaultbillinglocationidOptions: ISelectItem[] = [];
defaultdeliverylocationidOptions: ISelectItem[] = [];
preferredbillingfrequencyOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ICustomerProfile = {} as ICustomerProfile;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private customerProfileService: CustomerProfileService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.customerProfile };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CustomerSegment: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CustomerCategory: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RelationshipManagerUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
OwningOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DefaultGSTRegistrationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DefaultBillingLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DefaultDeliveryLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DefaultPaymentTermsDays: new FormControl(0, [Validators.min(0), Validators.max(255)]),
PreferredBillingFrequency: new FormControl('', [Validators.maxLength(20), ]), 
PurchaseOrderRequired: new FormControl(false, []),
CustomerSinceDate: new FormControl(new Date(), [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
Description: new FormControl('', [Validators.maxLength(100), ]), 

    });
    this.partyidOptions.push({Text: 'Party1', Value: 'Party1' });
this.partyidOptions.push({Text: 'Party2', Value: 'Party2' });
this.customersegmentOptions.push({Text: 'Enterprise', Value: 'Enterprise' });
this.customersegmentOptions.push({Text: 'SME', Value: 'SME' });
this.customersegmentOptions.push({Text: 'Retail', Value: 'Retail' });
this.customersegmentOptions.push({Text: 'Government', Value: 'Government' });
this.customercategoryOptions.push({Text: 'Strategic', Value: 'Strategic' });
this.customercategoryOptions.push({Text: 'Key', Value: 'Key' });
this.customercategoryOptions.push({Text: 'Standard', Value: 'Standard' });
this.customercategoryOptions.push({Text: 'HighRisk', Value: 'HighRisk' });
this.relationshipmanageruseridOptions.push({Text: 'Employee1', Value: 'Employee1' });
this.relationshipmanageruseridOptions.push({Text: 'Employee2', Value: 'Employee2' });
this.owningorganisationunitidOptions.push({Text: 'Org1', Value: 'Org1' });
this.owningorganisationunitidOptions.push({Text: 'Org2', Value: 'Org2' });
this.defaultgstregistrationidOptions.push({Text: 'PartyGST1', Value: 'PartyGST1' });
this.defaultgstregistrationidOptions.push({Text: 'PartyGST2', Value: 'PartyGST2' });
this.defaultbillinglocationidOptions.push({Text: 'PartyLocation1', Value: 'PartyLocation1' });
this.defaultbillinglocationidOptions.push({Text: 'PartyLocation2', Value: 'PartyLocation2' });
this.defaultdeliverylocationidOptions.push({Text: 'PartyLocation1', Value: 'PartyLocation1' });
this.defaultdeliverylocationidOptions.push({Text: 'PartyLocation2', Value: 'PartyLocation2' });
this.preferredbillingfrequencyOptions.push({Text: '"Monthly', Value: '"Monthly' });
this.preferredbillingfrequencyOptions.push({Text: 'Quarterly', Value: 'Quarterly' });
this.preferredbillingfrequencyOptions.push({Text: 'Annual', Value: 'Annual' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Disabled', Value: 'Disabled' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.customerProfileService.getById(this.selectedId).subscribe({
      next: data => {
        this.customerProfile = data;
        this.objMaster = { ...this.customerProfile };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ICustomerProfile): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
CustomerCode: obj.CustomerCode || '',
CustomerSegment: obj.CustomerSegment || '',
CustomerCategory: obj.CustomerCategory || '',
RelationshipManagerUserId: obj.RelationshipManagerUserId || 0,
OwningOrganisationUnitId: obj.OwningOrganisationUnitId || 0,
DefaultGSTRegistrationId: obj.DefaultGSTRegistrationId || 0,
DefaultBillingLocationId: obj.DefaultBillingLocationId || 0,
DefaultDeliveryLocationId: obj.DefaultDeliveryLocationId || 0,
DefaultPaymentTermsDays: obj.DefaultPaymentTermsDays || 0,
PreferredBillingFrequency: obj.PreferredBillingFrequency || '',
PurchaseOrderRequired:  obj.PurchaseOrderRequired || false,
CustomerSinceDate:  obj.CustomerSinceDate || new Date(),
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/customerProfiles/create']);
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
    this.customerProfile = { ...this.objMaster };
    var obj  = this.customerProfile;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
CustomerCode: obj.CustomerCode || '',
CustomerSegment: obj.CustomerSegment || '',
CustomerCategory: obj.CustomerCategory || '',
RelationshipManagerUserId: obj.RelationshipManagerUserId || 0,
OwningOrganisationUnitId: obj.OwningOrganisationUnitId || 0,
DefaultGSTRegistrationId: obj.DefaultGSTRegistrationId || 0,
DefaultBillingLocationId: obj.DefaultBillingLocationId || 0,
DefaultDeliveryLocationId: obj.DefaultDeliveryLocationId || 0,
DefaultPaymentTermsDays: obj.DefaultPaymentTermsDays || 0,
PreferredBillingFrequency: obj.PreferredBillingFrequency || '',
PurchaseOrderRequired:  obj.PurchaseOrderRequired || false,
CustomerSinceDate:  obj.CustomerSinceDate || new Date(),
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
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
     PartyId: formValues.PartyId || 0,
CustomerCode: formValues.CustomerCode || null,
CustomerSegment: formValues.CustomerSegment || null,
CustomerCategory: formValues.CustomerCategory || null,
RelationshipManagerUserId: formValues.RelationshipManagerUserId || 0,
OwningOrganisationUnitId: formValues.OwningOrganisationUnitId || 0,
DefaultGSTRegistrationId: formValues.DefaultGSTRegistrationId || 0,
DefaultBillingLocationId: formValues.DefaultBillingLocationId || 0,
DefaultDeliveryLocationId: formValues.DefaultDeliveryLocationId || 0,
DefaultPaymentTermsDays: formValues.DefaultPaymentTermsDays || null,
PreferredBillingFrequency: formValues.PreferredBillingFrequency || null,
PurchaseOrderRequired: formValues.PurchaseOrderRequired || false,
CustomerSinceDate: formValues.CustomerSinceDate || null,
RecordStatus: formValues.RecordStatus || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
Description: formValues.Description || null,

    } as ICustomerProfile ; 
	
	  this.spinner.show(); 
    this.customerProfileService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(CustomerProfile +  'Details Updated sucessfully.');
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



