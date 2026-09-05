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
import { ILeaseContract } from './leaseContract';
import { LeaseContractService } from './leaseContract.service';


@Component({
  selector: 'app-leaseContract-edit',
  standalone: false,
  templateUrl: './leaseContract-edit.component.html',
  providers: [ MessageService]
})
export class LeaseContractEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  leaseContract: ILeaseContract = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  lessororganisationidOptions: ISelectItem[] = [];
servicingorganisationunitidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
leasecontractstatusidOptions: ISelectItem[] = [];
sourcereferencetypeOptions: ISelectItem[] = [];
quoteidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ILeaseContract = {} as ILeaseContract;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private leaseContractService: LeaseContractService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.leaseContract };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ContractNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
VersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
LessorOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ServicingOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SourceReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
SourceReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
QuoteId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CreditApprovalReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ContractDate: new FormControl(new Date(), [Validators.required]),
CommencementDate: new FormControl(new Date(), []),
MaturityDate: new FormControl(new Date(), []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ContractTitle: new FormControl('', [Validators.maxLength(200), ]), 
ExternalReference: new FormControl('', [Validators.maxLength(80), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'LessorOrganisationId', 'organisations',
      options => this.lessororganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ServicingOrganisationUnitId', 'organisation-units',
      options => this.servicingorganisationunitidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerPartyId', 'parties',
      options => this.customerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractStatusId', 'lease-contract-statuses',
      options => this.leasecontractstatusidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.sourcereferencetypeOptions = this.loggedInUserService.getPicklistOptions('SourceReferenceType');
this.loggedInUserService.bindEntityLookup(this.editForm, 'QuoteId', 'quotes',
      options => this.quoteidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
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
    this.leaseContractService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.leaseContract = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.leaseContract };
        this.populateUI(this.leaseContract);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ILeaseContract): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractNo: obj.ContractNo || '',
VersionNo: obj.VersionNo || 0,
LessorOrganisationId: obj.LessorOrganisationId || 0,
ServicingOrganisationUnitId: obj.ServicingOrganisationUnitId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
LeaseContractStatusId: obj.LeaseContractStatusId || 0,
SourceReferenceType: obj.SourceReferenceType || '',
SourceReferenceId: obj.SourceReferenceId || 0,
QuoteId: obj.QuoteId || 0,
CreditApprovalReferenceId: obj.CreditApprovalReferenceId || 0,
ContractDate:  obj.ContractDate || new Date(),
CommencementDate:  obj.CommencementDate || new Date(),
MaturityDate:  obj.MaturityDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
ContractTitle: obj.ContractTitle || '',
ExternalReference: obj.ExternalReference || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "LeaseContract Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contracts/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.leaseContract = { ...this.objMaster };
	var obj  = this.leaseContract;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractNo: obj.ContractNo || '',
VersionNo: obj.VersionNo || 0,
LessorOrganisationId: obj.LessorOrganisationId || 0,
ServicingOrganisationUnitId: obj.ServicingOrganisationUnitId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
LeaseContractStatusId: obj.LeaseContractStatusId || 0,
SourceReferenceType: obj.SourceReferenceType || '',
SourceReferenceId: obj.SourceReferenceId || 0,
QuoteId: obj.QuoteId || 0,
CreditApprovalReferenceId: obj.CreditApprovalReferenceId || 0,
ContractDate:  obj.ContractDate || new Date(),
CommencementDate:  obj.CommencementDate || new Date(),
MaturityDate:  obj.MaturityDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
ContractTitle: obj.ContractTitle || '',
ExternalReference: obj.ExternalReference || '',
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
     ContractNo:  formValues.ContractNo || null,
VersionNo:  formValues.VersionNo || 0,
LessorOrganisationId:  formValues.LessorOrganisationId || 0,
ServicingOrganisationUnitId:  formValues.ServicingOrganisationUnitId || 0,
CustomerPartyId:  formValues.CustomerPartyId || 0,
LeaseContractStatusId:  formValues.LeaseContractStatusId || 0,
SourceReferenceType:  formValues.SourceReferenceType || null,
SourceReferenceId:  formValues.SourceReferenceId || 0,
QuoteId:  formValues.QuoteId || 0,
CreditApprovalReferenceId:  formValues.CreditApprovalReferenceId || 0,
ContractDate:  formValues.ContractDate || null,
CommencementDate:  formValues.CommencementDate || null,
MaturityDate:  formValues.MaturityDate || null,
CurrencyCode:  formValues.CurrencyCode || null,
ContractTitle:  formValues.ContractTitle || null,
ExternalReference:  formValues.ExternalReference || null,
RecordStatus:  formValues.RecordStatus || null,

    } as ILeaseContract ;
	
	this.spinner.show();  	   
    this.leaseContractService.update(this.leaseContract.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(LeaseContract +  'Details Updated sucessfully.');
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
