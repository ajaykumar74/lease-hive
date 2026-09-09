import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IAssetValuation } from './assetValuation';
import { AssetValuationService } from './assetValuation.service';
import { applyAssetPayloadDefaults } from '@/views/assets/asset-payload-defaults';

@Component({
  selector: 'app-assetValuation-create',
  standalone: false,
  templateUrl: './assetValuation-create.component.html' ,
   providers: [ MessageService]
})
export class AssetValuationCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetValuation: IAssetValuation = null;
  assetidOptions: ISelectItem[] = [];
valuationtypeidOptions: ISelectItem[] = [];
valuerpartyidOptions: ISelectItem[] = [];
referencedocumentidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetValuation = {} as IAssetValuation;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetValuationService: AssetValuationService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetValuation };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ValuationTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ValuationDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ValuationAmount: new FormControl(0, [Validators.required]),
ValuerPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MethodCode: new FormControl('', [Validators.maxLength(20), ]), 
ReferenceDocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ValidTo: new FormControl(new Date(), []),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 

    });
    this.Caption = 'Create AssetValuation';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets', options => this.assetidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ValuationTypeId', 'asset-valuation-types', options => this.valuationtypeidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ValuerPartyId', 'parties', options => this.valuerpartyidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ReferenceDocumentId', 'documents', options => this.referencedocumentidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetValuationService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetValuation = data;
        this.objMaster = { ...this.assetValuation };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetValuation): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
ValuationTypeId: obj.ValuationTypeId || 0,
ValuationDate:  obj.ValuationDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
ValuationAmount: obj.ValuationAmount || 0,
ValuerPartyId: obj.ValuerPartyId || 0,
MethodCode: obj.MethodCode || '',
ReferenceDocumentId: obj.ReferenceDocumentId || 0,
ValidTo:  obj.ValidTo || new Date(),
Remarks: obj.Remarks || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/assets/valuations/create']);
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
    this.assetValuation = { ...this.objMaster };
    var obj  = this.assetValuation;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
ValuationTypeId: obj.ValuationTypeId || 0,
ValuationDate:  obj.ValuationDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
ValuationAmount: obj.ValuationAmount || 0,
ValuerPartyId: obj.ValuerPartyId || 0,
MethodCode: obj.MethodCode || '',
ReferenceDocumentId: obj.ReferenceDocumentId || 0,
ValidTo:  obj.ValidTo || new Date(),
Remarks: obj.Remarks || '',
 
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     AssetId: formValues.AssetId || 0,
ValuationTypeId: formValues.ValuationTypeId || 0,
ValuationDate: formValues.ValuationDate || null,
CurrencyCode: formValues.CurrencyCode || null,
ValuationAmount: formValues.ValuationAmount || 0,
ValuerPartyId: formValues.ValuerPartyId || 0,
MethodCode: formValues.MethodCode || null,
ReferenceDocumentId: formValues.ReferenceDocumentId || 0,
ValidTo: formValues.ValidTo || null,
Remarks: formValues.Remarks || null,

    } as IAssetValuation ; 
	applyAssetPayloadDefaults(createdObj, formValues, ['AssetId', 'ValuationTypeId', 'ValuationAmount', 'ValuerPartyId', 'ReferenceDocumentId'], [], ['ValuationDate', 'ValidTo']);
	
	  this.spinner.show(); 
    this.assetValuationService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetValuation +  'Details Updated sucessfully.');
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



