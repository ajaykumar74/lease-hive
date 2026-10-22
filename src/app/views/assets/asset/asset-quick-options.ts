import { MenuItem } from 'primeng/api';

type Navigate = (commands: any[]) => unknown;

/**
 * Common asset-related navigation for base and specialised asset detail screens.
 * The asset ID is read when an option is clicked so the menu remains valid while
 * an edit page is still loading its specialised record.
 */
export function createAssetQuickOptions(
  getAssetId: () => number | null | undefined,
  navigate: Navigate,
  includeAssetDetails = false
): MenuItem[] {
  const openForAsset = (route: string[]) => {
    const assetId = Number(getAssetId());
    if (assetId > 0) {
      navigate([...route, 'asset', assetId]);
    }
  };

  const options: MenuItem[] = [
    { label: 'Identifiers', icon: 'pi pi-id-card', command: () => openForAsset(['/business/assets/classification/identifiers']) },
    { label: 'Attributes', icon: 'pi pi-list', command: () => openForAsset(['/business/assets/classification/attribute-values']) },
    { label: 'Documents', icon: 'pi pi-file', command: () => openForAsset(['/business/assets/documents']) },
    { label: 'Warranty & Support', icon: 'pi pi-shield', command: () => openForAsset(['/business/assets/warranties']) },
    { label: 'Assignments', icon: 'pi pi-users', command: () => openForAsset(['/business/assets/assignments']) },
    { label: 'Inspections', icon: 'pi pi-search', command: () => openForAsset(['/business/assets/inspections']) },
    { label: 'Compliance', icon: 'pi pi-verified', command: () => openForAsset(['/business/assets/compliance/records']) },
    { label: 'Usage Readings', icon: 'pi pi-chart-line', command: () => openForAsset(['/business/assets/measures/readings']) },
    { label: 'Location History', icon: 'pi pi-map-marker', command: () => openForAsset(['/business/assets/location-history']) },
    { label: 'Status History', icon: 'pi pi-history', command: () => openForAsset(['/business/assets/status-history']) }
  ];

  if (includeAssetDetails) {
    options.unshift({
      label: 'Asset',
      icon: 'pi pi-box',
      command: () => {
        const assetId = Number(getAssetId());
        if (assetId > 0) navigate(['/business/assets/edit', assetId]);
      }
    });
  }

  return options;
}
