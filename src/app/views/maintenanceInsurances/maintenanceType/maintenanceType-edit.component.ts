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
import { IMaintenanceType } from './maintenanceType';
import { MaintenanceTypeService } from './maintenanceType.service';


@Component({
  selector: 'app-maintenanceType-edit',
  standalone: false,
  templateUrl: './maintenanceType-edit.component.html',
  providers: [ MessageService]
})
export class MaintenanceTypeEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  maintenanceType: IMaintenanceType = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IMaintenanceType = {} as IMaintenanceType;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private maintenanceTypeService: MaintenanceTypeService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceType };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
MaintenanceTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
MaintenanceTypeName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
IsPlanned: new FormControl(false, [Validators.required]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.maintenanceTypeService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.maintenanceType = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.maintenanceType };
        this.populateUI(this.maintenanceType);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IMaintenanceType): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenanceTypeCode: obj.MaintenanceTypeCode || '',
MaintenanceTypeName: obj.MaintenanceTypeName || '',
Description: obj.Description || '',
IsPlanned:  obj.IsPlanned || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "MaintenanceType Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/maintenance/configuration/types/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.maintenanceType = { ...this.objMaster };
	var obj  = this.maintenanceType;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenanceTypeCode: obj.MaintenanceTypeCode || '',
MaintenanceTypeName: obj.MaintenanceTypeName || '',
Description: obj.Description || '',
IsPlanned:  obj.IsPlanned || false,
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
     MaintenanceTypeCode:  formValues.MaintenanceTypeCode || null,
MaintenanceTypeName:  formValues.MaintenanceTypeName || null,
Description:  formValues.Description || null,
IsPlanned:  formValues.IsPlanned || false,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IMaintenanceType ;
	
	this.spinner.show();  	   
    this.maintenanceTypeService.update(this.maintenanceType.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(MaintenanceType +  'Details Updated sucessfully.');
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
