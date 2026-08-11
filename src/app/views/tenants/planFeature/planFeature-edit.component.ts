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
import { IPlanFeature } from './planFeature';
import { PlanFeatureService } from './planFeature.service';


@Component({
  selector: 'app-planFeature-edit',
  standalone: false,
  templateUrl: './planFeature-edit.component.html',
  providers: [ MessageService]
})
export class PlanFeatureEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  planFeature: IPlanFeature = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  
   editForm: any; 
  objMaster : IPlanFeature = {} as IPlanFeature;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private planFeatureService: PlanFeatureService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.planFeature };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
FeatureCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
FeatureName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),

    });

   
     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.planFeatureService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.planFeature = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.planFeature };
        this.populateUI(this.planFeature);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPlanFeature): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FeatureCode: obj.FeatureCode || '',
FeatureName: obj.FeatureName || '',
 
      }
    );
   
	 this.Caption = "PlanFeature Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/planFeature/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.planFeature = { ...this.objMaster };
	var obj  = this.planFeature;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FeatureCode: obj.FeatureCode || '',
FeatureName: obj.FeatureName || '',
 
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
     FeatureCode:  formValues.FeatureCode || null,
FeatureName:  formValues.FeatureName || null,

    } as IPlanFeature ;
	
	this.spinner.show();  	   
    this.planFeatureService.update(this.planFeature.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PlanFeature +  'Details Updated sucessfully.');
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
