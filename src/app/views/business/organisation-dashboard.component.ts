import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { OrganisationService } from '@/views/organisation/organisation.service';
import { OrganisationUnitService } from '@/views/organisationUnit/organisationUnit.service';
import { LocationService } from '@/views/location/location.service';
import { DepartmentService } from '@/views/department/department.service';
import { CostCentreService } from '@/views/costCentre/costCentre.service';
import { ProfitCentreService } from '@/views/profitCentre/profitCentre.service';
import { ApplicationUserService } from '@/views/applicationUser/applicationUser.service';
import { AssetService } from '@/views/assets/asset/asset.service';

@Component({ selector:'app-organisation-dashboard', standalone:true, imports:[CommonModule,RouterLink,ButtonModule,ChartModule,ProgressBarModule,TableModule,TagModule], templateUrl:'./organisation-dashboard.component.html', styleUrl:'./organisation-dashboard.component.css' })
export class OrganisationDashboardComponent implements OnInit {
    isLoading=true;hasLoadError=false;organisations:any[]=[];units:any[]=[];locations:any[]=[];departments:any[]=[];costCentres:any[]=[];profitCentres:any[]=[];users:any[]=[];assets:any[]=[];unitData:any;unitOptions:any;
    constructor(private organisationService:OrganisationService,private unitService:OrganisationUnitService,private locationService:LocationService,private departmentService:DepartmentService,private costCentreService:CostCentreService,private profitCentreService:ProfitCentreService,private userService:ApplicationUserService,private assetService:AssetService,private router:Router){}
    ngOnInit():void{this.loadDashboard();}
    get activeOrganisations():any[]{return this.organisations.filter(x=>this.active(x,x.Status));}get activeUnits():any[]{return this.units.filter(x=>this.active(x,x.Status));}get activeLocations():any[]{return this.locations.filter(x=>this.active(x));}get activeDepartments():any[]{return this.departments.filter(x=>this.active(x));}
    get contractingUnits():number{return this.activeUnits.filter(x=>this.bool(x.IsContractingUnit)).length;}get billingUnits():number{return this.activeUnits.filter(x=>this.bool(x.IsBillingUnit)).length;}get unitsMissingManager():any[]{return this.activeUnits.filter(x=>!Number(x.ManagerUserId));}get unitsMissingLocation():any[]{return this.activeUnits.filter(x=>!Number(x.DefaultLocationId));}
    get usersWithoutUnit():number{return this.users.filter(x=>this.active(x)&&!Number(x.DefaultOrganisationUnitId)).length;}get managedAssets():any[]{return this.assets.filter(x=>this.active(x)&&Number(x.ResponsibleOrganisationUnitId)>0);}get assetsWithoutUnit():number{return this.assets.filter(x=>this.active(x)&&!Number(x.ResponsibleOrganisationUnitId)).length;}
    get structureReadiness():number{if(!this.activeUnits.length)return 0;return this.activeUnits.filter(x=>Number(x.ManagerUserId)&&Number(x.DefaultLocationId)).length/this.activeUnits.length*100;}get recentUnits():any[]{return [...this.activeUnits].sort((a,b)=>this.time(b.CreatedDateTime||b.EffectiveFrom)-this.time(a.CreatedDateTime||a.EffectiveFrom)).slice(0,6);}
    loadDashboard():void{this.isLoading=true;this.hasLoadError=false;forkJoin({orgs:this.organisationService.GetAll(false).pipe(catchError(()=>this.failed())),units:this.unitService.GetAll(false).pipe(catchError(()=>this.failed())),locations:this.locationService.GetAll(false).pipe(catchError(()=>this.failed())),departments:this.departmentService.GetAll(false).pipe(catchError(()=>this.failed())),costs:this.costCentreService.GetAll(false).pipe(catchError(()=>this.failed())),profits:this.profitCentreService.GetAll(false).pipe(catchError(()=>this.failed())),users:this.userService.GetAll(false).pipe(catchError(()=>this.failed())),assets:this.assetService.GetAll(false).pipe(catchError(()=>this.failed()))}).pipe(finalize(()=>this.isLoading=false)).subscribe(r=>{this.organisations=this.records(r.orgs);this.units=this.records(r.units);this.locations=this.records(r.locations);this.departments=this.records(r.departments);this.costCentres=this.records(r.costs);this.profitCentres=this.records(r.profits);this.users=this.records(r.users);this.assets=this.records(r.assets);this.buildChart();});}
    organisationName(id:any):string{return this.organisations.find(x=>Number(x.Id)===Number(id))?.LegalName||'Not assigned';}openUnit(x:any):void{this.router.navigate(['/business/organisations/units/view',x.Id]);}severity(value:any):'success'|'info'|'warn'|'danger'|'secondary'{const t=this.text(value);if(t.match(/active|operating|enabled/))return'success';if(t.match(/pending|setup/))return'warn';if(t.match(/inactive|closed|suspended/))return'danger';return'info';}
    private buildChart():void{const g=new Map<string,number>();this.activeUnits.forEach(x=>{const k=x.UnitType||'Other';g.set(k,(g.get(k)||0)+1);});const v=[...g.entries()];const s=getComputedStyle(document.documentElement);this.unitData={labels:v.map(x=>x[0]),datasets:[{data:v.map(x=>x[1]),backgroundColor:['--p-primary-color','--p-blue-500','--p-orange-500','--p-purple-500','--p-cyan-500'].map(x=>s.getPropertyValue(x).trim()),borderWidth:0}]};this.unitOptions={responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{position:'bottom',labels:{usePointStyle:true,boxWidth:8,color:s.getPropertyValue('--p-text-color').trim()}}}};}
    private failed(){this.hasLoadError=true;return of([]);}private records(r:any):any[]{const x=r?.data?.Records??r?.Data?.Records??r?.Records??r?.data??r;return Array.isArray(x)?x:[];}private active(x:any,status?:any):boolean{const s=this.text(status||x.RecordStatus);return !s||s==='active'||s==='enabled'||s==='operating';}private bool(v:any):boolean{return v===true||v===1||this.text(v)==='true';}private text(v:any):string{return String(v||'').toLowerCase();}private time(v:any):number{const d=new Date(v);return Number.isNaN(d.getTime())?0:d.getTime();}
}
