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
import { IAssetDispositionDecision } from './assetDispositionDecision';
import { AssetDispositionDecisionService } from './assetDispositionDecision.service';


@Component({
  selector: 'app-assetDispositionDecision-edit',
  standalone: false,
  templateUrl: './assetDispositionDecision-edit.component.html',
  providers: [ MessageService]
})
export class AssetDispositionDecisionEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  assetDispositionDecision: IAssetDispositionDecision = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  endofleasecaseidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
dispositionmethodidOptions: ISelectItem[] = [];
referencevaluationidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
approvedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetDispositionDecision = {} as IAssetDispositionDecision;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetDispositionDecisionService: AssetDispositionDecisionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetDispositionDecision };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
EndOfLeaseCaseId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DispositionMethodId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DecisionDate: new FormControl(new Date(), [Validators.required]),
ReferenceValuationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
TargetAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
Reason: new FormControl('', [Validators.maxLength(100), ]), 
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ApprovedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovedAt: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'EndOfLeaseCaseId', 'end-of-lease-cases',
      options => this.endofleasecaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'DispositionMethodId', 'disposition-methods',
      options => this.dispositionmethodidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.referencevaluationidOptions.push({Text: 'ReferenceValuationId1', Value: 'ReferenceValuationId1' });
this.referencevaluationidOptions.push({Text: 'ReferenceValuationId2', Value: 'ReferenceValuationId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('AssetDispositionDecisionStatusCode');
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
    this.assetDispositionDecisionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetDispositionDecision = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetDispositionDecision };
        this.populateUI(this.assetDispositionDecision);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetDispositionDecision): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
AssetId: obj.AssetId || 0,
DispositionMethodId: obj.DispositionMethodId || 0,
DecisionDate:  obj.DecisionDate || new Date(),
ReferenceValuationId: obj.ReferenceValuationId || 0,
TargetAmount: obj.TargetAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
Reason: obj.Reason || '',
StatusCode: obj.StatusCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAt:  obj.ApprovedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetDispositionDecision Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/disposition/decisions/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetDispositionDecision = { ...this.objMaster };
	var obj  = this.assetDispositionDecision;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
AssetId: obj.AssetId || 0,
DispositionMethodId: obj.DispositionMethodId || 0,
DecisionDate:  obj.DecisionDate || new Date(),
ReferenceValuationId: obj.ReferenceValuationId || 0,
TargetAmount: obj.TargetAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
Reason: obj.Reason || '',
StatusCode: obj.StatusCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAt:  obj.ApprovedAt || new Date(),
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
AssetId:  formValues.AssetId || 0,
DispositionMethodId:  formValues.DispositionMethodId || 0,
DecisionDate:  formValues.DecisionDate || null,
ReferenceValuationId:  formValues.ReferenceValuationId || 0,
TargetAmount:  formValues.TargetAmount || 0,
CurrencyCode:  formValues.CurrencyCode || null,
Reason:  formValues.Reason || null,
StatusCode:  formValues.StatusCode || null,
ApprovedByUserId:  formValues.ApprovedByUserId || 0,
ApprovedAt:  formValues.ApprovedAt || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetDispositionDecision ;
	
	this.spinner.show();  	   
    this.assetDispositionDecisionService.update(this.assetDispositionDecision.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetDispositionDecision +  'Details Updated sucessfully.');
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
