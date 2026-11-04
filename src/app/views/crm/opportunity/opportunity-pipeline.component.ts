import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { IPermission } from '@/shared/IPermission';
import { MessageComponent } from '@/shared/message.component';
import {
  IOpportunityPipeline,
  IOpportunityPipelineCard,
  IOpportunityPipelineFilter,
  IOpportunityPipelineOption,
  IOpportunityPipelineStage
} from './opportunity';
import { OpportunityService } from './opportunity.service';

@Component({
  selector: 'app-opportunity-pipeline',
  standalone: false,
  templateUrl: './opportunity-pipeline.component.html',
  styleUrl: './opportunity-pipeline.component.css',
  providers: [ConfirmationService]
})
export class OpportunityPipelineComponent {
  @ViewChild(MessageComponent) messageService?: MessageComponent;

  isLoading = false;
  isSavingStage = false;
  permission = {} as IPermission;
  pipeline?: IOpportunityPipeline;
  filters: IOpportunityPipelineFilter = {};
  showAdditionalFilters = false;
  draggedCard?: IOpportunityPipelineCard;
  dropStageId?: number;
  private suppressCardClick = false;

  constructor(
    private readonly opportunityService: OpportunityService,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadPipeline();
  }

  get stages(): IOpportunityPipelineStage[] {
    return this.pipeline?.Stages || [];
  }

  get options() {
    return this.pipeline?.FilterOptions || {
      Organisations: [], SalesExecutives: [], Customers: [], AssetCategories: []
    };
  }

  get canMoveCards(): boolean {
    return this.permission?.CanUpdate === true && !this.isSavingStage;
  }

  loadPipeline(): void {
    this.isLoading = true;
    this.opportunityService.getPipeline(this.filters).subscribe({
      next: response => {
        this.pipeline = response.data as IOpportunityPipeline;
        this.permission = response.permission || ({} as IPermission);
      },
      error: error => {
        this.pipeline = undefined;
        this.messageService?.showError(error);
      },
      complete: () => this.isLoading = false
    });
  }

  clearFilters(): void {
    this.filters = {};
    this.loadPipeline();
  }

  toggleAdditionalFilters(): void {
    this.showAdditionalFilters = !this.showAdditionalFilters;
  }

  onOptionItemClicked(action: string): void {
    if (action === 'Refresh') this.loadPipeline();
  }

  onCardClick(card: IOpportunityPipelineCard): void {
    if (this.suppressCardClick) return;
    const route = this.permission?.CanUpdate
      ? ['/business/crm/opportunities/edit', card.Id]
      : ['/business/crm/opportunities/view', card.Id];
    this.router.navigate(route);
  }

  onDragStart(event: DragEvent, card: IOpportunityPipelineCard): void {
    if (!this.canMoveCards) {
      event.preventDefault();
      return;
    }

    this.draggedCard = card;
    event.dataTransfer?.setData('text/plain', String(card.Id));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  onDragEnd(): void {
    this.draggedCard = undefined;
    this.dropStageId = undefined;
    this.suppressCardClick = true;
    setTimeout(() => this.suppressCardClick = false, 120);
  }

  allowDrop(event: DragEvent, stage: IOpportunityPipelineStage): void {
    if (!this.draggedCard || !this.canMoveCards || this.draggedCard.OpportunityStageId === stage.Id) return;
    event.preventDefault();
    this.dropStageId = stage.Id;
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  onDrop(event: DragEvent, stage: IOpportunityPipelineStage): void {
    event.preventDefault();
    this.dropStageId = undefined;
    const card = this.draggedCard;
    this.draggedCard = undefined;

    if (!card || !this.canMoveCards || card.OpportunityStageId === stage.Id) return;

    this.confirmationService.confirm({
      key: 'pipeline-stage-change',
      header: 'Move opportunity',
      message: `Move ${card.OpportunityId || card.OpportunityName} to ${stage.StageName}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Move',
      rejectLabel: 'Cancel',
      accept: () => this.saveStageChange(card, stage)
    });
  }

  private saveStageChange(card: IOpportunityPipelineCard, stage: IOpportunityPipelineStage): void {
    this.isSavingStage = true;
    this.opportunityService.changeStage(card.Id, stage.Id, card.RowVersionStr).subscribe({
      next: () => {
        this.messageService?.showSuccess(`Opportunity moved to ${stage.StageName}.`);
        this.loadPipeline();
      },
      error: error => this.messageService?.showError(error),
      complete: () => this.isSavingStage = false
    });
  }

  trackStage(_: number, stage: IOpportunityPipelineStage): number {
    return stage.Id;
  }

  trackCard(_: number, card: IOpportunityPipelineCard): number {
    return card.Id;
  }

  stageTone(stage: IOpportunityPipelineStage): string {
    if (stage.IsWon) return 'stage-won';
    if (stage.IsLost) return 'stage-lost';
    return 'stage-open';
  }

  initials(card: IOpportunityPipelineCard): string {
    const source = card.CustomerName || card.OpportunityName || 'Opportunity';
    return source.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }

  formatCurrencyValues(values?: Array<{ CurrencyCode: string; Amount: number }>): string {
    if (!values?.length) return '—';
    return values.map(value => `${value.CurrencyCode || 'USD'} ${Number(value.Amount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`).join(' · ');
  }

  asOptions(options: IOpportunityPipelineOption[]): IOpportunityPipelineOption[] {
    return options || [];
  }
}
