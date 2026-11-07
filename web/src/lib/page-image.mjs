// Only select an image already assigned to, and displayed on, this page.
export function pageImage(page, { assets, visuals, physicians }) {
  const visual =
    visuals.banners.find((item) => item.pageId === page.id) ??
    visuals.diagrams.find((item) => item.pageId === page.id);
  if (visual) {
    const asset = assets.find((item) => item.id === visual.assetId);
    if (asset) return { ...asset, caption: visual.alt ?? visual.title };
  }
  if (['home', 'about'].includes(page.id)) {
    const asset = assets.find((item) => item.file === '/assets/clinic-1600.webp');
    if (asset) return { ...asset, caption: '영통탑내과 접수대와 대기 공간' };
  }
  const doctor = physicians.find((item) => page.id === `doctor-${item.id}`);
  if (doctor?.imageKind === 'portrait') {
    const asset = assets.find((item) => item.id === page.image);
    if (asset) return { ...asset, caption: `${doctor.name} ${doctor.role}` };
  }
  return null;
}
