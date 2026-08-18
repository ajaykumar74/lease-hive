import { Routes } from '@angular/router';
import { BusinessFeatureComponent } from './business-feature.component';
import { AssetDashboardComponent } from './asset-dashboard.component';

interface AssetPlaceholderPage {
    path: string;
    title: string;
    icon: string;
    description: string;
}

const placeholderPages: AssetPlaceholderPage[] = [
    { path: 'assets/assignments/transfer', title: 'Transfer Custody', icon: 'pi pi-arrow-right-arrow-left', description: 'Transfer asset custody between users and organisation units.' },
    { path: 'assets/locations', title: 'Current Asset Locations', icon: 'pi pi-map-marker', description: 'Review the current location of assets.' },
    { path: 'assets/movements/create', title: 'Move Asset', icon: 'pi pi-directions', description: 'Record an asset movement.' },
    { path: 'assets/movements/transfers', title: 'Branch Transfers', icon: 'pi pi-building', description: 'Manage asset transfers between branches.' },
    { path: 'assets/compliance', title: 'Compliance Dashboard', icon: 'pi pi-verified', description: 'Monitor asset compliance and upcoming expiries.' },
    { path: 'assets/compliance/types', title: 'Compliance Types', icon: 'pi pi-list', description: 'Configure asset compliance types.' },
    { path: 'assets/compliance/records', title: 'Certificates & Permits', icon: 'pi pi-id-card', description: 'Manage certificates and permits associated with assets.' },
    { path: 'assets/compliance/expiring', title: 'Expiry Worklist', icon: 'pi pi-clock', description: 'Review compliance records approaching expiry.' },
    { path: 'assets/documents', title: 'Asset Documents', icon: 'pi pi-folder', description: 'Manage documents associated with assets.' },
    { path: 'assets/valuations', title: 'Asset Valuations', icon: 'pi pi-chart-line', description: 'Review and maintain asset valuations.' },
    { path: 'assets/warranties', title: 'Asset Warranties', icon: 'pi pi-shield', description: 'Manage asset warranty coverage.' },
    { path: 'assets/insurance', title: 'Asset Insurance', icon: 'pi pi-shield', description: 'Manage asset insurance policies.' },
    { path: 'assets/lifecycle', title: 'Asset Lifecycle History', icon: 'pi pi-history', description: 'Review lifecycle events across assets.' }
];

