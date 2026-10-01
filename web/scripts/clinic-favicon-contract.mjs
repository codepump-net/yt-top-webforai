import sharp from 'sharp';

export async function validateClinicFavicon(svg, referenceLogo) {
  const text = svg.toString();
  const image = text.match(/href="data:image\/png;base64,([A-Za-z0-9+/=]+)"/);
  if (
    !image ||
    (text.match(/<image\b/g) ?? []).length !== 1 ||
    /<(?:path|rect|text|circle|filter)\b/.test(text)
  )
    return ['Clinic favicon must embed the existing logo symbol without redrawing'];
  try {
    const symbol = Buffer.from(image[1], 'base64');
    const expected = await sharp(referenceLogo)
      .extract({ left: 0, top: 0, width: 73, height: 77 })
      .ensureAlpha()
      .raw()
      .toBuffer();
    const actual = await sharp(symbol).ensureAlpha().raw().toBuffer();
    const metadata = await sharp(symbol).metadata();
    if (metadata.width !== 73 || metadata.height !== 77 || !actual.equals(expected))
      return ['Clinic favicon symbol differs from the original clinic logo pixels'];
    if (
      !text.includes('viewBox="0 0 77 77"') ||
      !text.includes('x="2" y="0" width="73" height="77"') ||
      /transform=|style=|opacity=/.test(text)
    )
      return ['Clinic favicon must preserve the original symbol proportions and colors'];
  } catch (error) {
    return [`Clinic favicon verification failed: ${error.message}`];
  }
  return [];
}
