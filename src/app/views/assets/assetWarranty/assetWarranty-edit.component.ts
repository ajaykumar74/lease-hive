import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  
 
 
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IAssetWarranty } from './assetWarranty';
import { AssetWarrantyService } from './assetWarranty.service';
import { applyAssetPayloadDefaults } from '@/views/assets/asset-payload-defaults';


@Component({
  selector: 'app-assetWarranty-edit',
  standalone: false,
  templateUrl: './assetWarranty-edit.component.html',
  providers: [ MessageService]
})
export class AssetWarrantyEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  assetWarranty: IAssetWarranty = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
warrantyproviderpartyidOptions: ISelectItem[] = [];
warrantytypeidOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
warrantystatusidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetWarranty = {} as IAssetWarranty;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetWarrantyService: AssetWarrantyService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetWarranty };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
WarrantyProviderPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
WarrantyTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
WarrantyNo: new FormControl('', [Validators.maxLength(100), ]), 
StartDate: new FormControl(new Date(), [Validators.required]),
EndDate: new FormControl(new Date(), []),
CoverageSummary: new FormControl('', [Validators.maxLength(1000), ]), 
DocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
WarrantyStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets', options => this.assetidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'WarrantyProviderPartyId', 'parties', options => this.warrantyproviderpartyidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'WarrantyTypeId', 'asset-warranty-types', options => this.warrantytypeidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'DocumentId', 'documents', options => this.documentidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'WarrantyStatusId', 'asset-warranty-statuses', options => this.warrantystatusidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetWarrantyService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetWarranty = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetWarranty };
        this.populateUI(this.assetWarranty);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetWarranty): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
WarrantyProviderPartyId: obj.WarrantyProviderPartyId || 0,
WarrantyTypeId: obj.WarrantyTypeId || 0,
WarrantyNo: obj.WarrantyNo || '',
StartDate:  obj.StartDate || new Date(),
EndDate:  obj.EndDate || new Date(),
CoverageSummary: obj.CoverageSummary || '',
DocumentId: obj.DocumentId || 0,
WarrantyStatusId: obj.WarrantyStatusId || 0,
 
      }
    );
   
	 this.Caption = "AssetWarranty Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/assets/warranties/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetWarranty = { ...this.objMaster };
	var obj  = this.assetWarranty;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
WarrantyProviderPartyId: obj.WarrantyProviderPartyId || 0,
WarrantyTypeId: obj.WarrantyTypeId || 0,
WarrantyNo: obj.WarrantyNo || '',
StartDate:  obj.StartDate || new Date(),
EndDate:  obj.EndDate || new Date(),
CoverageSummary: obj.CoverageSummary || '',
DocumentId: obj.DocumentId || 0,
WarrantyStatusId: obj.WarrantyStatusId || 0,
 
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
     AssetId:  formValues.AssetId || null,
WarrantyProviderPartyId:  formValues.WarrantyProviderPartyId || null,
WarrantyTypeId:  formValues.WarrantyTypeId || null,
WarrantyNo:  formValues.WarrantyNo || null,
StartDate:  formValues.StartDate || null,
EndDate:  formValues.EndDate || null,
CoverageSummary:  formValues.CoverageSummary || null,
DocumentId:  formValues.DocumentId || null,
WarrantyStatusId:  formValues.WarrantyStatusId || null,

    } as IAssetWarranty ;
	applyAssetPayloadDefaults(updatedObj, formValues, ['AssetId', 'WarrantyProviderPartyId', 'WarrantyTypeId', 'DocumentId', 'WarrantyStatusId'], [], ['StartDate', 'EndDate']);
	
	this.spinner.show();  	   
    this.assetWarrantyService.update(this.assetWarranty.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetWarranty +  'Details Updated sucessfully.');
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
