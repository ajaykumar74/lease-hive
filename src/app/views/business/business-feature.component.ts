import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-business-feature',
    standalone: true,
    template: `
        <div class="card">
            <div class="flex align-items-center gap-3 mb-3">
                <i [class]="icon" class="text-3xl text-primary"></i>
                <div>
                    <h1 class="text-2xl font-semibold m-0">{{ title }}</h1>
                    <span class="text-color-secondary">Business / {{ area }}</span>
                </div>
            </div>
            <p class="text-color-secondary m-0">{{ description }}</p>
        </div>
    `
})
export class BusinessFeatureComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly routeData = this.route.snapshot.data;

    readonly title = this.routeData['title'];
    readonly area = this.routeData['area'];
    readonly icon = this.routeData['icon'] ?? 'pi pi-th-large';
    readonly description = this.routeData['description'] ?? `${this.title} is ready for feature implementation.`;
}
