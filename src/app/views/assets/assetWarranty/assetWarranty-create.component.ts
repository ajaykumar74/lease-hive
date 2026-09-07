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
import { IAssetWarranty } from './assetWarranty';
import { AssetWarrantyService } from './assetWarranty.service';

@Component({
  selector: 'app-assetWarranty-create',
  standalone: false,
  templateUrl: './assetWarranty-create.component.html' ,
   providers: [ MessageService]
})
export class AssetWarrantyCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetWarranty: IAssetWarranty = null;
  assetidOptions: ISelectItem[] = [];
warrantyproviderpartyidOptions: ISelectItem[] = [];
warrantytypeidOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
warrantystatusidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetWarranty = {} as IAssetWarranty;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetWarrantyService: AssetWarrantyService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetWarranty };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
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
    this.Caption = 'Create AssetWarranty';
    this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.warrantyproviderpartyidOptions.push({Text: 'WarrantyProviderPartyId1', Value: 'WarrantyProviderPartyId1' });
this.warrantyproviderpartyidOptions.push({Text: 'WarrantyProviderPartyId2', Value: 'WarrantyProviderPartyId2' });
this.warrantytypeidOptions.push({Text: 'WarrantyTypeId1', Value: 'WarrantyTypeId1' });
this.warrantytypeidOptions.push({Text: 'WarrantyTypeId2', Value: 'WarrantyTypeId2' });
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.warrantystatusidOptions.push({Text: 'WarrantyStatusId1', Value: 'WarrantyStatusId1' });
this.warrantystatusidOptions.push({Text: 'WarrantyStatusId2', Value: 'WarrantyStatusId2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetWarrantyService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetWarranty = data;
        this.objMaster = { ...this.assetWarranty };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
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
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetWarrantys/create']);
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
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     AssetId: formValues.AssetId || 0,
WarrantyProviderPartyId: formValues.WarrantyProviderPartyId || 0,
WarrantyTypeId: formValues.WarrantyTypeId || 0,
WarrantyNo: formValues.WarrantyNo || null,
StartDate: formValues.StartDate || null,
EndDate: formValues.EndDate || null,
CoverageSummary: formValues.CoverageSummary || null,
DocumentId: formValues.DocumentId || 0,
WarrantyStatusId: formValues.WarrantyStatusId || 0,

    } as IAssetWarranty ; 
	
	  this.spinner.show(); 
    this.assetWarrantyService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetWarranty +  'Details Updated sucessfully.');
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



