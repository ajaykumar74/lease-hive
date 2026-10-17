import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface HelpDocument {
  id: string;
  title: string;
  description: string;
  assetUrl: string;
}

@Component({
  selector: 'app-crm-help-document',
  standalone: false,
  templateUrl: 'crm-help-document.component.html',
  styleUrl: 'crm-help-document.component.css'
})
export class CrmHelpDocumentComponent {
  // Add future help PDFs to public/documentation and register them here.
  readonly documents: HelpDocument[] = [
    {
      id: 'crm-module-help',
      title: 'CRM Module Help',
      description: 'Lead-to-lease data flow and the main CRM entities.',
      assetUrl: '/documentation/CRM_Module_Help_Data_Flow.pdf'
    },
    {
      id: 'asset-module-help',
      title: 'Asset Module Help',
      description: 'Asset setup, classification, lifecycle and operational handoffs.',
      assetUrl: '/documentation/Asset_Module_Help_Data_Flow.pdf'
    },
    {
      id: 'procurement-module-help',
      title: 'Procurement Module Help',
      description: 'Supplier, sourcing, purchase, receipt and acquisition handoffs.',
      assetUrl: '/documentation/Procurement_Module_Help_Data_Flow.pdf'
    },
    {
      id: 'lease-contracts-module-help',
      title: 'Lease Contracts Module Help',
      description: 'Contract definition, approval, execution, activation and servicing.',
      assetUrl: '/documentation/Lease_Contracts_Module_Help_Data_Flow.pdf'
    },
    {
      id: 'billing-finance-module-help',
      title: 'Billing & Finance Module Help',
      description: 'Billing generation, receivables, collections, accounting and reconciliation.',
      assetUrl: '/documentation/Billing_and_Finance_Module_Help_Data_Flow.pdf'
    },
    {
      id: 'maintenance-insurance-module-help',
      title: 'Maintenance & Insurance Module Help',
      description: 'Service planning, work execution, insurance, claims and recovery.',
      assetUrl: '/documentation/Maintenance_and_Insurance_Module_Help_Data_Flow.pdf'
    },
    {
      id: 'end-of-lease-disposal-module-help',
      title: 'End-of-Lease & Disposal Module Help',
      description: 'Lease exit, return, assessment, disposition, settlement and closure.',
      assetUrl: '/documentation/End_of_Lease_and_Disposal_Module_Help_Data_Flow.pdf'
    }
  ];

  selectedDocument = this.documents[0];
  selectedDocumentUrl: SafeResourceUrl;

  constructor(private readonly sanitizer: DomSanitizer) {
    this.selectedDocumentUrl = this.toTrustedResourceUrl(this.selectedDocument.assetUrl);
  }

  selectDocument(document: HelpDocument): void {
    this.selectedDocument = document;
    this.selectedDocumentUrl = this.toTrustedResourceUrl(document.assetUrl);
  }

  trackByDocumentId(_: number, document: HelpDocument): string {
    return document.id;
  }

  private toTrustedResourceUrl(assetUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(assetUrl);
  }
}
