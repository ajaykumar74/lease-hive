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
import { IAssetWriteOff } from './assetWriteOff';
import { AssetWriteOffService } from './assetWriteOff.service';


@Component({
  selector: 'app-assetWriteOff-edit',
  standalone: false,
  templateUrl: './assetWriteOff-edit.component.html',
  providers: [ MessageService]
})
export class AssetWriteOffEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  assetWriteOff: IAssetWriteOff = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  disposalcaseidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
writeoffreasoncodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
insuranceclaimidOptions: ISelectItem[] = [];
approvedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetWriteOff = {} as IAssetWriteOff;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetWriteOffService: AssetWriteOffService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetWriteOff };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
DisposalCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
WriteOffDate: new FormControl(new Date(), [Validators.required]),
WriteOffReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceBookValue: new FormControl(0, []),
RecoveryAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
InsuranceClaimId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovedByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovedAt: new FormControl(new Date(), [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'DisposalCaseId', 'disposal-cases',
      options => this.disposalcaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.writeoffreasoncodeOptions = this.loggedInUserService.getPicklistOptions('WriteOffReasonCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'InsuranceClaimId', 'insurance-claims',
      options => this.insuranceclaimidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
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
    this.assetWriteOffService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetWriteOff = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetWriteOff };
        this.populateUI(this.assetWriteOff);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetWriteOff): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetId: obj.AssetId || 0,
WriteOffDate:  obj.WriteOffDate || new Date(),
WriteOffReasonCode: obj.WriteOffReasonCode || '',
ReferenceBookValue: obj.ReferenceBookValue || 0,
RecoveryAmount: obj.RecoveryAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
InsuranceClaimId: obj.InsuranceClaimId || 0,
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAt:  obj.ApprovedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetWriteOff Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/disposition/write-offs/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetWriteOff = { ...this.objMaster };
	var obj  = this.assetWriteOff;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetId: obj.AssetId || 0,
WriteOffDate:  obj.WriteOffDate || new Date(),
WriteOffReasonCode: obj.WriteOffReasonCode || '',
ReferenceBookValue: obj.ReferenceBookValue || 0,
RecoveryAmount: obj.RecoveryAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
InsuranceClaimId: obj.InsuranceClaimId || 0,
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
     DisposalCaseId:  formValues.DisposalCaseId || null,
AssetId:  formValues.AssetId || null,
WriteOffDate:  formValues.WriteOffDate || null,
WriteOffReasonCode:  formValues.WriteOffReasonCode || null,
ReferenceBookValue:  formValues.ReferenceBookValue || null,
RecoveryAmount:  formValues.RecoveryAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
InsuranceClaimId:  formValues.InsuranceClaimId || null,
ApprovedByUserId:  formValues.ApprovedByUserId || null,
ApprovedAt:  formValues.ApprovedAt || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetWriteOff ;
	
	this.spinner.show();  	   
    this.assetWriteOffService.update(this.assetWriteOff.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetWriteOff +  'Details Updated sucessfully.');
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
