import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


import { MenuItem, MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IOrganisationUnit } from './organisationUnit';
import { OrganisationUnitService } from './organisationUnit.service';


@Component({
  selector: 'app-organisationUnit-edit',
  standalone: false,
  templateUrl: './organisationUnit-edit.component.html',
  providers: [MessageService]
})
export class OrganisationUnitEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  organisationUnit: IOrganisationUnit = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  parentorganisationunitidOptions: ISelectItem[] = [];
  unittypeOptions: ISelectItem[] = [];
  costcentrecodeOptions: ISelectItem[] = [];
  profitcentrecodeOptions: ISelectItem[] = [];
  defaultlocationidOptions: ISelectItem[] = [];
  statusOptions: ISelectItem[] = [];

  editForm: any;
  objMaster: IOrganisationUnit = {} as IOrganisationUnit;
  menuItems: MenuItem[] = [];

  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private organisationUnitService: OrganisationUnitService,
    private loggedInUserService: LoggedInUserService
  ) {
  }

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;



  ngOnInit(): void {
    this.objMaster = { ...this.organisationUnit };

    this.editForm = this.fb.group({
      Id: new FormControl(0, [Validators.required]),
      ParentOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      UnitCode: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      UnitName: new FormControl('', [Validators.required, Validators.maxLength(256),]),
      UnitType: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      CostCentreCode: new FormControl('', [Validators.maxLength(20),]),
      ProfitCentreCode: new FormControl('', [Validators.maxLength(20),]),
      ManagerUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      DefaultLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
      IsContractingUnit: new FormControl(false, [Validators.required]),
      IsBillingUnit: new FormControl(false, [Validators.required]),
      EffectiveFrom: new FormControl(new Date(), [Validators.required]),
      EffectiveTo: new FormControl(new Date(), []),
      Status: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      HierarchyPath: new FormControl('', [Validators.maxLength(256),]),
      Description: new FormControl('', [Validators.maxLength(256),]),



    });
    this.unittypeOptions = this.loggedInUserService.getPicklistOptions('UnitType');
    this.costcentrecodeOptions.push({ Text: 'U001', Value: 'U001' });
    this.costcentrecodeOptions.push({ Text: 'U002', Value: 'U002' });
    this.profitcentrecodeOptions.push({ Text: 'U001', Value: 'U001' });
    this.profitcentrecodeOptions.push({ Text: 'U002', Value: 'U002' });
    this.statusOptions = this.loggedInUserService.getPicklistOptions('Status');

    this.selectedId = this.activatedRouter.snapshot.params['id'];

    this.menuItems = [
      { label: 'Departments', icon: 'pi pi-sitemap', command: () => this.onCommandClicked('Departments') },
      { label: 'Mapped Locations', icon: 'pi pi-map-marker', command: () => this.onCommandClicked('Locations') },
      { label: 'Cost Centres', icon: 'pi pi-wallet', command: () => this.onCommandClicked('CostCentres') },
      { label: 'Profit Centres', icon: 'pi pi-chart-line', command: () => this.onCommandClicked('ProfitCentres') }
    ];
  }

  onCommandClicked(key: string) {
    if (key == "Departments") this.router.navigate(['/business/organisations/departments/organisation-unit', this.organisationUnit.Id]);
    else if (key == "Locations") this.router.navigate(['/business/organisations/unit-locations/organisation-unit', this.organisationUnit.Id]);
    else if (key == "CostCentres") this.router.navigate(['/business/organisations/cost-centres/organisation-unit', this.organisationUnit.Id]);
    else if (key == "ProfitCentres") this.router.navigate(['/business/organisations/profit-centres/organisation-unit', this.organisationUnit.Id]);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500);
  }


  loadUI(): void {
    this.isLoading = true;
    this.organisationUnitService.getById(this.selectedId).subscribe({
      next: data => {
        this.organisationUnit = data.data;
        this.permission = data.permission;
        this.objMaster = { ...this.organisationUnit };
        this.populateUI(this.organisationUnit);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }

  populateUI(obj: IOrganisationUnit): void {
    this.loggedInUserService.getLookupOptions('locations', obj.DefaultLocationId).subscribe({
      next: options => this.defaultlocationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('organisation-units', obj.ParentOrganisationUnitId).subscribe({
      next: options => this.parentorganisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        ParentOrganisationUnitId: obj.ParentOrganisationUnitId || 0,
        UnitCode: obj.UnitCode || '',
        UnitName: obj.UnitName || '',
        UnitType: obj.UnitType || '',
        CostCentreCode: obj.CostCentreCode || '',
        ProfitCentreCode: obj.ProfitCentreCode || '',
        ManagerUserId: obj.ManagerUserId || 0,
        DefaultLocationId: obj.DefaultLocationId || 0,
        IsContractingUnit: obj.IsContractingUnit || false,
        IsBillingUnit: obj.IsBillingUnit || false,
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),
        Status: obj.Status || '',
        HierarchyPath: obj.HierarchyPath || '',
        Description: obj.Description || '',

      }
    );

    this.Caption = "OrganisationUnit Details #" + obj.Id;
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/organisations/units/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.organisationUnit = { ...this.objMaster };
    var obj = this.organisationUnit;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        ParentOrganisationUnitId: obj.ParentOrganisationUnitId || 0,
        UnitCode: obj.UnitCode || '',
        UnitName: obj.UnitName || '',
        UnitType: obj.UnitType || '',
        CostCentreCode: obj.CostCentreCode || '',
        ProfitCentreCode: obj.ProfitCentreCode || '',
        ManagerUserId: obj.ManagerUserId || 0,
        DefaultLocationId: obj.DefaultLocationId || 0,
        IsContractingUnit: obj.IsContractingUnit || false,
        IsBillingUnit: obj.IsBillingUnit || false,
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),
        Status: obj.Status || '',
        HierarchyPath: obj.HierarchyPath || '',
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
    var updatedObj = {
      Id: this.objMaster.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      ParentOrganisationUnitId: formValues.ParentOrganisationUnitId || null,
      UnitCode: formValues.UnitCode || null,
      UnitName: formValues.UnitName || null,
      UnitType: formValues.UnitType || null,
      CostCentreCode: formValues.CostCentreCode || null,
      ProfitCentreCode: formValues.ProfitCentreCode || null,
      ManagerUserId: formValues.ManagerUserId || null,
      DefaultLocationId: formValues.DefaultLocationId || null,
      IsContractingUnit: formValues.IsContractingUnit || null,
      IsBillingUnit: formValues.IsBillingUnit || null,
      EffectiveFrom: formValues.EffectiveFrom || null,
      EffectiveTo: formValues.EffectiveTo || null,
      Status: formValues.Status || null,
      HierarchyPath: formValues.HierarchyPath || null,
      Description: formValues.Description || null,

    } as IOrganisationUnit;

    this.spinner.show();
    this.organisationUnitService.update(this.organisationUnit.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(OrganisationUnit +  'Details Updated sucessfully.');
        //this.editForm.reset();
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
