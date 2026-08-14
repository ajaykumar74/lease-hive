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
import { IPartyRole } from './partyRole';
import { PartyRoleService } from './partyRole.service';

@Component({
  selector: 'app-partyRole-create',
  standalone: false,
  templateUrl: './partyRole-create.component.html',
  providers: [MessageService]
})
export class PartyRoleCreateComponent implements OnInit {


  selectedId: number;
  isLoading: boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyRole: IPartyRole = null;
  roletypeOptions: ISelectItem[] = [];
  rolecodeOptions: ISelectItem[] = [];
  organisationidOptions: ISelectItem[] = [];
  rolestatusOptions: ISelectItem[] = [];
  recordstatusOptions: ISelectItem[] = [];
  approvedbyOptions: ISelectItem[] = [];
  editForm: any;
  objMaster: IPartyRole = {} as IPartyRole;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private partyRoleService: PartyRoleService,
    private loggedInUserService: LoggedInUserService

  ) {
  }





  ngOnInit(): void {
    this.objMaster = { ...this.partyRole };

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      RoleType: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      RoleCode: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
      RoleStatus: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      OnboardingReference: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      ApprovedBy: new FormControl('', [  Validators.maxLength(20),]),
      ApprovedById: new FormControl('', []),
      ApprovedAt: new FormControl(new Date(), [Validators.required]),
      RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      EffectiveFrom: new FormControl(new Date(), [Validators.required]),
      EffectiveTo: new FormControl(new Date(), []),

    });
    this.roletypeOptions.push({ Text: 'Customer', Value: 'Customer' });
    this.roletypeOptions.push({ Text: 'Supplier', Value: 'Supplier' });
    this.roletypeOptions.push({ Text: 'Manufacturer', Value: 'Manufacturer' });
    this.roletypeOptions.push({ Text: 'Dealer', Value: 'Dealer' });
    this.roletypeOptions.push({ Text: 'Insurer', Value: 'Insurer' });
    this.roletypeOptions.push({ Text: 'Financier', Value: 'Financier' });
    this.roletypeOptions.push({ Text: 'Broker', Value: 'Broker' });
    this.roletypeOptions.push({ Text: 'ServiceProvider', Value: 'ServiceProvider' });
    this.rolecodeOptions.push({ Text: '', Value: '' });

    this.loggedInUserService.getOrganisationOptions().subscribe({
      next: options => this.organisationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });

    this.rolestatusOptions.push({ Text: 'Active', Value: 'Active' });
    this.rolestatusOptions.push({ Text: 'Disabled', Value: 'Disabled' });
    this.recordstatusOptions.push({ Text: 'Active', Value: 'Active' });
    this.recordstatusOptions.push({ Text: 'Disabled', Value: 'Disabled' });

    this.approvedbyOptions.push({ Text: 'User1', Value: '1' });
    this.approvedbyOptions.push({ Text: 'User2', Value: '2' });

  }

  loadUI(): void {
    this.isLoading = true;
    this.partyRoleService.getById(this.selectedId).subscribe({
      next: data => {
        this.partyRole = data;
        this.objMaster = { ...this.partyRole };
        this.populateUI(data);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }


  populateUI(obj: IPartyRole): void {
    this.editForm.patchValue(
      {
        TenantId: this.loggedInUserService.loggedInUser.Tenant.Id || 0,
        Id: obj.Id || 0,
        RoleType: obj.RoleType || '',
        RoleCode: obj.RoleCode || '',
        OrganisationId: obj.OrganisationId || 0,
        RoleStatus: obj.RoleStatus || '',
        OnboardingReference: obj.OnboardingReference || '',
        ApprovedBy: obj.ApprovedBy || '',
        ApprovedById: obj.ApprovedById || 0,
        ApprovedAt: obj.ApprovedAt || new Date(),
        RecordStatus: obj.RecordStatus || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),

      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/partyRoles/create']);
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
    this.partyRole = { ...this.objMaster };
    var obj = this.partyRole;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        RoleType: obj.RoleType || '',
        RoleCode: obj.RoleCode || '',
        OrganisationId: obj.OrganisationId || 0,
        RoleStatus: obj.RoleStatus || '',
        OnboardingReference: obj.OnboardingReference || '',
        ApprovedBy: obj.ApprovedBy || '',
        ApprovedById: obj.ApprovedById || '',
        ApprovedAt: obj.ApprovedAt || new Date(),
        RecordStatus: obj.RecordStatus || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),

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
       TenantId: this.loggedInUserService.loggedInUser.Tenant.Id || 0,
      RoleType: formValues.RoleType || null,
      RoleCode: formValues.RoleCode || null,
      OrganisationId: formValues.OrganisationId || null,
      RoleStatus: formValues.RoleStatus || null,
      OnboardingReference: formValues.OnboardingReference || null,
      ApprovedBy: formValues.ApprovedBy || null,
      ApprovedById: formValues.ApprovedById || null,
      ApprovedAt: formValues.ApprovedAt || null,
      RecordStatus: formValues.RecordStatus || null,
      EffectiveFrom: formValues.EffectiveFrom || null,
      EffectiveTo: formValues.EffectiveTo || null,

    } as IPartyRole;

    this.spinner.show();
    this.partyRoleService.create(createdObj).subscribe({
      next: data => {
        // this.messageService.showSuccess(PartyRole +  'Details Updated sucessfully.');
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



