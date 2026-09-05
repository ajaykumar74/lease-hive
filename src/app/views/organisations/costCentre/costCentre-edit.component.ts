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
import { ICostCentre } from './costCentre';
import { CostCentreService } from './costCentre.service';


@Component({
  selector: 'app-costCentre-edit',
  standalone: false,
  templateUrl: './costCentre-edit.component.html',
  providers: [ MessageService]
})
export class CostCentreEditComponent implements OnInit {

  selectedId: number;
  organisationUnitId: number | null = null;
  isLoading: boolean = false;
  costCentre: ICostCentre = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  parentcostcentreidOptions: ISelectItem[] = [];
organisationunitidOptions: ISelectItem[] = [];
externalledgercodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ICostCentre = {} as ICostCentre;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private costCentreService: CostCentreService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.costCentre };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
CostCentreCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CostCentreName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
ParentCostCentreId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
OrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ExternalLedgerCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
Description: new FormControl('', [Validators.maxLength(100), ]), 

    });
this.externalledgercodeOptions.push({Text: 'Ledger1', Value: 'Ledger1' });
this.externalledgercodeOptions.push({Text: 'Ledger2', Value: 'Ledger2' });
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
    this.costCentreService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.costCentre = data.data;
		if (this.organisationUnitId && this.costCentre.OrganisationUnitId !== this.organisationUnitId) {
		  this.messageService.showError('This record does not belong to the selected organisation unit.');
		  this.router.navigate(['/business/organisations/cost-centres/organisation-unit', this.organisationUnitId]);
		  return;
		}
		this.permission = data.permission;
        this.objMaster = { ...this.costCentre };
        this.populateUI(this.costCentre);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ICostCentre): void {
    this.loggedInUserService.getLookupOptions('organisation-units', obj.OrganisationUnitId).subscribe({
      next: options => this.organisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('cost-centres', obj.ParentCostCentreId).subscribe({
      next: options => this.parentcostcentreidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CostCentreCode: obj.CostCentreCode || '',
CostCentreName: obj.CostCentreName || '',
ParentCostCentreId: obj.ParentCostCentreId || 0,
OrganisationUnitId: obj.OrganisationUnitId || 0,
ExternalLedgerCode: obj.ExternalLedgerCode || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
      }
    );
   
	 this.Caption = "CostCentre Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/organisations/cost-centres/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.costCentre = { ...this.objMaster };
	var obj  = this.costCentre;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CostCentreCode: obj.CostCentreCode || '',
CostCentreName: obj.CostCentreName || '',
ParentCostCentreId: obj.ParentCostCentreId || 0,
OrganisationUnitId: obj.OrganisationUnitId || 0,
ExternalLedgerCode: obj.ExternalLedgerCode || '',
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
     CostCentreCode:  formValues.CostCentreCode || null,
CostCentreName:  formValues.CostCentreName || null,
ParentCostCentreId:  formValues.ParentCostCentreId || 0,
     OrganisationUnitId:  this.organisationUnitId ?? formValues.OrganisationUnitId ?? this.objMaster.OrganisationUnitId,
ExternalLedgerCode:  formValues.ExternalLedgerCode || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
Description:  formValues.Description || null,

    } as ICostCentre ;
	
	this.spinner.show();  	   
    this.costCentreService.update(this.costCentre.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(CostCentre +  'Details Updated sucessfully.');
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
