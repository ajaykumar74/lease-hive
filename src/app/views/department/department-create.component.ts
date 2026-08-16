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
import { IDepartment } from './department';
import { DepartmentService } from './department.service';
import { OrganisationUnitService } from '@/views/organisationUnit/organisationUnit.service';
import { IOrganisationUnit } from '@/views/organisationUnit/organisationUnit';

@Component({
  selector: 'app-department-create',
  standalone: false,
  templateUrl: './department-create.component.html' ,
   providers: [ MessageService]
})
export class DepartmentCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Department';
  department: IDepartment = null;
  organisationUnitId: number | null = null;
  organisationUnit: IOrganisationUnit | null = null;
  organisationunitidOptions: ISelectItem[] = [];
parentdepartmentidOptions: ISelectItem[] = [];
departmentcodeOptions: ISelectItem[] = [];
departmenttypeOptions: ISelectItem[] = [];
headuseridOptions: ISelectItem[] = [];
costcentrecodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDepartment = {} as IDepartment;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private departmentService: DepartmentService,
	private organisationUnitService: OrganisationUnitService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.department };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
OrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ParentDepartmentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DepartmentCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DepartmentName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
DepartmentType: new FormControl('', [Validators.maxLength(20), ]), 
HeadUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CostCentreCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
Description: new FormControl('', [Validators.maxLength(100), ]), 

    });
    const routeId = Number(this.activatedRoute.snapshot.paramMap.get('organisationUnitId'));
    this.organisationUnitId = routeId > 0 ? routeId : null;
    if (this.organisationUnitId) {
      this.editForm.patchValue({ OrganisationUnitId: this.organisationUnitId });
      this.editForm.controls.OrganisationUnitId.disable();
      this.loadOrganisationUnit(this.organisationUnitId);
    }
this.departmentcodeOptions.push({Text: 'Credit', Value: 'Credit' });
this.departmentcodeOptions.push({Text: 'Finance', Value: 'Finance' });
this.departmentcodeOptions.push({Text: 'Sales', Value: 'Sales' });
this.departmenttypeOptions = this.loggedInUserService.getPicklistOptions('DepartmentType');
this.costcentrecodeOptions.push({Text: 'Center1', Value: '1' });
this.costcentrecodeOptions.push({Text: 'Center2', Value: '2' });
    this.loggedInUserService.getLookupOptions('application-users').subscribe({
      next: options => this.headuseridOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('organisation-units').subscribe({
      next: options => this.organisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('departments').subscribe({
      next: options => this.parentdepartmentidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });

  }

  private loadOrganisationUnit(organisationUnitId: number): void {
    this.organisationUnitService.getById(organisationUnitId).subscribe({
      next: response => {
        this.organisationUnit = response.data;
        this.Caption = `Create Department - ${this.organisationUnit.UnitCode}`;
      },
      error: err => this.messageService.showError(err)
    });
  }

 loadUI(): void {
    this.isLoading = true;    
    this.departmentService.getById(this.selectedId).subscribe({
      next: data => {
        this.department = data;
        this.objMaster = { ...this.department };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDepartment): void {
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
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/departments/create']);
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
    if (this.organisationUnitId) {
      this.router.navigate(['/dashboard/departments/organisation-unit', this.organisationUnitId]);
      return;
    }
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
  
  
	const formValues  = this.editForm.value ;
	const selectedOrganisationUnitId = this.organisationUnitId ?? Number(formValues.OrganisationUnitId);
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     OrganisationUnitId: selectedOrganisationUnitId || null,
ParentDepartmentId: formValues.ParentDepartmentId || null,
DepartmentCode: formValues.DepartmentCode || null,
DepartmentName: formValues.DepartmentName || null,
DepartmentType: formValues.DepartmentType || null,
HeadUserId: formValues.HeadUserId || null,
CostCentreCode: formValues.CostCentreCode || null,
RecordStatus: 'Active',
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
Description: formValues.Description || null,

    } as IDepartment ; 
	
	  this.spinner.show(); 
    this.departmentService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(Department +  'Details Updated sucessfully.');
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



