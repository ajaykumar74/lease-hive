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
import { IDepartment } from './department';
import { DepartmentService } from './department.service';


@Component({
  selector: 'app-department-edit',
  standalone: false,
  templateUrl: './department-edit.component.html',
  providers: [ MessageService]
})
export class DepartmentEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  department: IDepartment = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  organisationunitidOptions: ISelectItem[] = [];
parentdepartmentidOptions: ISelectItem[] = [];
departmentcodeOptions: ISelectItem[] = [];
departmenttypeOptions: ISelectItem[] = [];
headuseridOptions: ISelectItem[] = [];
costcentrecodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDepartment = {} as IDepartment;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private departmentService: DepartmentService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.department };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
OrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ParentDepartmentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DepartmentCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DepartmentName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
DepartmentType: new FormControl('', [Validators.maxLength(20), ]), 
HeadUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CostCentreCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
Description: new FormControl('', [Validators.maxLength(100), ]), 

    });
this.departmentcodeOptions.push({Text: 'Credit', Value: 'Credit' });
this.departmentcodeOptions.push({Text: 'Finance', Value: 'Finance' });
this.departmentcodeOptions.push({Text: 'Sales', Value: 'Sales' });
this.departmenttypeOptions.push({Text: 'Risk', Value: 'Risk' });
this.departmenttypeOptions.push({Text: 'Sales', Value: 'Sales' });
this.costcentrecodeOptions.push({Text: 'Center1', Value: 'Center1' });
this.costcentrecodeOptions.push({Text: 'Center2', Value: 'Center2' });
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
    this.departmentService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.department = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.department };
        this.populateUI(this.department);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IDepartment): void {
    this.loggedInUserService.getLookupOptions('application-users', obj.HeadUserId).subscribe({
      next: options => this.headuseridOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('organisation-units', obj.OrganisationUnitId).subscribe({
      next: options => this.organisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('departments', obj.ParentDepartmentId).subscribe({
      next: options => this.parentdepartmentidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationUnitId: obj.OrganisationUnitId || 0,
ParentDepartmentId: obj.ParentDepartmentId || 0,
DepartmentCode: obj.DepartmentCode || '',
DepartmentName: obj.DepartmentName || '',
DepartmentType: obj.DepartmentType || '',
HeadUserId: obj.HeadUserId || 0,
CostCentreCode: obj.CostCentreCode || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
      }
    );
   
	 this.Caption = "Department Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/department/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.department = { ...this.objMaster };
	var obj  = this.department;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationUnitId: obj.OrganisationUnitId || 0,
ParentDepartmentId: obj.ParentDepartmentId || 0,
DepartmentCode: obj.DepartmentCode || '',
DepartmentName: obj.DepartmentName || '',
DepartmentType: obj.DepartmentType || '',
HeadUserId: obj.HeadUserId || 0,
CostCentreCode: obj.CostCentreCode || '',
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
     OrganisationUnitId:  formValues.OrganisationUnitId || null,
ParentDepartmentId:  formValues.ParentDepartmentId || null,
DepartmentCode:  formValues.DepartmentCode || null,
DepartmentName:  formValues.DepartmentName || null,
DepartmentType:  formValues.DepartmentType || null,
HeadUserId:  formValues.HeadUserId || null,
CostCentreCode:  formValues.CostCentreCode || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
Description:  formValues.Description || null,

    } as IDepartment ;
	
	this.spinner.show();  	   
    this.departmentService.update(this.department.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(Department +  'Details Updated sucessfully.');
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
