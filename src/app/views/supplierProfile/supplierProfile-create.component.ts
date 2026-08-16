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
import { ISupplierProfile } from './supplierProfile';
import { SupplierProfileService } from './supplierProfile.service';
import { PartyService } from '@/views/party/party.service';
import { IParty } from '@/views/party/party';

@Component({
  selector: 'app-supplierProfile-create',
  standalone: false,
  templateUrl: './supplierProfile-create.component.html' ,
   providers: [ MessageService]
})
export class SupplierProfileCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Supplier Profile';
  supplierProfile: ISupplierProfile = null;
  partyId: number | null = null;
  party: IParty | null = null;
  partyidOptions: ISelectItem[] = [];
suppliertierOptions: ISelectItem[] = [];
suppliercategoryOptions: ISelectItem[] = [];
procurementowneruseridOptions: ISelectItem[] = [];
owningorganisationunitidOptions: ISelectItem[] = [];
defaultgstregistrationidOptions: ISelectItem[] = [];
defaultremittancebankaccountidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ISupplierProfile = {} as ISupplierProfile;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private supplierProfileService: SupplierProfileService,
	private partyService: PartyService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.supplierProfile };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SupplierTier: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SupplierCategory: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ProcurementOwnerUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
OwningOrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DefaultGSTRegistrationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DefaultRemittanceBankAccountId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LeadTimeDays: new FormControl(0, [Validators.min(0), Validators.max(255)]),
MinimumOrderValue: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DefaultPaymentTermsDays: new FormControl(0, [Validators.min(0), Validators.max(255)]), 
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
SupplierRating: new FormControl(0, []),
OnTimeDeliveryPercentage: new FormControl(0, []),
QualityAcceptancePercentage: new FormControl(0, []),
IsPurchaseBlocked: new FormControl(false, []),
BlockReason: new FormControl('', [Validators.maxLength(100), ]), 
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
this.suppliertierOptions = this.loggedInUserService.getPicklistOptions('SupplierTier');
this.suppliercategoryOptions = this.loggedInUserService.getPicklistOptions('SupplierCategory');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
    this.loggedInUserService.getLookupOptions('party-gst-registrations').subscribe({
      next: options => this.defaultgstregistrationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('party-bank-accounts').subscribe({
      next: options => this.defaultremittancebankaccountidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('organisation-units').subscribe({
      next: options => this.owningorganisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('application-users').subscribe({
      next: options => this.procurementowneruseridOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });

  }

  private loadParty(partyId: number): void {
    this.partyService.getById(partyId).subscribe({
      next: response => {
        this.party = response.data;
        this.Caption = `Create Supplier Profile - ${this.party.PartyCode}`;
      },
      error: err => this.messageService.showError(err)
    });
  }

 loadUI(): void {
    this.isLoading = true;    
    this.supplierProfileService.getById(this.selectedId).subscribe({
      next: data => {
        this.supplierProfile = data;
        this.objMaster = { ...this.supplierProfile };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ISupplierProfile): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
SupplierCode: obj.SupplierCode || '',
SupplierTier: obj.SupplierTier || '',
SupplierCategory: obj.SupplierCategory || '',
ProcurementOwnerUserId: obj.ProcurementOwnerUserId || 0,
OwningOrganisationUnitId: obj.OwningOrganisationUnitId || 0,
DefaultGSTRegistrationId: obj.DefaultGSTRegistrationId || 0,
DefaultRemittanceBankAccountId: obj.DefaultRemittanceBankAccountId || 0,
LeadTimeDays: obj.LeadTimeDays || 0,
MinimumOrderValue: obj.MinimumOrderValue || 0,
DefaultPaymentTermsDays: obj.DefaultPaymentTermsDays || 0, 
CurrencyCode: obj.CurrencyCode || '',
SupplierRating: obj.SupplierRating || 0,
OnTimeDeliveryPercentage: obj.OnTimeDeliveryPercentage || 0,
QualityAcceptancePercentage: obj.QualityAcceptancePercentage || 0,
IsPurchaseBlocked:  obj.IsPurchaseBlocked || false,
BlockReason: obj.BlockReason || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/supplierProfiles/create']);
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
      this.router.navigate(['/dashboard/supplierProfiles/party', this.partyId]);
      return;
    }
    this.supplierProfile = { ...this.objMaster };
    var obj  = this.supplierProfile;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
SupplierCode: obj.SupplierCode || '',
SupplierTier: obj.SupplierTier || '',
SupplierCategory: obj.SupplierCategory || '',
ProcurementOwnerUserId: obj.ProcurementOwnerUserId || 0,
OwningOrganisationUnitId: obj.OwningOrganisationUnitId || 0,
DefaultGSTRegistrationId: obj.DefaultGSTRegistrationId || 0,
DefaultRemittanceBankAccountId: obj.DefaultRemittanceBankAccountId || 0,
LeadTimeDays: obj.LeadTimeDays || 0,
MinimumOrderValue: obj.MinimumOrderValue || 0,
DefaultPaymentTermsDays: obj.DefaultPaymentTermsDays || 0, 
CurrencyCode: obj.CurrencyCode || '',
SupplierRating: obj.SupplierRating || 0,
OnTimeDeliveryPercentage: obj.OnTimeDeliveryPercentage || 0,
QualityAcceptancePercentage: obj.QualityAcceptancePercentage || 0,
IsPurchaseBlocked:  obj.IsPurchaseBlocked || false,
BlockReason: obj.BlockReason || '',
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
SupplierCode: formValues.SupplierCode || null,
SupplierTier: formValues.SupplierTier || null,
SupplierCategory: formValues.SupplierCategory || null,
ProcurementOwnerUserId: formValues.ProcurementOwnerUserId || 0,
OwningOrganisationUnitId: formValues.OwningOrganisationUnitId || 0,
DefaultGSTRegistrationId: formValues.DefaultGSTRegistrationId || 0,
DefaultRemittanceBankAccountId: formValues.DefaultRemittanceBankAccountId || 0,
LeadTimeDays: formValues.LeadTimeDays || null,
MinimumOrderValue: formValues.MinimumOrderValue || 0,
DefaultPaymentTermsDays: formValues.DefaultPaymentTermsDays || null, 
CurrencyCode: formValues.CurrencyCode || null,
SupplierRating: formValues.SupplierRating || 0,
OnTimeDeliveryPercentage: formValues.OnTimeDeliveryPercentage || 0,
QualityAcceptancePercentage: formValues.QualityAcceptancePercentage || 0,
IsPurchaseBlocked: formValues.IsPurchaseBlocked || false,
BlockReason: formValues.BlockReason || null,
RecordStatus: 'Active',
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
Description: formValues.Description || null,

    } as ISupplierProfile ; 
	
	  this.spinner.show(); 
    this.supplierProfileService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(SupplierProfile +  'Details Updated sucessfully.');
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



