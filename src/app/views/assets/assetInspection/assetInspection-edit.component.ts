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
import { IAssetInspection } from './assetInspection';
import { AssetInspectionService } from './assetInspection.service';


@Component({
  selector: 'app-assetInspection-edit',
  standalone: false,
  templateUrl: './assetInspection-edit.component.html',
  providers: [ MessageService]
})
export class AssetInspectionEditComponent implements OnInit {

  selectedId: number;
  assetId: number | null = null;
  isLoading: boolean = false;
  assetInspection: IAssetInspection = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
locationidOptions: ISelectItem[] = [];
partyidOptions: ISelectItem[] = [];
inspectoruseridOptions: ISelectItem[] = [];
conditiongradeidOptions: ISelectItem[] = [];
inspectionstatusidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetInspection = {} as IAssetInspection;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetInspectionService: AssetInspectionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetInspection };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InspectionTypeId: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
InspectionNo: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
InspectionDateTime: new FormControl(new Date(), [Validators.required]),
LocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
InspectorUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ConditionGradeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
OverallScore: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
InspectionStatusId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
CompletedOn: new FormControl(new Date(), []),

    });

   this.assetidOptions.push({Text: 'Asset1', Value: 'Asset1' });
this.assetidOptions.push({Text: 'Asset2', Value: 'Asset2' });
this.locationidOptions.push({Text: 'Location1', Value: 'Location1' });
this.locationidOptions.push({Text: 'Location2', Value: 'Location2' });
this.partyidOptions.push({Text: 'Party1', Value: 'Party1' });
this.partyidOptions.push({Text: 'Party2', Value: 'Party2' });
this.inspectoruseridOptions.push({Text: 'AppUser1', Value: 'AppUser1' });
this.inspectoruseridOptions.push({Text: 'AppUser2', Value: 'AppUser2' });
this.conditiongradeidOptions.push({Text: 'ConditionGrad1', Value: 'ConditionGrad1' });
this.conditiongradeidOptions.push({Text: 'ConditionGrad2', Value: 'ConditionGrad2' });
this.inspectionstatusidOptions.push({Text: 'InspectionStatus1', Value: 'InspectionStatus1' });
this.inspectionstatusidOptions.push({Text: 'InspectionStatus2', Value: 'InspectionStatus2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
     const routeAssetId = Number(this.activatedRouter.snapshot.paramMap.get('assetId'));
     this.assetId = routeAssetId > 0 ? routeAssetId : null;
     if (this.assetId) this.editForm.controls.AssetId.disable();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetInspectionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetInspection = data.data;
		if (this.assetId && this.assetInspection.AssetId !== this.assetId) {
		  this.messageService.showError('This record does not belong to the selected asset.');
		  this.router.navigate(['/dashboard/assetInspections/asset', this.assetId]);
		  return;
		}
		this.permission = data.permission;
        this.objMaster = { ...this.assetInspection };
        this.populateUI(this.assetInspection);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetInspection): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
InspectionTypeId: obj.InspectionTypeId || '',
InspectionNo: obj.InspectionNo || '',
InspectionDateTime:  obj.InspectionDateTime || new Date(),
LocationId: obj.LocationId || 0,
PartyId: obj.PartyId || 0,
InspectorUserId: obj.InspectorUserId || 0,
ConditionGradeId: obj.ConditionGradeId || 0,
OverallScore: obj.OverallScore || 0,
InspectionStatusId: obj.InspectionStatusId || 0,
Remarks: obj.Remarks || '',
CompletedOn:  obj.CompletedOn || new Date(),
 
      }
    );
   
	 this.Caption = "AssetInspection Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetInspection/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetInspection = { ...this.objMaster };
	var obj  = this.assetInspection;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
InspectionTypeId: obj.InspectionTypeId || '',
InspectionNo: obj.InspectionNo || '',
InspectionDateTime:  obj.InspectionDateTime || new Date(),
LocationId: obj.LocationId || 0,
PartyId: obj.PartyId || 0,
InspectorUserId: obj.InspectorUserId || 0,
ConditionGradeId: obj.ConditionGradeId || 0,
OverallScore: obj.OverallScore || 0,
InspectionStatusId: obj.InspectionStatusId || 0,
Remarks: obj.Remarks || '',
CompletedOn:  obj.CompletedOn || new Date(),
 
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
     AssetId:  this.assetId ?? formValues.AssetId ?? this.objMaster.AssetId,
InspectionTypeId:  formValues.InspectionTypeId || null,
InspectionNo:  formValues.InspectionNo || null,
InspectionDateTime:  formValues.InspectionDateTime || null,
LocationId:  formValues.LocationId || null,
PartyId:  formValues.PartyId || null,
InspectorUserId:  formValues.InspectorUserId || null,
ConditionGradeId:  formValues.ConditionGradeId || null,
OverallScore:  formValues.OverallScore || null,
InspectionStatusId:  formValues.InspectionStatusId || null,
Remarks:  formValues.Remarks || null,
CompletedOn:  formValues.CompletedOn || null,

    } as IAssetInspection ;
	
	this.spinner.show();  	   
    this.assetInspectionService.update(this.assetInspection.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetInspection +  'Details Updated sucessfully.');
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
