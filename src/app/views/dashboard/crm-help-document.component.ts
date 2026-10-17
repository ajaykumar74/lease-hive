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
