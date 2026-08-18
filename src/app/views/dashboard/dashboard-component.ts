import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LeadService } from '@/views/crm/lead/lead.service';
import { OpportunityService } from '@/views/crm/opportunity/opportunity.service';
import { QuoteService } from '@/views/crm/quote/quote.service';
import { CreditApplicationService } from '@/views/crm/creditApplication/creditApplication.service';
import { AssetService } from '@/views/assets/asset/asset.service';
import { AssetAssignmentService } from '@/views/assets/assetAssignment/assetAssignment.service';
import { AssetInspectionService } from '@/views/assets/assetInspection/assetInspection.service';
import { LoggedInUserService } from '@/shared/LoggedInUserService';

interface QuickAction { label: string; description: string; icon: string; route: string; }

@Component({ selector: 'app-dashboard', standalone: false, templateUrl: 'dashboard-component.html', styleUrl: 'dashboard-component.css' })
export class DashboardComponent implements OnInit {
  isLoading = true; hasLoadError = false;
  leads: any[] = []; opportunities: any[] = []; quotes: any[] = []; creditApplications: any[] = [];
  assets: any[] = []; assignments: any[] = []; inspections: any[] = [];
  portfolioData: any; portfolioOptions: any;
  readonly quickActions: QuickAction[] = [
    { label: 'New lead', description: 'Capture a leasing enquiry', icon: 'pi pi-user-plus', route: '/business/crm/leads/create' },
    { label: 'New opportunity', description: 'Start a qualified deal', icon: 'pi pi-chart-line', route: '/business/crm/opportunities/create' },
    { label: 'Create quote', description: 'Build lease pricing', icon: 'pi pi-file-edit', route: '/business/origination/quotes/create' },
    { label: 'Credit application', description: 'Begin credit assessment', icon: 'pi pi-verified', route: '/business/origination/credit/applications/create' },
    { label: 'Create asset', description: 'Add leaseable inventory', icon: 'pi pi-box', route: '/business/assets/create' },
    { label: 'Assign asset', description: 'Deploy an asset', icon: 'pi pi-users', route: '/business/assets/assignments/create' }
  ];

  constructor(private leadService: LeadService, private opportunityService: OpportunityService, private quoteService: QuoteService,
    private creditService: CreditApplicationService, private assetService: AssetService, private assignmentService: AssetAssignmentService,
    private inspectionService: AssetInspectionService, private loggedInUserService: LoggedInUserService, private router: Router) {}

  ngOnInit(): void { this.loadDashboard(); }
  get displayName(): string { const u = this.loggedInUserService.loggedInUser; return u?.Name || u?.Username?.split('@')[0] || 'there'; }
  get organisationName(): string { const u = this.loggedInUserService.loggedInUser; return u?.Customer?.CompanyName || u?.Customer?.Name || u?.BrandPartner?.Name || u?.Tenant?.Name || ''; }
  get activeLeads(): any[] { return this.leads.filter(x => this.isActive(x)); }
  get openOpportunities(): any[] { return this.opportunities.filter(x => this.isActive(x) && !this.text(x.OpportunityStatusName || x.StageName).match(/won|lost|closed/)); }
  get pipelineValue(): number { return this.openOpportunities.reduce((s,x) => s + Number(x.EstimatedAmount || x.EstimatedValue || 0), 0); }
  get activeAssets(): any[] { return this.assets.filter(x => this.isActive(x)); }
  get leaseableAssets(): any[] { return this.activeAssets.filter(x => this.asBoolean(x.IsLeaseable)); }
  get currentAssignments(): any[] { const now = new Date(); return this.assignments.filter(x => { const end=this.asDate(x.AssignedTo || x.EffectiveTo); return this.isActive(x) && (!end || end >= now); }); }
  get assignedAssetCount(): number { return new Set(this.currentAssignments.map(x => Number(x.AssetId))).size; }
  get availableAssets(): number { return Math.max(0, this.leaseableAssets.length - this.assignedAssetCount); }
  get utilizationRate(): number { return this.leaseableAssets.length ? this.assignedAssetCount / this.leaseableAssets.length * 100 : 0; }
  get portfolioValue(): number { return this.activeAssets.reduce((s,x) => s + Number(x.AcquisitionCost || 0), 0); }
  get currencyCode(): string { return this.activeAssets.find(x => x.AcquisitionCurrencyCode)?.AcquisitionCurrencyCode || 'GBP'; }
  get pendingQuotes(): any[] { return this.quotes.filter(x => this.isActive(x) && !this.text(x.QuoteStatusName || x.StatusName).match(/accept|reject|expired|closed/)); }
  get pendingCredit(): any[] { return this.creditApplications.filter(x => this.isActive(x) && !this.text(x.CreditApplicationStatusName || x.StatusName || x.Decision).match(/approved|declined|closed/)); }
  get inspectionAttention(): any[] { return this.inspections.filter(x => !x.CompletedOn || (Number(x.OverallScore) > 0 && Number(x.OverallScore) < 60)); }
  get expiringAssignments(): any[] { const limit=new Date(); limit.setDate(limit.getDate()+30); return this.currentAssignments.filter(x => { const end=this.asDate(x.AssignedTo || x.EffectiveTo); return end && end<=limit; }); }
  get attentionCount(): number { return this.pendingCredit.length + this.inspectionAttention.length + this.expiringAssignments.length; }
  get recentLeads(): any[] { return [...this.activeLeads].sort((a,b)=>this.timeOf(b.CreatedDateTime)-this.timeOf(a.CreatedDateTime)).slice(0,5); }
  get recentAssets(): any[] { return [...this.activeAssets].sort((a,b)=>this.timeOf(b.CreatedDateTime || b.AcquisitionDate)-this.timeOf(a.CreatedDateTime || a.AcquisitionDate)).slice(0,5); }

