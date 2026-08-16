import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ICustomerProfile } from './customerProfile';
import { CustomerProfileService } from './customerProfile.service';
import { PartyService } from '@/views/party/party.service';
import { IParty } from '@/views/party/party';

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
  partyId: number | null = null;
  party: IParty | null = null;
  partyidOptions: ISelectItem[] = [];
customersegmentOptions: ISelectItem[] = [];
customercategoryOptions: ISelectItem[] = [];
relationshipmanageruseridOptions: ISelectItem[] = [];
owningorganisationunitidOptions: ISelectItem[] = [];
defaultgstregistrationidOptions: ISelectItem[] = [];
defaultbillinglocationidOptions: ISelectItem[] = [];
defaultdeliverylocationidOptions: ISelectItem[] = [];
preferredbillingfrequencyOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ICustomerProfile = {} as ICustomerProfile;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private customerProfileService: CustomerProfileService,
	private partyService: PartyService,
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
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
Description: new FormControl('', [Validators.maxLength(100), ]), 

    });
    this.loggedInUserService.getPartyOptions().subscribe({
      next: options => this.partyidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    const routePartyId = Number(this.activatedRoute.snapshot.paramMap.get('partyId'));
    this.partyId = routePartyId > 0 ? routePartyId : null;
    if (this.partyId) {
      this.editForm.patchValue({ PartyId: this.partyId });
      this.editForm.controls.PartyId.disable();
      this.loadParty(this.partyId);
    }
this.customersegmentOptions = this.loggedInUserService.getPicklistOptions('CustomerSegment');
this.customercategoryOptions = this.loggedInUserService.getPicklistOptions('CustomerCategory');
this.preferredbillingfrequencyOptions = this.loggedInUserService.getPicklistOptions('PreferredBillingFrequency');
    this.loggedInUserService.getLookupOptions('party-locations').subscribe({
      next: options => this.defaultbillinglocationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('party-locations').subscribe({
      next: options => this.defaultdeliverylocationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('party-gst-registrations').subscribe({
      next: options => this.defaultgstregistrationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('organisation-units').subscribe({
      next: options => this.owningorganisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('application-users').subscribe({
      next: options => this.relationshipmanageruseridOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });

  }

  private loadParty(partyId: number): void {
    this.partyService.getById(partyId).subscribe({
      next: response => {
        this.party = response.data;
        this.Caption = `Create Customer Profile - ${this.party.PartyCode}`;
      },
      error: err => this.messageService.showError(err)
    });
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
    if (this.partyId) {
      this.router.navigate(['/dashboard/customerProfiles/party', this.partyId]);
      return;
    }
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
	const selectedPartyId = this.partyId ?? Number(formValues.PartyId);
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PartyId: selectedPartyId || 0,
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
RecordStatus: 'Active',
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



