import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { ISelectItem } from '@/shared/ISelectItem';
import { IFeature } from './feature';
import { FeatureService } from './feature.service';

@Component({
  selector: 'app-feature-create',
  standalone: false,
  templateUrl: './feature-create.component.html' ,
   providers: [ MessageService]
})
export class FeatureCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  feature: IFeature = null;
  recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IFeature = {} as IFeature;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private featureService: FeatureService
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.feature };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
FeatureCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
FeatureName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create Feature Definition';
    this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.featureService.getById(this.selectedId).subscribe({
      next: data => {
        this.feature = data;
        this.objMaster = { ...this.feature };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IFeature): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FeatureCode: obj.FeatureCode || '',
FeatureName: obj.FeatureName || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/features/create']);
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
    this.feature = { ...this.objMaster };
    var obj  = this.feature;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FeatureCode: obj.FeatureCode || '',
FeatureName: obj.FeatureName || '',
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
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     FeatureCode: formValues.FeatureCode || null,
FeatureName: formValues.FeatureName || null,
RecordStatus: formValues.RecordStatus || null,

    } as IFeature ; 
	
	  this.spinner.show(); 
    this.featureService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(Feature +  'Details Updated sucessfully.');
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



