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
import { IAssetOwnershipHistory } from './assetOwnershipHistory';
import { AssetOwnershipHistoryService } from './assetOwnershipHistory.service';


@Component({
  selector: 'app-assetOwnershipHistory-edit',
  standalone: false,
  templateUrl: './assetOwnershipHistory-edit.component.html',
  providers: [ MessageService]
})
export class AssetOwnershipHistoryEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  assetId: number | null = null;
  isLoading: boolean = false;
  assetOwnershipHistory: IAssetOwnershipHistory = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
ownershiptypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetOwnershipHistory = {} as IAssetOwnershipHistory;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetOwnershipHistoryService: AssetOwnershipHistoryService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetOwnershipHistory };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OwnershipType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AcquisitionReference: new FormControl('', [Validators.maxLength(50), ]), 
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.ownershiptypeOptions = this.loggedInUserService.getPicklistOptions('OwnershipType');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
     const routeAssetId = Number(this.activatedRouter.snapshot.paramMap.get('assetId'));
     this.assetId = routeAssetId > 0 ? routeAssetId : null;
     if (this.assetId) this.editForm.controls.AssetId.disable();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetOwnershipHistoryService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetOwnershipHistory = data.data;
		if (this.assetId && this.assetOwnershipHistory.AssetId !== this.assetId) {
		  this.messageService.showError('This record does not belong to the selected asset.');
		  this.router.navigate(['/dashboard/assetOwnershipHistorys/asset', this.assetId]);
		  return;
		}
		this.permission = data.permission;
        this.objMaster = { ...this.assetOwnershipHistory };
        this.populateUI(this.assetOwnershipHistory);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetOwnershipHistory): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
OrganisationId: obj.OrganisationId || 0,
OwnershipType: obj.OwnershipType || '',
AcquisitionReference: obj.AcquisitionReference || '',
Remarks: obj.Remarks || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetOwnershipHistory Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetOwnershipHistory/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetOwnershipHistory = { ...this.objMaster };
	var obj  = this.assetOwnershipHistory;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
OrganisationId: obj.OrganisationId || 0,
OwnershipType: obj.OwnershipType || '',
AcquisitionReference: obj.AcquisitionReference || '',
Remarks: obj.Remarks || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
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
     AssetId:  this.assetId ?? formValues.AssetId ?? this.objMaster.AssetId,
OrganisationId:  formValues.OrganisationId || 0,
OwnershipType:  formValues.OwnershipType || null,
AcquisitionReference:  formValues.AcquisitionReference || null,
Remarks:  formValues.Remarks || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetOwnershipHistory ;
	
	this.spinner.show();  	   
    this.assetOwnershipHistoryService.update(this.assetOwnershipHistory.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetOwnershipHistory +  'Details Updated sucessfully.');
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
