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
import { PartyService } from '@/views/party/party.service';
import { PartyContactService } from '@/views/partyContact/partyContact.service';
import { PartyLocationService } from '@/views/partyLocation/partyLocation.service';
import { PartyDocumentService } from '@/views/partyDocument/partyDocument.service';
import { CustomerProfileService } from '@/views/customerProfile/customerProfile.service';
import { SupplierProfileService } from '@/views/supplierProfile/supplierProfile.service';

@Component({ selector: 'app-party-dashboard', standalone: true, imports: [CommonModule, RouterLink, ButtonModule, ChartModule, ProgressBarModule, TableModule, TagModule], templateUrl: './party-dashboard.component.html', styleUrl: './party-dashboard.component.css' })
export class PartyDashboardComponent implements OnInit {
    isLoading = true; hasLoadError = false;
    parties:any[]=[]; contacts:any[]=[]; locations:any[]=[]; documents:any[]=[]; customerProfiles:any[]=[]; supplierProfiles:any[]=[];
    mixData:any; mixOptions:any;
    constructor(private partyService:PartyService, private contactService:PartyContactService, private locationService:PartyLocationService, private documentService:PartyDocumentService, private customerService:CustomerProfileService, private supplierService:SupplierProfileService, private router:Router) {}
    ngOnInit():void { this.loadDashboard(); }
    get activeParties():any[]{return this.parties.filter(x=>this.isActive(x));}
    get partyIdsWithContact():Set<number>{return new Set(this.contacts.filter(x=>this.isActive(x)&&(x.Email||x.MobileNumber||x.PhoneNumber)).map(x=>Number(x.PartyId)));}
    get partyIdsWithLocation():Set<number>{return new Set(this.locations.filter(x=>this.isActive(x)&&x.AddressLine1).map(x=>Number(x.PartyId)));}
    get incompleteParties():any[]{return this.activeParties.filter(x=>!this.partyIdsWithContact.has(Number(x.Id))||!this.partyIdsWithLocation.has(Number(x.Id)));}
    get onboardingAttention():any[]{return this.activeParties.filter(x=>this.text(x.OnboardingStatus).match(/pending|incomplete|review|rejected/)||!x.OnboardingStatus);}
    get documentAttention():any[]{const limit=new Date();limit.setDate(limit.getDate()+60);return this.documents.filter(x=>{const expiry=this.asDate(x.ExpiryDate);return this.text(x.VerificationStatus)!=='verified'||(expiry&&expiry<=limit);});}
    get relatedPartyCount():number{return this.activeParties.filter(x=>x.IsRelatedParty===true||String(x.IsRelatedParty).toLowerCase()==='true').length;}
    get recentParties():any[]{return [...this.activeParties].sort((a,b)=>this.timeOf(b.CreatedDateTime||b.EffectiveFrom)-this.timeOf(a.CreatedDateTime||a.EffectiveFrom)).slice(0,6);}
    get completenessPct():number{return this.activeParties.length?(this.activeParties.length-this.incompleteParties.length)/this.activeParties.length*100:0;}
    loadDashboard():void{this.isLoading=true;this.hasLoadError=false;forkJoin({parties:this.partyService.GetAll(false).pipe(catchError(()=>this.failed())),contacts:this.contactService.GetAll(false).pipe(catchError(()=>this.failed())),locations:this.locationService.GetAll(false).pipe(catchError(()=>this.failed())),documents:this.documentService.GetAll(false).pipe(catchError(()=>this.failed())),customers:this.customerService.GetAll(false).pipe(catchError(()=>this.failed())),suppliers:this.supplierService.GetAll(false).pipe(catchError(()=>this.failed()))}).pipe(finalize(()=>this.isLoading=false)).subscribe(r=>{this.parties=this.records(r.parties);this.contacts=this.records(r.contacts);this.locations=this.records(r.locations);this.documents=this.records(r.documents);this.customerProfiles=this.records(r.customers);this.supplierProfiles=this.records(r.suppliers);this.buildChart();});}
    openParty(x:any):void{this.router.navigate(['/business/parties/view',x.Id]);}
    severity(value:any):'success'|'info'|'warn'|'danger'|'secondary'{const t=this.text(value);if(t.match(/active|complete|approved|verified/))return 'success';if(t.match(/pending|review|progress/))return 'warn';if(t.match(/reject|blocked|high/))return 'danger';return 'secondary';}
    private buildChart():void{const groups=new Map<string,number>();this.activeParties.forEach(x=>{const k=x.PartyKind||'Other';groups.set(k,(groups.get(k)||0)+1);});const values=[...groups.entries()];const s=getComputedStyle(document.documentElement);this.mixData={labels:values.map(x=>x[0]),datasets:[{data:values.map(x=>x[1]),backgroundColor:['--p-primary-color','--p-blue-500','--p-orange-500','--p-purple-500','--p-cyan-500'].map(v=>s.getPropertyValue(v).trim()),borderWidth:0}]};this.mixOptions={responsive:true,maintainAspectRatio:false,cutout:'66%',plugins:{legend:{position:'bottom',labels:{usePointStyle:true,boxWidth:8,color:s.getPropertyValue('--p-text-color').trim()}}}};}
    private failed(){this.hasLoadError=true;return of([]);} private records(r:any):any[]{const x=r?.data?.Records??r?.Data?.Records??r?.Records??r?.data??r;return Array.isArray(x)?x:[];} private isActive(x:any):boolean{return !x.RecordStatus||this.text(x.RecordStatus)==='active';} private text(v:any):string{return String(v||'').toLowerCase();} private asDate(v:any):Date|null{if(!v)return null;const d=new Date(v);return Number.isNaN(d.getTime())?null:d;} private timeOf(v:any):number{return this.asDate(v)?.getTime()||0;}
}
