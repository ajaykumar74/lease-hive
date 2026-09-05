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
import { IOpportunityStage } from './opportunityStage';
import { OpportunityStageService } from './opportunityStage.service';


@Component({
  selector: 'app-opportunityStage-edit',
  standalone: false,
  templateUrl: './opportunityStage-edit.component.html',
  providers: [ MessageService]
})
export class OpportunityStageEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  opportunityStage: IOpportunityStage = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IOpportunityStage = {} as IOpportunityStage;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private opportunityStageService: OpportunityStageService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.opportunityStage };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
StageCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StageName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
DefaultProbabilityPct: new FormControl(0, [Validators.min(0), Validators.max(255)]),
IsWon: new FormControl(false), 
IsLost: new FormControl(false), 
SortOrder: new FormControl(0, [Validators.min(0), Validators.max(255)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

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
    this.opportunityStageService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.opportunityStage = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.opportunityStage };
        this.populateUI(this.opportunityStage);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IOpportunityStage): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StageCode: obj.StageCode || '',
StageName: obj.StageName || '',
DefaultProbabilityPct: obj.DefaultProbabilityPct || 0,
IsWon:  obj.IsWon || false,
IsLost:  obj.IsLost || false,
SortOrder: obj.SortOrder || 0,
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "OpportunityStage Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/crm/config/opportunity-stages/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.opportunityStage = { ...this.objMaster };
	var obj  = this.opportunityStage;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StageCode: obj.StageCode || '',
StageName: obj.StageName || '',
DefaultProbabilityPct: obj.DefaultProbabilityPct || 0,
IsWon:  obj.IsWon || false,
IsLost:  obj.IsLost || false,
SortOrder: obj.SortOrder || 0,
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
     StageCode:  formValues.StageCode || null,
StageName:  formValues.StageName || null,
DefaultProbabilityPct:  formValues.DefaultProbabilityPct || 0,
IsWon:  formValues.IsWon || false,
IsLost:  formValues.IsLost || false,
SortOrder:  formValues.SortOrder || 0,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IOpportunityStage ;
	
	this.spinner.show();  	   
    this.opportunityStageService.update(this.opportunityStage.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(OpportunityStage +  'Details Updated sucessfully.');
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
