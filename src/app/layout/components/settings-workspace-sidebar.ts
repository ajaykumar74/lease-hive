import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { MenuPermissionService } from '@/shared/security/menu-permission.service';
import { PermissionService } from '@/shared/security/permission.service';
import { SETTINGS_WORKSPACE_GROUPS, SettingsWorkspaceGroup, SettingsWorkspaceItem } from './settings-workspace.config';

@Component({
    selector: 'app-settings-workspace-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <aside class="layout-sidebar settings-workspace-sidebar">
            <div class="settings-workspace-sidebar__brand">
                <a routerLink="/dashboard/mydashboard" class="app-logo">
                    <img src="demo/images/fleetpro-icon.png" alt="LeaseHive" class="settings-workspace-sidebar__logo" />
                </a>
            </div>
            <div class="layout-menu-container settings-workspace-sidebar__menu">
                <a class="settings-workspace-sidebar__back" routerLink="/dashboard/mydashboard">
                    <i class="pi pi-arrow-left"></i><span>Back to Main Menu</span>
                </a>
                <header class="settings-workspace-sidebar__header">
                    <div class="settings-workspace-sidebar__eyebrow">Administration</div>
                    <h2>Settings</h2>
                    <p>Settings / {{ activeGroup?.label || 'Workspace' }}<span *ngIf="activeItem"> / {{ activeItem.label }}</span></p>
                </header>
                <nav aria-label="Settings navigation">
                    <section *ngFor="let group of visibleGroups" class="settings-workspace-sidebar__group">
                        <button type="button" class="settings-workspace-sidebar__group-button" (click)="toggle(group)">
                            <span><i [class]="group.icon"></i>{{ group.label }}</span>
                            <i class="pi" [ngClass]="isOpen(group) ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                        </button>
                        <div *ngIf="isOpen(group)">
                            <ng-container *ngFor="let menuItem of visibleItems(group)">
                                <a *ngIf="menuItem.route; else unavailable"
                                    [routerLink]="menuItem.route"
                                    routerLinkActive="active"
                                    class="settings-workspace-sidebar__item">
                                    <i [class]="menuItem.icon"></i><span>{{ menuItem.label }}</span>
                                </a>
                                <ng-template #unavailable>
                                    <span class="settings-workspace-sidebar__item settings-workspace-sidebar__item--unavailable" [title]="menuItem.label + ' is not available in this deployment'">
                                        <i [class]="menuItem.icon"></i><span>{{ menuItem.label }}</span><i class="pi pi-clock"></i>
                                    </span>
                                </ng-template>
                            </ng-container>
                        </div>
                    </section>
                </nav>
            </div>
        </aside>
    `,
    styles: [`
        .settings-workspace-sidebar { display:flex; flex-direction:column; }
        .settings-workspace-sidebar__brand { padding:.85rem 1rem .65rem; border-bottom:1px solid var(--surface-border); }
        .settings-workspace-sidebar__logo { width:7.25rem; height:2.25rem; object-fit:contain; }
        .settings-workspace-sidebar__menu { padding:.75rem; overflow-y:auto; }
        .settings-workspace-sidebar__back,.settings-workspace-sidebar__item,.settings-workspace-sidebar__group-button { width:100%; display:flex; align-items:center; gap:.7rem; border:0; border-radius:.5rem; color:var(--text-color); background:transparent; text-decoration:none; font:inherit; font-size:.86rem; text-align:left; cursor:pointer; }
        .settings-workspace-sidebar__back { padding:.72rem; margin-bottom:.9rem; background:var(--surface-100); font-weight:600; }
        .settings-workspace-sidebar__header { padding:0 .72rem .8rem; border-bottom:1px solid var(--surface-border); margin-bottom:.55rem; }
        .settings-workspace-sidebar__header h2 { margin:.12rem 0; font-size:1.05rem; }
        .settings-workspace-sidebar__header p,.settings-workspace-sidebar__eyebrow { margin:0; color:var(--text-color-secondary); font-size:.7rem; line-height:1.45; }
        .settings-workspace-sidebar__eyebrow { font-weight:700; letter-spacing:.08em; text-transform:uppercase; }
        .settings-workspace-sidebar__group { margin:.15rem 0 .45rem; }
        .settings-workspace-sidebar__group-button { justify-content:space-between; padding:.5rem .72rem; color:var(--text-color-secondary); font-size:.73rem; font-weight:700; letter-spacing:.05em; text-transform:uppercase; }
        .settings-workspace-sidebar__group-button span { display:flex; align-items:center; gap:.55rem; }.settings-workspace-sidebar__group-button > i { font-size:.7rem; }
        .settings-workspace-sidebar__item { padding:.6rem .72rem; margin:.1rem 0; }.settings-workspace-sidebar__item:hover,.settings-workspace-sidebar__item.active { background:color-mix(in srgb,var(--primary-color) 12%,transparent); color:var(--primary-color); }
        .settings-workspace-sidebar__item > i:first-child { width:1rem; text-align:center; }.settings-workspace-sidebar__item--unavailable { color:var(--text-color-secondary); cursor:not-allowed; opacity:.58; }.settings-workspace-sidebar__item--unavailable > i:last-child { margin-left:auto; font-size:.7rem; }
    `]
})
export class SettingsWorkspaceSidebar implements OnInit, OnDestroy {
    readonly groups = SETTINGS_WORKSPACE_GROUPS;
    private readonly openGroups = new Set<string>();
    private subscriptions = new Subscription();
    activeGroup?: SettingsWorkspaceGroup;
    activeItem?: SettingsWorkspaceItem;

    constructor(
        private readonly router: Router,
        private readonly permissions: PermissionService,
        private readonly menuPermissions: MenuPermissionService
    ) {}

    ngOnInit(): void {
        this.updateActiveMenu();
        this.subscriptions.add(this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.updateActiveMenu()));
        this.subscriptions.add(this.permissions.permissions$.subscribe(() => this.updateActiveMenu()));
    }

    ngOnDestroy(): void { this.subscriptions.unsubscribe(); }

    get visibleGroups(): SettingsWorkspaceGroup[] {
        return this.groups.filter(group => this.visibleItems(group).length > 0);
    }

    visibleItems(group: SettingsWorkspaceGroup): SettingsWorkspaceItem[] {
        const availableItems = group.items.filter(item => !!item.route && this.canAccess(item));
        if (!availableItems.length) {
            return [];
        }

        return group.items.filter(item => !item.route || this.canAccess(item));
    }

    isOpen(group: SettingsWorkspaceGroup): boolean { return this.openGroups.has(group.label); }

    toggle(group: SettingsWorkspaceGroup): void {
        if (this.isOpen(group)) this.openGroups.delete(group.label);
        else this.openGroups.add(group.label);
    }

    private canAccess(item: SettingsWorkspaceItem): boolean {
        const permission = this.menuPermissions.getRequiredPermission(item.route);
        return !permission || this.permissions.hasPermission(permission);
    }

    private updateActiveMenu(): void {
        const path = this.router.url.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
        this.activeGroup = undefined;
        this.activeItem = undefined;
        for (const group of this.groups) {
            const active = group.items.find(item => item.route && (path === item.route || path.startsWith(`${item.route}/`)));
            if (active) {
                this.activeGroup = group;
                this.activeItem = active;
                this.openGroups.add(group.label);
                break;
            }
        }
    }
}
