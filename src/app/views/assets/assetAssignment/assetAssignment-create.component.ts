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
import { IAssetAssignment } from './assetAssignment';
import { AssetAssignmentService } from './assetAssignment.service';
import { AssetService } from '@/views/assets/asset/asset.service';
import { IAsset } from '@/views/assets/asset/asset';

@Component({
  selector: 'app-assetAssignment-create',
  standalone: false,
  templateUrl: './assetAssignment-create.component.html' ,
   providers: [ MessageService]
})
export class AssetAssignmentCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetAssignment: IAssetAssignment = null;
  assetId: number | null = null;
  asset: IAsset | null = null;
  assetidOptions: ISelectItem[] = [];
partyidOptions: ISelectItem[] = [];
partylocationidOptions: ISelectItem[] = [];
customerdepartmentidOptions: ISelectItem[] = [];
assetuseridOptions: ISelectItem[] = [];
assignmenttypeOptions: ISelectItem[] = [];
referencetypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetAssignment = {} as IAssetAssignment;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private assetAssignmentService: AssetAssignmentService,
	private assetService: AssetService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetAssignment };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerDepartmentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssignmentType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AssignedFrom: new FormControl(new Date(), [Validators.required]),
AssignedTo: new FormControl(new Date(), [Validators.required]),
IsPrimary: new FormControl(false, []),
AssignmentStatusId: new FormControl(0, [Validators.min(0), Validators.max(255)]),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceId: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    const routeAssetId = Number(this.activatedRoute.snapshot.paramMap.get('assetId'));
    this.assetId = routeAssetId > 0 ? routeAssetId : null;
    if (this.assetId) {
      this.editForm.patchValue({ AssetId: this.assetId });
      this.loadAsset(this.assetId);
    }
    else {
      this.loadAssetOptions();
    }
this.partyidOptions.push({Text: 'Party1', Value: 'Party1' });
this.partyidOptions.push({Text: 'Party2', Value: 'Party2' });
this.partylocationidOptions.push({Text: 'PartyLoca1', Value: 'PartyLoca1' });
this.partylocationidOptions.push({Text: 'PartyLoc2', Value: 'PartyLoc2' });
this.customerdepartmentidOptions.push({Text: 'CustDepart1', Value: 'CustDepart1' });
this.customerdepartmentidOptions.push({Text: 'CustDepart2', Value: 'CustDepart2' });
this.assetuseridOptions.push({Text: 'Assetuser1', Value: 'Assetuser1' });
this.assetuseridOptions.push({Text: 'Assetuser2', Value: 'Assetuser2' });
this.assignmenttypeOptions.push({Text: 'Lease', Value: 'Lease' });
this.assignmenttypeOptions.push({Text: 'Custody', Value: 'Custody' });
this.assignmenttypeOptions.push({Text: 'Demo', Value: 'Demo' });
this.assignmenttypeOptions.push({Text: 'Internal', Value: 'Internal' });
this.referencetypeOptions.push({Text: 'Contract', Value: 'Contract' });
this.referencetypeOptions.push({Text: 'Handover', Value: 'Handover' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });
    this.Caption = 'Create Asset Assignment';
  }

  private loadAsset(assetId: number): void {
    this.assetService.getById(assetId).subscribe({
      next: response => {
        this.asset = response.data;
        this.Caption = `Create Assignment - ${this.asset.AssetNo}`;
      },
      error: err => this.messageService.showError(err)
    });
  }

  private loadAssetOptions(): void {
    this.assetService.GetAll(false).subscribe({
      next: (response: any) => {
        const assets: IAsset[] = response.data || response || [];
        this.assetidOptions = assets.map(asset => ({
          Id: asset.Id,
          Value: asset.Id.toString(),
          Text: `${asset.AssetNo}${asset.PrimarySerialNo ? ' - ' + asset.PrimarySerialNo : ''}`
        }));
      },
      error: err => this.messageService.showError(err)
    });
  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetAssignmentService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetAssignment = data;
        this.objMaster = { ...this.assetAssignment };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetAssignment): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
PartyId: obj.PartyId || 0,
PartyLocationId: obj.PartyLocationId || 0,
CustomerDepartmentId: obj.CustomerDepartmentId || 0,
AssetUserId: obj.AssetUserId || 0,
AssignmentType: obj.AssignmentType || '',
AssignedFrom:  obj.AssignedFrom || new Date(),
AssignedTo:  obj.AssignedTo || new Date(),
IsPrimary:  obj.IsPrimary || false,
AssignmentStatusId: obj.AssignmentStatusId || 0,
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetAssignments/create']);
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
    if (this.assetId) {
      this.router.navigate(['/dashboard/assetAssignments/asset', this.assetId]);
      return;
    }
    this.assetAssignment = { ...this.objMaster };
    var obj  = this.assetAssignment;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
PartyId: obj.PartyId || 0,
PartyLocationId: obj.PartyLocationId || 0,
CustomerDepartmentId: obj.CustomerDepartmentId || 0,
AssetUserId: obj.AssetUserId || 0,
AssignmentType: obj.AssignmentType || '',
AssignedFrom:  obj.AssignedFrom || new Date(),
AssignedTo:  obj.AssignedTo || new Date(),
IsPrimary:  obj.IsPrimary || false,
AssignmentStatusId: obj.AssignmentStatusId || 0,
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || '',
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
  
  
	const formValues  = this.editForm.value ;
	const selectedAssetId = this.assetId ?? Number(formValues.AssetId);
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetId: selectedAssetId || 0,
PartyId: formValues.PartyId || 0,
PartyLocationId: formValues.PartyLocationId || 0,
CustomerDepartmentId: formValues.CustomerDepartmentId || 0,
AssetUserId: formValues.AssetUserId || 0,
AssignmentType: formValues.AssignmentType || null,
AssignedFrom: formValues.AssignedFrom || null,
AssignedTo: formValues.AssignedTo || null,
IsPrimary: formValues.IsPrimary || false,
AssignmentStatusId: formValues.AssignmentStatusId || null,
ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetAssignment ; 
	
	  this.spinner.show(); 
    this.assetAssignmentService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetAssignment +  'Details Updated sucessfully.');
		 if (this.assetId) {
		   this.router.navigate(['/dashboard/assetAssignments/asset', this.assetId]);
		 }
		 else {
		   this._location.back();
		 }
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

}



