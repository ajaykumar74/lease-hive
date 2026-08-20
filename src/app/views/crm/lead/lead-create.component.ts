import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ILead } from './lead';
import { LeadService } from './lead.service';
import { LeadFormService } from './lead-form.service';

@Component({
  selector: 'app-lead-create',
  standalone: false,
  templateUrl: './lead-create.component.html',
  providers: [MessageService]
})
export class LeadCreateComponent implements OnInit {


  selectedId: number;
  isLoading: boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  lead: ILead = null;
  originatingorganisationidOptions: ISelectItem[] = [];
  ownerorganisationunitidOptions: ISelectItem[] = [];
  owneruseridOptions: ISelectItem[] = [];
  leadsourceidOptions: ISelectItem[] = [];
  leadstatusidOptions: ISelectItem[] = [];
  interestedassetcategoryidOptions: ISelectItem[] = [];
  currencycodeOptions: ISelectItem[] = [];

  editForm: any;
  objMaster: ILead = {} as ILead;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private leadService: LeadService,
    private leadFormService: LeadFormService

  ) {
  }





  ngOnInit(): void {
    this.objMaster = { ...this.lead };

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      OriginatingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
      OwnerOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      OwnerUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      LeadSourceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      LeadStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
      ProspectName: new FormControl('', [Validators.required, Validators.maxLength(150),]),
      ContactName: new FormControl('', [Validators.maxLength(100),]),
      Email: new FormControl('', [Validators.maxLength(100),]),
      Phone: new FormControl('', [Validators.maxLength(20),]),
      CountryCode: new FormControl('', [Validators.maxLength(20),]),
      InterestedAssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      CurrencyCode: new FormControl('', [Validators.maxLength(20),]),
      ExpectedCloseDate: new FormControl(new Date(), []),
      DisqualificationReason: new FormControl('', [Validators.maxLength(100),]),
      EffectiveFrom: new FormControl(new Date(), [Validators.required]),
      Description: new FormControl('', [Validators.maxLength(100),]),
      EstimatedValue: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.loadLookups();
    this.currencycodeOptions.push({ Text: 'INR', Value: 'INR' });
    this.currencycodeOptions.push({ Text: 'USD', Value: 'USD' });
    this.Caption = 'Create Lead';
  }

  private loadLookups(): void {
    this.leadFormService.loadLookups().subscribe(lookups => {
      this.originatingorganisationidOptions = lookups.originatingOrganisations;
      this.ownerorganisationunitidOptions = lookups.ownerOrganisationUnits;
      this.owneruseridOptions = lookups.ownerUsers;
      this.leadsourceidOptions = lookups.leadSources;
      this.leadstatusidOptions = lookups.leadStatuses;
      this.interestedassetcategoryidOptions = lookups.interestedAssetCategories;
    });
  }

  loadUI(): void {
    this.isLoading = true;
    this.leadService.getById(this.selectedId).subscribe({
      next: data => {
        this.lead = data;
        this.objMaster = { ...this.lead };
        this.populateUI(data);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }


  populateUI(obj: ILead): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        OriginatingOrganisationId: obj.OriginatingOrganisationId || 0,
        OwnerOrganisationUnitId: obj.OwnerOrganisationUnitId || 0,
        OwnerUserId: obj.OwnerUserId || 0,
        LeadSourceId: obj.LeadSourceId || 0,
        LeadStatusId: obj.LeadStatusId || 0,
        ProspectName: obj.ProspectName || '',
        ContactName: obj.ContactName || '',
        Email: obj.Email || '',
        Phone: obj.Phone || '',
        CountryCode: obj.CountryCode || '',
        InterestedAssetCategoryId: obj.InterestedAssetCategoryId || 0,
        CurrencyCode: obj.CurrencyCode || '',
        ExpectedCloseDate: obj.ExpectedCloseDate || new Date(),
        DisqualificationReason: obj.DisqualificationReason || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        Description: obj.Description || '',

      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/leads/create']);
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
    this.lead = { ...this.objMaster };
    var obj = this.lead;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        OriginatingOrganisationId: obj.OriginatingOrganisationId || 0,
        OwnerOrganisationUnitId: obj.OwnerOrganisationUnitId || 0,
        OwnerUserId: obj.OwnerUserId || 0,
        LeadSourceId: obj.LeadSourceId || 0,
        LeadStatusId: obj.LeadStatusId || 0,
        ProspectName: obj.ProspectName || '',
        ContactName: obj.ContactName || '',
        Email: obj.Email || '',
        Phone: obj.Phone || '',
        CountryCode: obj.CountryCode || '',
        InterestedAssetCategoryId: obj.InterestedAssetCategoryId || 0,
        EstimatedValue: obj.EstimatedValue || 0,
        CurrencyCode: obj.CurrencyCode || '',
        ExpectedCloseDate: obj.ExpectedCloseDate || new Date(),
        DisqualificationReason: obj.DisqualificationReason || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        Description: obj.Description || '',

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
    var createdObj = {
      Id: this.objMaster.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      OriginatingOrganisationId: formValues.OriginatingOrganisationId || 0,
      OwnerOrganisationUnitId: formValues.OwnerOrganisationUnitId || 0,
      OwnerUserId: formValues.OwnerUserId || 0,
      LeadSourceId: formValues.LeadSourceId || 0,
      LeadStatusId: formValues.LeadStatusId || 0,
      ProspectName: formValues.ProspectName || null,
      ContactName: formValues.ContactName || null,
      Email: formValues.Email || null,
      Phone: formValues.Phone || null,
      CountryCode: formValues.CountryCode || null,
      InterestedAssetCategoryId: formValues.InterestedAssetCategoryId || 0,
      EstimatedValue: formValues.EstimatedValue || null,
      CurrencyCode: formValues.CurrencyCode || null,
      ExpectedCloseDate: formValues.ExpectedCloseDate || null,
      DisqualificationReason: formValues.DisqualificationReason || null,
      RecordStatus: 'Active',
      EffectiveFrom: formValues.EffectiveFrom || null,
      EffectiveTo: null,
      Description: formValues.Description || null,

    } as ILead;

    this.spinner.show();
    this.leadService.create(createdObj).subscribe({
      next: data => {
        // this.messageService.showSuccess(Lead +  'Details Updated sucessfully.');
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



