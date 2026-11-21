import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AssetProfileContext, AssetProfileContextService } from './asset-profile-context.service';
import { AssetService } from './asset.service';
import { IAssetProfileDocument } from './asset';
import { DocumentAttachmentService } from '@/shared/document-attachments/document-attachment.service';

@Component({
    templateUrl: './asset-profile-documents.component.html',
    styleUrls: ['./asset-profile-documents.component.scss'],
    standalone: false
})
export class AssetProfileDocumentsComponent implements OnInit, OnDestroy {
    context?: AssetProfileContext;
    documents: IAssetProfileDocument[] = [];
    loading = true;
    downloadingId?: number;
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly profile: AssetProfileContextService,
        private readonly assets: AssetService,
        private readonly attachments: DocumentAttachmentService
    ) {}

    ngOnInit(): void {
        this.profile.context$.pipe(takeUntil(this.destroy$)).subscribe(context => {
            if (!context || context.assetId === this.context?.assetId) return;
            this.context = context;
            this.load(context.assetId);
        });
    }

    ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

    download(document: IAssetProfileDocument): void {
        this.downloadingId = document.DocumentId;
        this.attachments.download(document.OwnerType, document.OwnerId, document.DocumentId).subscribe({
            next: file => {
                const url = URL.createObjectURL(file);
                const link = window.document.createElement('a');
                link.href = url;
                link.download = document.OriginalFileName || document.Title || `document-${document.DocumentId}`;
                link.click();
                URL.revokeObjectURL(url);
            },
            complete: () => this.downloadingId = undefined,
            error: () => this.downloadingId = undefined
        });
    }

    icon(document: IAssetProfileDocument): string {
        const value = `${document.ContentType || ''} ${document.OriginalFileName || ''}`.toLowerCase();
        if (value.includes('pdf')) return 'pi pi-file-pdf';
        if (value.includes('image')) return 'pi pi-image';
        if (value.includes('sheet') || value.includes('excel') || /\.(xlsx|xls|csv)$/.test(value)) return 'pi pi-file-excel';
        if (value.includes('word') || /\.(docx|doc)$/.test(value)) return 'pi pi-file-word';
        return 'pi pi-file';
    }

    private load(assetId: number): void {
        this.loading = true;
        this.assets.profileDocuments(assetId).subscribe({
            next: response => this.documents = response.data || [],
            error: () => this.documents = [],
            complete: () => this.loading = false
        });
    }
}
