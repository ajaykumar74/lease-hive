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
import { IAssetDocumentLink } from './assetDocumentLink';
import { AssetDocumentLinkService } from './assetDocumentLink.service';
import { applyAssetPayloadDefaults } from '@/views/assets/asset-payload-defaults';

@Component({
  selector: 'app-assetDocumentLink-create',
  standalone: false,
  templateUrl: './assetDocumentLink-create.component.html' ,
   providers: [ MessageService]
})
export class AssetDocumentLinkCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetDocumentLink: IAssetDocumentLink = null;
  assetidOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
documentpurposeidOptions: ISelectItem[] = [];
verifiedbyOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetDocumentLink = {} as IAssetDocumentLink;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetDocumentLinkService: AssetDocumentLinkService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetDocumentLink };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentPurposeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
IsPrimary: new FormControl(false, [Validators.required]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
IsVerified: new FormControl(false, [Validators.required]),
VerifiedBy: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create AssetDocumentLink';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets', options => this.assetidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'DocumentId', 'documents', options => this.documentidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'DocumentPurposeId', 'asset-document-purposes', options => this.documentpurposeidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'VerifiedBy', 'application-users', options => this.verifiedbyOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetDocumentLinkService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetDocumentLink = data;
        this.objMaster = { ...this.assetDocumentLink };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetDocumentLink): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
DocumentId: obj.DocumentId || 0,
DocumentPurposeId: obj.DocumentPurposeId || 0,
IsPrimary:  obj.IsPrimary || false,
IsVerified:  obj.IsVerified || false,
VerifiedBy: obj.VerifiedBy || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/assets/documents/create']);
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
    this.assetDocumentLink = { ...this.objMaster };
    var obj  = this.assetDocumentLink;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
DocumentId: obj.DocumentId || 0,
DocumentPurposeId: obj.DocumentPurposeId || 0,
IsPrimary:  obj.IsPrimary || false,
IsVerified:  obj.IsVerified || false,
VerifiedBy: obj.VerifiedBy || 0,
 
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
DocumentId: formValues.DocumentId || 0,
DocumentPurposeId: formValues.DocumentPurposeId || 0,
IsPrimary: formValues.IsPrimary || false,
EffectiveFrom: new Date(),
EffectiveTo: null,
IsVerified: formValues.IsVerified || false,
VerifiedBy: formValues.VerifiedBy || 0,

    } as IAssetDocumentLink ; 
	applyAssetPayloadDefaults(createdObj, formValues, ['AssetId', 'DocumentId', 'DocumentPurposeId', 'VerifiedBy'], ['IsPrimary', 'IsVerified'], ['EffectiveFrom', 'EffectiveTo']);
	
	  this.spinner.show(); 
    this.assetDocumentLinkService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetDocumentLink +  'Details Updated sucessfully.');
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



