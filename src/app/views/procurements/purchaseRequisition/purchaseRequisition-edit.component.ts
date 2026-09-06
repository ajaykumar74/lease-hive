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
import { IPurchaseRequisition } from './purchaseRequisition';
import { PurchaseRequisitionService } from './purchaseRequisition.service';


@Component({
  selector: 'app-purchaseRequisition-edit',
  standalone: false,
  templateUrl: './purchaseRequisition-edit.component.html',
  providers: [ MessageService]
})
export class PurchaseRequisitionEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  purchaseRequisition: IPurchaseRequisition = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  buyingorganisationidOptions: ISelectItem[] = [];
requestingorganisationunitidOptions: ISelectItem[] = [];
requestedbyuseridOptions: ISelectItem[] = [];
purchaserequisitionstatusidOptions: ISelectItem[] = [];
sourcereferencetypeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPurchaseRequisition = {} as IPurchaseRequisition;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private purchaseRequisitionService: PurchaseRequisitionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.purchaseRequisition };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
PRNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
BuyingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RequestingOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RequestedByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PurchaseRequisitionStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RequisitionDate: new FormControl(new Date(), [Validators.required]),
RequiredByDate: new FormControl(new Date(), []),
SourceReferenceType: new FormControl('', [Validators.maxLength(30), ]), 
SourceReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
EstimatedTotal: new FormControl(0, []),
Justification: new FormControl('', [Validators.maxLength(250), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyingOrganisationId', 'organisations',
      options => this.buyingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseRequisitionStatusId', 'purchase-requisition-statuses',
      options => this.purchaserequisitionstatusidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'RequestedByUserId', 'application-users',
      options => this.requestedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'RequestingOrganisationUnitId', 'organisation-units',
      options => this.requestingorganisationunitidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.sourcereferencetypeOptions = this.loggedInUserService.getPicklistOptions('PurchaseRequisitionSourceReferenceType');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
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
    this.purchaseRequisitionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.purchaseRequisition = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.purchaseRequisition };
        this.populateUI(this.purchaseRequisition);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPurchaseRequisition): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PRNo: obj.PRNo || '',
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
RequestingOrganisationUnitId: obj.RequestingOrganisationUnitId || 0,
RequestedByUserId: obj.RequestedByUserId || 0,
PurchaseRequisitionStatusId: obj.PurchaseRequisitionStatusId || 0,
RequisitionDate:  obj.RequisitionDate || new Date(),
RequiredByDate:  obj.RequiredByDate || new Date(),
SourceReferenceType: obj.SourceReferenceType || '',
SourceReferenceId: obj.SourceReferenceId || 0,
CurrencyCode: obj.CurrencyCode || '',
EstimatedTotal: obj.EstimatedTotal || 0,
Justification: obj.Justification || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "PurchaseRequisition Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/requisitions/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.purchaseRequisition = { ...this.objMaster };
	var obj  = this.purchaseRequisition;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PRNo: obj.PRNo || '',
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
RequestingOrganisationUnitId: obj.RequestingOrganisationUnitId || 0,
RequestedByUserId: obj.RequestedByUserId || 0,
PurchaseRequisitionStatusId: obj.PurchaseRequisitionStatusId || 0,
RequisitionDate:  obj.RequisitionDate || new Date(),
RequiredByDate:  obj.RequiredByDate || new Date(),
SourceReferenceType: obj.SourceReferenceType || '',
SourceReferenceId: obj.SourceReferenceId || 0,
CurrencyCode: obj.CurrencyCode || '',
EstimatedTotal: obj.EstimatedTotal || 0,
Justification: obj.Justification || '',
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
     PRNo:  formValues.PRNo || null,
BuyingOrganisationId:  formValues.BuyingOrganisationId || 0,
RequestingOrganisationUnitId:  formValues.RequestingOrganisationUnitId || 0,
RequestedByUserId:  formValues.RequestedByUserId || 0,
PurchaseRequisitionStatusId:  formValues.PurchaseRequisitionStatusId || 0,
RequisitionDate:  formValues.RequisitionDate || null,
RequiredByDate:  formValues.RequiredByDate || null,
SourceReferenceType:  formValues.SourceReferenceType || null,
SourceReferenceId:  formValues.SourceReferenceId || 0,
CurrencyCode:  formValues.CurrencyCode || null,
EstimatedTotal:  formValues.EstimatedTotal || 0,
Justification:  formValues.Justification || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IPurchaseRequisition ;
	
	this.spinner.show();  	   
    this.purchaseRequisitionService.update(this.purchaseRequisition.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PurchaseRequisition +  'Details Updated sucessfully.');
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
