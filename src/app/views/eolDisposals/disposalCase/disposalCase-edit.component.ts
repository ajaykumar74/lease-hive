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
import { IDisposalCase } from './disposalCase';
import { DisposalCaseService } from './disposalCase.service';


@Component({
  selector: 'app-disposalCase-edit',
  standalone: false,
  templateUrl: './disposalCase-edit.component.html',
  providers: [ MessageService]
})
export class DisposalCaseEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  disposalCase: IDisposalCase = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetdispositiondecisionidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
organisationidOptions: ISelectItem[] = [];
dispositionmethodidOptions: ISelectItem[] = [];
assignedtouseridOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDisposalCase = {} as IDisposalCase;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private disposalCaseService: DisposalCaseService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.disposalCase };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetDispositionDecisionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DispositionMethodId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OpenedAt: new FormControl(new Date(), [Validators.required]),
TargetCompletionDate: new FormControl(new Date(), []),
AssignedToUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ClosedAt: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetDispositionDecisionId', 'asset-disposition-decisions',
      options => this.assetdispositiondecisionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'OrganisationId', 'organisations',
      options => this.organisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'DispositionMethodId', 'disposition-methods',
      options => this.dispositionmethodidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssignedToUserId', 'application-users',
      options => this.assignedtouseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('DisposalCaseStatusCode');
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
    this.disposalCaseService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.disposalCase = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.disposalCase };
        this.populateUI(this.disposalCase);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IDisposalCase): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetDispositionDecisionId: obj.AssetDispositionDecisionId || 0,
AssetId: obj.AssetId || 0,
OrganisationId: obj.OrganisationId || 0,
DispositionMethodId: obj.DispositionMethodId || 0,
OpenedAt:  obj.OpenedAt || new Date(),
TargetCompletionDate:  obj.TargetCompletionDate || new Date(),
AssignedToUserId: obj.AssignedToUserId || 0,
StatusCode: obj.StatusCode || '',
ClosedAt:  obj.ClosedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "DisposalCase Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/disposition/cases/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.disposalCase = { ...this.objMaster };
	var obj  = this.disposalCase;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetDispositionDecisionId: obj.AssetDispositionDecisionId || 0,
AssetId: obj.AssetId || 0,
OrganisationId: obj.OrganisationId || 0,
DispositionMethodId: obj.DispositionMethodId || 0,
OpenedAt:  obj.OpenedAt || new Date(),
TargetCompletionDate:  obj.TargetCompletionDate || new Date(),
AssignedToUserId: obj.AssignedToUserId || 0,
StatusCode: obj.StatusCode || '',
ClosedAt:  obj.ClosedAt || new Date(),
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
     AssetDispositionDecisionId:  formValues.AssetDispositionDecisionId || 0,
AssetId:  formValues.AssetId || 0,
OrganisationId:  formValues.OrganisationId || 0,
DispositionMethodId:  formValues.DispositionMethodId || 0,
OpenedAt:  formValues.OpenedAt || null,
TargetCompletionDate:  formValues.TargetCompletionDate || null,
AssignedToUserId:  formValues.AssignedToUserId || 0,
StatusCode:  formValues.StatusCode || null,
ClosedAt:  formValues.ClosedAt || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IDisposalCase ;
	
	this.spinner.show();  	   
    this.disposalCaseService.update(this.disposalCase.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(DisposalCase +  'Details Updated sucessfully.');
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