export const ASSET_ROUTES: Routes = [
    {
        path: 'assets/dashboard',
        component: AssetDashboardComponent,
        data: { title: 'Asset Dashboard', breadcrumb: 'Asset Dashboard' }
    },
    ...placeholderPages.map(page => ({
        path: page.path,
        component: BusinessFeatureComponent,
        data: { title: page.title, area: 'Assets', icon: page.icon, description: page.description, breadcrumb: page.title }
    })),
    {
        path: 'assets/classification/categories',
        data: { title: 'Asset Categories', breadcrumb: 'Asset Categories' },
        loadChildren: () => import('@/views/assets/assetCategory/assetCategory.module').then(m => m.AssetCategoryModule)
    },
    {
        path: 'assets/classification/types',
        data: { title: 'Asset Types', breadcrumb: 'Asset Types' },
        loadChildren: () => import('@/views/assets/assetType/assetType.module').then(m => m.AssetTypeModule)
    },
    {
        path: 'assets/classification/makes',
        data: { title: 'Asset Makes', breadcrumb: 'Asset Makes' },
        loadChildren: () => import('@/views/assets/assetMake/assetMake.module').then(m => m.AssetMakeModule)
    },
    {
        path: 'assets/classification/models',
        data: { title: 'Asset Models', breadcrumb: 'Asset Models' },
        loadChildren: () => import('@/views/assets/assetModel/assetModel.module').then(m => m.AssetModelModule)
    },
    {
        path: 'assets/classification/identifiers',
        data: { title: 'Asset Identifiers', breadcrumb: 'Asset Identifiers' },
        loadChildren: () => import('@/views/assets/assetIdentifier/assetIdentifier.module').then(m => m.AssetIdentifierModule)
    },
    {
        path: 'assets/classification/attribute-definitions',
        data: { title: 'Asset Attribute Definitions', breadcrumb: 'Attribute Definitions' },
        loadChildren: () => import('@/views/assets/assetAttributeDefinition/assetAttributeDefinition.module').then(m => m.AssetAttributeDefinitionModule)
    },
    {
        path: 'assets/classification/attribute-options',
        data: { title: 'Asset Attribute Options', breadcrumb: 'Attribute Options' },
        loadChildren: () => import('@/views/assets/assetAttributeOption/assetAttributeOption.module').then(m => m.AssetAttributeOptionModule)
    },
    {
        path: 'assets/classification/attribute-values',
        data: { title: 'Asset Attribute Values', breadcrumb: 'Attribute Values' },
        loadChildren: () => import('@/views/assets/assetAttributeValue/assetAttributeValue.module').then(m => m.AssetAttributeValueModule)
    },
    {
        path: 'assets/classification/statuses',
        data: { title: 'Asset Statuses', breadcrumb: 'Asset Statuses' },
        loadChildren: () => import('@/views/assets/assetStatus/assetStatus.module').then(m => m.AssetStatusModule)
    },
    {
        path: 'assets/status-history',
        data: { title: 'Asset Status History', breadcrumb: 'Status History' },
        loadChildren: () => import('@/views/assets/assetStatusHistory/assetStatusHistory.module').then(m => m.AssetStatusHistoryModule)
    },
    {
        path: 'assets/condition-grades',
        data: { title: 'Asset Condition Grades', breadcrumb: 'Condition Grades' },
        loadChildren: () => import('@/views/assets/assetConditionGrade/assetConditionGrade.module').then(m => m.AssetConditionGradeModule)
    },
    {
        path: 'assets/ownership-history',
        data: { title: 'Asset Ownership History', breadcrumb: 'Ownership History' },
        loadChildren: () => import('@/views/assets/assetOwnershipHistory/assetOwnershipHistory.module').then(m => m.AssetOwnershipHistoryModule)
    },
    {
        path: 'assets/location-history',
        data: { title: 'Asset Location History', breadcrumb: 'Location History' },
        loadChildren: () => import('@/views/assets/assetLocationHistory/assetLocationHistory.module').then(m => m.AssetLocationHistoryModule)
    },
    {
        path: 'assets/assignments/history',
        data: { title: 'Asset Assignment History', breadcrumb: 'Assignment History' },
        loadChildren: () => import('@/views/assets/assetAssignmentHistory/assetAssignmentHistory.module').then(m => m.AssetAssignmentHistoryModule)
    },
    {
        path: 'assets/assignments',
        data: { title: 'Asset Assignments', breadcrumb: 'Assignments' },
        loadChildren: () => import('@/views/assets/assetAssignment/assetAssignment.module').then(m => m.AssetAssignmentModule)
    },
    {
        path: 'assets/measures/definitions',
        data: { title: 'Asset Measure Definitions', breadcrumb: 'Measure Definitions' },
        loadChildren: () => import('@/views/assets/assetMeasureDefinition/assetMeasureDefinition.module').then(m => m.AssetMeasureDefinitionModule)
    },
    {
        path: 'assets/measures/readings',
        data: { title: 'Asset Measure Readings', breadcrumb: 'Measure Readings' },
        loadChildren: () => import('@/views/assets/assetMeasureReading/assetMeasureReading.module').then(m => m.AssetMeasureReadingModule)
    },
    {
        path: 'assets/inspections',
        data: { title: 'Asset Inspections', breadcrumb: 'Inspections' },
        loadChildren: () => import('@/views/assets/assetInspection/assetInspection.module').then(m => m.AssetInspectionModule)
    },
    {
        path: 'assets/specialised/vehicles',
        data: { title: 'Vehicle Assets', breadcrumb: 'Vehicle Assets' },
        loadChildren: () => import('@/views/assets/vehicleAsset/vehicleAsset.module').then(m => m.VehicleAssetModule)
    },
    {
        path: 'assets/specialised/it',
        data: { title: 'IT Assets', breadcrumb: 'IT Assets' },
        loadChildren: () => import('@/views/assets/iTAsset/iTAsset.module').then(m => m.ITAssetModule)
    },
    {
        path: 'assets/specialised/equipment',
        data: { title: 'Equipment Assets', breadcrumb: 'Equipment Assets' },
        loadChildren: () => import('@/views/assets/equipmentAsset/equipmentAsset.module').then(m => m.EquipmentAssetModule)
    },
    {
        path: 'assets/specialised/property',
        data: { title: 'Property Assets', breadcrumb: 'Property Assets' },
        loadChildren: () => import('@/views/assets/propertyAsset/propertyAsset.module').then(m => m.PropertyAssetModule)
    },
    {
        path: 'assets',
        data: { title: 'Assets', breadcrumb: 'Assets' },
        loadChildren: () => import('@/views/assets/asset/asset.module').then(m => m.AssetModule)
    }
];
