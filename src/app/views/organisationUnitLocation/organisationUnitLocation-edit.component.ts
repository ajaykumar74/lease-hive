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
import { IOrganisationUnitLocation } from './organisationUnitLocation';
import { OrganisationUnitLocationService } from './organisationUnitLocation.service';


@Component({
  selector: 'app-organisationUnitLocation-edit',
  standalone: false,
  templateUrl: './organisationUnitLocation-edit.component.html',
  providers: [ MessageService]
})
export class OrganisationUnitLocationEditComponent implements OnInit {

  selectedId: number;
  organisationUnitId: number | null = null;
  isLoading: boolean = false;
  organisationUnitLocation: IOrganisationUnitLocation = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  organisationunitidOptions: ISelectItem[] = [];
purposetypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IOrganisationUnitLocation = {} as IOrganisationUnitLocation;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private organisationUnitLocationService: OrganisationUnitLocationService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.organisationUnitLocation };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
OrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PurposeType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IsPrimary: new FormControl(false, [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.purposetypeOptions = this.loggedInUserService.getPicklistOptions('PurposeType');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
     const routeId = Number(this.activatedRouter.snapshot.paramMap.get('organisationUnitId'));
     this.organisationUnitId = routeId > 0 ? routeId : null;
     if (this.organisationUnitId) this.editForm.controls.OrganisationUnitId.disable();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.organisationUnitLocationService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.organisationUnitLocation = data.data;
		if (this.organisationUnitId && this.organisationUnitLocation.OrganisationUnitId !== this.organisationUnitId) {
		  this.messageService.showError('This record does not belong to the selected organisation unit.');
		  this.router.navigate(['/dashboard/organisationUnitLocations/organisation-unit', this.organisationUnitId]);
		  return;
		}
		this.permission = data.permission;
        this.objMaster = { ...this.organisationUnitLocation };
        this.populateUI(this.organisationUnitLocation);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IOrganisationUnitLocation): void {
    this.loggedInUserService.getLookupOptions('organisation-units', obj.OrganisationUnitId).subscribe({
      next: options => this.organisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationUnitId: obj.OrganisationUnitId || 0,
PurposeType: obj.PurposeType || '',
IsPrimary:  obj.IsPrimary || false,
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "OrganisationUnitLocation Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/organisationUnitLocation/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.organisationUnitLocation = { ...this.objMaster };
	var obj  = this.organisationUnitLocation;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationUnitId: obj.OrganisationUnitId || 0,
PurposeType: obj.PurposeType || '',
IsPrimary:  obj.IsPrimary || false,
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
     OrganisationUnitId:  this.organisationUnitId ?? formValues.OrganisationUnitId ?? this.objMaster.OrganisationUnitId,
PurposeType:  formValues.PurposeType || null,
IsPrimary:  formValues.IsPrimary || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IOrganisationUnitLocation ;
	
	this.spinner.show();  	   
    this.organisationUnitLocationService.update(this.organisationUnitLocation.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(OrganisationUnitLocation +  'Details Updated sucessfully.');
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
