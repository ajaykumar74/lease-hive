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
import { IPurchaseOptionExercise } from './purchaseOptionExercise';
import { PurchaseOptionExerciseService } from './purchaseOptionExercise.service';


@Component({
  selector: 'app-purchaseOptionExercise-edit',
  standalone: false,
  templateUrl: './purchaseOptionExercise-edit.component.html',
  providers: [ MessageService]
})
export class PurchaseOptionExerciseEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  purchaseOptionExercise: IPurchaseOptionExercise = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  endofleasecaseidOptions: ISelectItem[] = [];
leasecontractassetidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
approvedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPurchaseOptionExercise = {} as IPurchaseOptionExercise;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private purchaseOptionExerciseService: PurchaseOptionExerciseService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.purchaseOptionExercise };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
EndOfLeaseCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractAssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ExerciseDate: new FormControl(new Date(), [Validators.required]),
OptionPriceAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ApprovedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CompletedAt: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'EndOfLeaseCaseId', 'end-of-lease-cases',
      options => this.endofleasecaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId","CustomerPartyId":"CustomerPartyId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractAssetId', 'lease-contract-assets',
      options => this.leasecontractassetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerPartyId', 'parties',
      options => this.customerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('PurchaseOptionExerciseStatusCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'ApprovedByUserId', 'application-users',
      options => this.approvedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
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
    this.purchaseOptionExerciseService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.purchaseOptionExercise = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.purchaseOptionExercise };
        this.populateUI(this.purchaseOptionExercise);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPurchaseOptionExercise): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
LeaseContractAssetId: obj.LeaseContractAssetId || 0,
AssetId: obj.AssetId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
ExerciseDate:  obj.ExerciseDate || new Date(),
OptionPriceAmount: obj.OptionPriceAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
StatusCode: obj.StatusCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
CompletedAt:  obj.CompletedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "PurchaseOptionExercise Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/purchase-options/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.purchaseOptionExercise = { ...this.objMaster };
	var obj  = this.purchaseOptionExercise;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
LeaseContractAssetId: obj.LeaseContractAssetId || 0,
AssetId: obj.AssetId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
ExerciseDate:  obj.ExerciseDate || new Date(),
OptionPriceAmount: obj.OptionPriceAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
StatusCode: obj.StatusCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
CompletedAt:  obj.CompletedAt || new Date(),
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
     EndOfLeaseCaseId:  formValues.EndOfLeaseCaseId || 0,
LeaseContractAssetId:  formValues.LeaseContractAssetId || 0,
AssetId:  formValues.AssetId || 0,
CustomerPartyId:  formValues.CustomerPartyId || 0,
ExerciseDate:  formValues.ExerciseDate || null,
OptionPriceAmount:  formValues.OptionPriceAmount || 0,
CurrencyCode:  formValues.CurrencyCode || null,
StatusCode:  formValues.StatusCode || null,
ApprovedByUserId:  formValues.ApprovedByUserId || 0,
CompletedAt:  formValues.CompletedAt || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IPurchaseOptionExercise ;
	
	this.spinner.show();  	   
    this.purchaseOptionExerciseService.update(this.purchaseOptionExercise.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PurchaseOptionExercise +  'Details Updated sucessfully.');
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
