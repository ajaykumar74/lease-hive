import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IProfitCentre } from './profitCentre';
import { ProfitCentreService } from './profitCentre.service';
import { OrganisationUnitService } from '@/views/organisations/organisationUnit/organisationUnit.service';
import { IOrganisationUnit } from '@/views/organisations/organisationUnit/organisationUnit';

@Component({
  selector: 'app-profitCentre-create',
  standalone: false,
  templateUrl: './profitCentre-create.component.html',
  providers: [MessageService]
})
export class ProfitCentreCreateComponent implements OnInit {


  selectedId: number;
  isLoading: boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Profit Centre';
  profitCentre: IProfitCentre = null;
  organisationUnitId: number | null = null;
  organisationUnit: IOrganisationUnit | null = null;
  parentprofitcentreidOptions: ISelectItem[] = [];
  organisationunitidOptions: ISelectItem[] = [];
  externalledgercodeOptions: ISelectItem[] = [];

  editForm: any;
  objMaster: IProfitCentre = {} as IProfitCentre;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private profitCentreService: ProfitCentreService,
    private organisationUnitService: OrganisationUnitService,
    private loggedInUserService: LoggedInUserService

  ) {
  }





  ngOnInit(): void {
    this.objMaster = { ...this.profitCentre };

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      ProfitCentreCode: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      ProfitCentreName: new FormControl('', [Validators.required, Validators.maxLength(100),]),
      ParentProfitCentreId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      OrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      ExternalLedgerCode: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      EffectiveFrom: new FormControl(new Date(), [Validators.required]),
      EffectiveTo: new FormControl(new Date(), []),
      Description: new FormControl('', [Validators.maxLength(100),]),

    });
    const routeId = Number(this.activatedRoute.snapshot.paramMap.get('organisationUnitId'));
    this.organisationUnitId = routeId > 0 ? routeId : null;
    if (this.organisationUnitId) {
      this.editForm.patchValue({ OrganisationUnitId: this.organisationUnitId });
      this.editForm.controls.OrganisationUnitId.disable();
      this.loadOrganisationUnit(this.organisationUnitId);
    }

    this.externalledgercodeOptions.push({ Text: 'Ledger1', Value: 'Ledger1' });
    this.externalledgercodeOptions.push({ Text: 'Ledger2', Value: 'Ledger2' });

        this.loggedInUserService.getLookupOptions('organisation-units').subscribe({
      next: options => this.organisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('profit-centres').subscribe({
      next: options => this.parentprofitcentreidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });

  }

  private loadOrganisationUnit(organisationUnitId: number): void {
    this.organisationUnitService.getById(organisationUnitId).subscribe({
      next: response => {
        this.organisationUnit = response.data;
        this.Caption = `Create Profit Centre - ${this.organisationUnit.UnitCode}`;
      },
      error: err => this.messageService.showError(err)
    });
  }

  loadUI(): void {
    this.isLoading = true;
    this.profitCentreService.getById(this.selectedId).subscribe({
      next: data => {
        this.profitCentre = data;
        this.objMaster = { ...this.profitCentre };
        this.populateUI(data);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }


  populateUI(obj: IProfitCentre): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        ProfitCentreCode: obj.ProfitCentreCode || '',
        ProfitCentreName: obj.ProfitCentreName || '',
        ParentProfitCentreId: obj.ParentProfitCentreId || 0,
        OrganisationUnitId: obj.OrganisationUnitId || 0,
        ExternalLedgerCode: obj.ExternalLedgerCode || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),
        Description: obj.Description || '',

      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/organisations/profit-centres/create']);
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
    if (this.organisationUnitId) {
      this.router.navigate(['/business/organisations/profit-centres/organisation-unit', this.organisationUnitId]);
      return;
    }
    this.profitCentre = { ...this.objMaster };
    var obj = this.profitCentre;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        ProfitCentreCode: obj.ProfitCentreCode || '',
        ProfitCentreName: obj.ProfitCentreName || '',
        ParentProfitCentreId: obj.ParentProfitCentreId || 0,
        OrganisationUnitId: obj.OrganisationUnitId || 0,
        ExternalLedgerCode: obj.ExternalLedgerCode || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),
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
    const selectedOrganisationUnitId = this.organisationUnitId ?? Number(formValues.OrganisationUnitId);
    var createdObj = {
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      ProfitCentreCode: formValues.ProfitCentreCode || null,
      ProfitCentreName: formValues.ProfitCentreName || null,
      ParentProfitCentreId: formValues.ParentProfitCentreId || null,
      OrganisationUnitId: selectedOrganisationUnitId || null,
      ExternalLedgerCode: formValues.ExternalLedgerCode || null,
      RecordStatus: 'Active',
      EffectiveFrom: formValues.EffectiveFrom || null,
      EffectiveTo: formValues.EffectiveTo || null,
      Description: formValues.Description || null,

    } as IProfitCentre;

    this.spinner.show();
    this.profitCentreService.create(createdObj).subscribe({
      next: data => {
        // this.messageService.showSuccess(ProfitCentre +  'Details Updated sucessfully.');
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



