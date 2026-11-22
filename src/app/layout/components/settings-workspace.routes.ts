import { Routes } from '@angular/router';
import { SETTINGS_WORKSPACE_GROUPS } from './settings-workspace.config';

const slug = (value: string) => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * URL aliases for the settings shell. They intentionally redirect to the
 * established feature URLs; the AppLayout recognises those URLs as settings
 * workspace pages and keeps the contextual sidebar mounted for list and CRUD
 * child routes alike.
 */
export const SETTINGS_WORKSPACE_CHILD_ROUTES: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/dashboard/tenant-settings' },
    ...SETTINGS_WORKSPACE_GROUPS.flatMap(group => group.items
        .filter(item => !!item.route)
        .map(item => ({
            path: `${slug(group.label)}/${slug(item.label)}`,
            pathMatch: 'full' as const,
            redirectTo: item.route!
        })))
];
