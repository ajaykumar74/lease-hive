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
import { IAssetComplianceRecord } from './assetComplianceRecord';
import { AssetComplianceRecordService } from './assetComplianceRecord.service';


@Component({
  selector: 'app-assetComplianceRecord-edit',
  standalone: false,
  templateUrl: './assetComplianceRecord-edit.component.html',
  providers: [ MessageService]
})
export class AssetComplianceRecordEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetComplianceRecord: IAssetComplianceRecord = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
assetcompliancetypeidOptions: ISelectItem[] = [];
issuedbypartyidOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
verificationstatusidOptions: ISelectItem[] = [];
verifiedbyOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetComplianceRecord = {} as IAssetComplianceRecord;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetComplianceRecordService: AssetComplianceRecordService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetComplianceRecord };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetComplianceTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CertificateNo: new FormControl('', [Validators.maxLength(100), ]), 
IssuedByPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
IssueDate: new FormControl(new Date(), []),
ValidFrom: new FormControl(new Date(), []),
ValidTo: new FormControl(new Date(), []),
DocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
VerificationStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
VerifiedBy: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
VerifiedOn: new FormControl(new Date(), []),

    });

   this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.assetcompliancetypeidOptions.push({Text: 'AssetComplianceTypeId1', Value: 'AssetComplianceTypeId1' });
this.assetcompliancetypeidOptions.push({Text: 'AssetComplianceTypeId2', Value: 'AssetComplianceTypeId2' });
this.issuedbypartyidOptions.push({Text: 'IssuedByPartyId1', Value: 'IssuedByPartyId1' });
this.issuedbypartyidOptions.push({Text: 'IssuedByPartyId2', Value: 'IssuedByPartyId2' });
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.verificationstatusidOptions.push({Text: 'VerificationStatusId1', Value: 'VerificationStatusId1' });
this.verificationstatusidOptions.push({Text: 'VerificationStatusId2', Value: 'VerificationStatusId2' });
this.verifiedbyOptions.push({Text: 'VerifiedBy1', Value: 'VerifiedBy1' });
this.verifiedbyOptions.push({Text: 'VerifiedBy2', Value: 'VerifiedBy2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetComplianceRecordService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetComplianceRecord = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetComplianceRecord };
        this.populateUI(this.assetComplianceRecord);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetComplianceRecord): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
AssetComplianceTypeId: obj.AssetComplianceTypeId || 0,
CertificateNo: obj.CertificateNo || '',
IssuedByPartyId: obj.IssuedByPartyId || 0,
IssueDate:  obj.IssueDate || new Date(),
ValidFrom:  obj.ValidFrom || new Date(),
ValidTo:  obj.ValidTo || new Date(),
DocumentId: obj.DocumentId || 0,
VerificationStatusId: obj.VerificationStatusId || 0,
VerifiedBy: obj.VerifiedBy || 0,
VerifiedOn:  obj.VerifiedOn || new Date(),
 
      }
    );
   
	 this.Caption = "AssetComplianceRecord Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetComplianceRecord/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetComplianceRecord = { ...this.objMaster };
	var obj  = this.assetComplianceRecord;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
AssetComplianceTypeId: obj.AssetComplianceTypeId || 0,
CertificateNo: obj.CertificateNo || '',
IssuedByPartyId: obj.IssuedByPartyId || 0,
IssueDate:  obj.IssueDate || new Date(),
ValidFrom:  obj.ValidFrom || new Date(),
ValidTo:  obj.ValidTo || new Date(),
DocumentId: obj.DocumentId || 0,
VerificationStatusId: obj.VerificationStatusId || 0,
VerifiedBy: obj.VerifiedBy || 0,
VerifiedOn:  obj.VerifiedOn || new Date(),
 
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
     AssetId:  formValues.AssetId || null,
AssetComplianceTypeId:  formValues.AssetComplianceTypeId || null,
CertificateNo:  formValues.CertificateNo || null,
IssuedByPartyId:  formValues.IssuedByPartyId || null,
IssueDate:  formValues.IssueDate || null,
ValidFrom:  formValues.ValidFrom || null,
ValidTo:  formValues.ValidTo || null,
DocumentId:  formValues.DocumentId || null,
VerificationStatusId:  formValues.VerificationStatusId || null,
VerifiedBy:  formValues.VerifiedBy || null,
VerifiedOn:  formValues.VerifiedOn || null,

    } as IAssetComplianceRecord ;
	
	this.spinner.show();  	   
    this.assetComplianceRecordService.update(this.assetComplianceRecord.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetComplianceRecord +  'Details Updated sucessfully.');
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
