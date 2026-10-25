import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  
 
 
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { ISelectItem } from '@/shared/ISelectItem';
import { IFeature } from './feature';
import { FeatureService } from './feature.service';


@Component({
  selector: 'app-feature-edit',
  standalone: false,
  templateUrl: './feature-edit.component.html',
  providers: [ MessageService]
})
export class FeatureEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  feature: IFeature = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IFeature = {} as IFeature;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private featureService: FeatureService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.feature };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
FeatureCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
FeatureName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.featureService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.feature = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.feature };
        this.populateUI(this.feature);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "Feature Definition #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/feature/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     FeatureCode:  formValues.FeatureCode || null,
FeatureName:  formValues.FeatureName || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IFeature ;
	
	this.spinner.show();  	   
    this.featureService.update(this.feature.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(Feature +  'Details Updated sucessfully.');
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
