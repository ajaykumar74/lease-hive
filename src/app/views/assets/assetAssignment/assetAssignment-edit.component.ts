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
import { IAssetAssignment } from './assetAssignment';
import { AssetAssignmentService } from './assetAssignment.service';


@Component({
  selector: 'app-assetAssignment-edit',
  standalone: false,
  templateUrl: './assetAssignment-edit.component.html',
  providers: [ MessageService]
})
export class AssetAssignmentEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  assetId: number | null = null;
  isLoading: boolean = false;
  assetAssignment: IAssetAssignment = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
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


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetAssignmentService: AssetAssignmentService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetAssignment };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerDepartmentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssignmentType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AssignedFrom: new FormControl(new Date(), [Validators.required]),
AssignedTo: new FormControl(new Date(), [Validators.required]),
IsPrimary: new FormControl(false), 
AssignmentStatusId: new FormControl(0, [Validators.min(0), Validators.max(255)]),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceId: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PartyId', 'parties',
      options => this.partyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PartyLocationId', 'party-locations',
      options => this.partylocationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"PartyId":"PartyId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerDepartmentId', 'customer-departments',
      options => this.customerdepartmentidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"PartyId":"PartyId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetUserId', 'asset-users',
      options => this.assetuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.assignmenttypeOptions = this.loggedInUserService.getPicklistOptions('AssignmentType');
this.referencetypeOptions = this.loggedInUserService.getPicklistOptions('AssetAssignmentReferenceType');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
     const routeAssetId = Number(this.activatedRouter.snapshot.paramMap.get('assetId'));
     this.assetId = routeAssetId > 0 ? routeAssetId : null;
     if (this.assetId) {
       this.editForm.controls.AssetId.disable();
     }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetAssignmentService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetAssignment = data.data;
		if (this.assetId && this.assetAssignment.AssetId !== this.assetId) {
		  this.messageService.showError('This assignment does not belong to the selected asset.');
		  this.router.navigate(['/dashboard/assetAssignments/asset', this.assetId]);
		  return;
		}
		this.permission = data.permission;
        this.objMaster = { ...this.assetAssignment };
        this.populateUI(this.assetAssignment);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "AssetAssignment Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      const route = this.assetId
        ? ['/dashboard/assetAssignments/asset', this.assetId, 'create']
        : ['/dashboard/assetAssignments/create'];
      this.router.navigate(route);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
AssetId:  this.assetId ?? formValues.AssetId ?? this.objMaster.AssetId,
PartyId:  formValues.PartyId || 0,
PartyLocationId:  formValues.PartyLocationId || 0,
CustomerDepartmentId:  formValues.CustomerDepartmentId || 0,
AssetUserId:  formValues.AssetUserId || 0,
AssignmentType:  formValues.AssignmentType || null,
AssignedFrom:  formValues.AssignedFrom || null,
AssignedTo:  formValues.AssignedTo || null,
IsPrimary:  formValues.IsPrimary || false,
AssignmentStatusId:  formValues.AssignmentStatusId || 0,
ReferenceType:  formValues.ReferenceType || null,
ReferenceId:  formValues.ReferenceId || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetAssignment ;
	
	this.spinner.show();  	   
    this.assetAssignmentService.update(this.assetAssignment.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetAssignment +  'Details Updated sucessfully.');
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
