import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IProfitCentre } from './profitCentre';
import { ProfitCentreService } from './profitCentre.service';

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
  Caption: string = 'Loading...';
  profitCentre: IProfitCentre = null;
  parentprofitcentreidOptions: ISelectItem[] = [];
  organisationunitidOptions: ISelectItem[] = [];
  externalledgercodeOptions: ISelectItem[] = [];
  recordstatusOptions: ISelectItem[] = [];

  editForm: any;
  objMaster: IProfitCentre = {} as IProfitCentre;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private profitCentreService: ProfitCentreService,
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
      RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      EffectiveFrom: new FormControl(new Date(), [Validators.required]),
      EffectiveTo: new FormControl(new Date(), []),
      Description: new FormControl('', [Validators.maxLength(100),]),

    });

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
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

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
        RecordStatus: obj.RecordStatus || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),
        Description: obj.Description || '',

      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/profitCentres/create']);
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
        RecordStatus: obj.RecordStatus || '',
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
    var createdObj = {
      Id: this.objMaster.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      ProfitCentreCode: formValues.ProfitCentreCode || null,
      ProfitCentreName: formValues.ProfitCentreName || null,
      ParentProfitCentreId: formValues.ParentProfitCentreId || null,
      OrganisationUnitId: formValues.OrganisationUnitId || null,
      ExternalLedgerCode: formValues.ExternalLedgerCode || null,
      RecordStatus: formValues.RecordStatus || null,
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



