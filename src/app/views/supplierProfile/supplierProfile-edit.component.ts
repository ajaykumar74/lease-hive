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
import { ISupplierProfile } from './supplierProfile';
import { SupplierProfileService } from './supplierProfile.service';


@Component({
  selector: 'app-supplierProfile-edit',
  standalone: false,
  templateUrl: './supplierProfile-edit.component.html',
  providers: [ MessageService]
})
export class SupplierProfileEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  supplierProfile: ISupplierProfile = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyidOptions: ISelectItem[] = [];
suppliertierOptions: ISelectItem[] = [];
suppliercategoryOptions: ISelectItem[] = [];
procurementowneruseridOptions: ISelectItem[] = [];
owningorganisationunitidOptions: ISelectItem[] = [];
defaultgstregistrationidOptions: ISelectItem[] = [];
defaultremittancebankaccountidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ISupplierProfile = {} as ISupplierProfile;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private supplierProfileService: SupplierProfileService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.supplierProfile };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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
IsPurchaseBlocked: new FormControl(false), 
BlockReason: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
Description: new FormControl('', [Validators.maxLength(100), ]), 

    });


this.suppliertierOptions.push({Text: 'Strategic', Value: 'Strategic' });
this.suppliertierOptions.push({Text: 'Preferred', Value: 'Preferred' });
this.suppliertierOptions.push({Text: 'Approved', Value: 'Approved' });
this.suppliertierOptions.push({Text: 'Conditional', Value: 'Conditional' });
this.suppliertierOptions.push({Text: 'Blocked', Value: 'Blocked' });
this.suppliercategoryOptions.push({Text: '"OEM', Value: '"OEM' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
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
    this.supplierProfileService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.supplierProfile = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.supplierProfile };
        this.populateUI(this.supplierProfile);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ISupplierProfile): void {
    this.loggedInUserService.getLookupOptions('party-gst-registrations', obj.DefaultGSTRegistrationId).subscribe({
      next: options => this.defaultgstregistrationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('party-bank-accounts', obj.DefaultRemittanceBankAccountId).subscribe({
      next: options => this.defaultremittancebankaccountidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('organisation-units', obj.OwningOrganisationUnitId).subscribe({
      next: options => this.owningorganisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('application-users', obj.ProcurementOwnerUserId).subscribe({
      next: options => this.procurementowneruseridOptions = options,
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
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
      }
    );
   
	 this.Caption = "SupplierProfile Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/supplierProfile/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }
     else if (key == "ServiceArea") {
        this.router.navigate(['dashboard/supplierServiceAreas/list', { id:this.supplierProfile.Id  }]);
    }

  }



  onCancel(): void {
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PartyId:  formValues.PartyId || null,
SupplierCode:  formValues.SupplierCode || null,
SupplierTier:  formValues.SupplierTier || null,
SupplierCategory:  formValues.SupplierCategory || null,
ProcurementOwnerUserId:  formValues.ProcurementOwnerUserId || null,
OwningOrganisationUnitId:  formValues.OwningOrganisationUnitId || null,
DefaultGSTRegistrationId:  formValues.DefaultGSTRegistrationId || null,
DefaultRemittanceBankAccountId:  formValues.DefaultRemittanceBankAccountId || null,
LeadTimeDays:  formValues.LeadTimeDays || null,
MinimumOrderValue:  formValues.MinimumOrderValue || null,
DefaultPaymentTermsDays:  formValues.DefaultPaymentTermsDays || null, 
CurrencyCode:  formValues.CurrencyCode || null,
SupplierRating:  formValues.SupplierRating || null,
OnTimeDeliveryPercentage:  formValues.OnTimeDeliveryPercentage || null,
QualityAcceptancePercentage:  formValues.QualityAcceptancePercentage || null,
IsPurchaseBlocked:  formValues.IsPurchaseBlocked || null,
BlockReason:  formValues.BlockReason || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
Description:  formValues.Description || null,

    } as ISupplierProfile ;
	
	this.spinner.show();  	   
    this.supplierProfileService.update(this.supplierProfile.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(SupplierProfile +  'Details Updated sucessfully.');
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