  loadDashboard(): void {
    this.isLoading=true; this.hasLoadError=false;
    forkJoin({ leads:this.leadService.GetAll(false).pipe(catchError(()=>this.failedFeed())), opportunities:this.opportunityService.GetAll(false).pipe(catchError(()=>this.failedFeed())),
      quotes:this.quoteService.GetAll(false).pipe(catchError(()=>this.failedFeed())), credit:this.creditService.GetAll(false).pipe(catchError(()=>this.failedFeed())),
      assets:this.assetService.GetAll(false).pipe(catchError(()=>this.failedFeed())), assignments:this.assignmentService.GetAll(false).pipe(catchError(()=>this.failedFeed())),
      inspections:this.inspectionService.GetAll(false).pipe(catchError(()=>this.failedFeed()))
    }).pipe(finalize(()=>this.isLoading=false)).subscribe(r => { this.leads=this.recordsOf(r.leads); this.opportunities=this.recordsOf(r.opportunities); this.quotes=this.recordsOf(r.quotes);
      this.creditApplications=this.recordsOf(r.credit); this.assets=this.recordsOf(r.assets); this.assignments=this.recordsOf(r.assignments); this.inspections=this.recordsOf(r.inspections); this.buildPortfolioChart(); });
  }
  open(route:string):void { this.router.navigateByUrl(route); }
  openLead(x:any):void { this.router.navigate(['/business/crm/leads/view',x.Id]); }
  openAsset(x:any):void { this.router.navigate(['/business/assets/view',x.Id]); }
  statusSeverity(v:any):'success'|'info'|'warn'|'danger'|'secondary' { const t=this.text(v); if(t.match(/active|available|approved|accepted/))return 'success'; if(t.match(/pending|review|maintenance/))return 'warn'; if(t.match(/declined|lost|expired/))return 'danger'; return 'info'; }
  private buildPortfolioChart():void { const assigned=Math.min(this.assignedAssetCount,this.leaseableAssets.length), other=Math.max(0,this.activeAssets.length-this.leaseableAssets.length), s=getComputedStyle(document.documentElement);
    this.portfolioData={labels:['Assigned','Available to lease','Other assets'],datasets:[{data:[assigned,this.availableAssets,other],backgroundColor:[s.getPropertyValue('--p-primary-color').trim(),s.getPropertyValue('--p-blue-500').trim(),s.getPropertyValue('--p-orange-400').trim()],borderWidth:0}]};
    this.portfolioOptions={responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{position:'bottom',labels:{usePointStyle:true,boxWidth:8,color:s.getPropertyValue('--p-text-color').trim()}}}}; }
  private failedFeed(){this.hasLoadError=true;return of([]);} private recordsOf(r:any):any[]{const x=r?.data?.Records??r?.Data?.Records??r?.Records??r?.data??r;return Array.isArray(x)?x:[];}
  private isActive(x:any):boolean{return !x?.RecordStatus||this.text(x.RecordStatus)==='active';} private asBoolean(v:any):boolean{return v===true||v===1||this.text(v)==='true';}
  private asDate(v:any):Date|null{if(!v)return null;const d=new Date(v);return Number.isNaN(d.getTime())?null:d;} private timeOf(v:any):number{return this.asDate(v)?.getTime()||0;} private text(v:any):string{return String(v||'').toLowerCase();}
}
