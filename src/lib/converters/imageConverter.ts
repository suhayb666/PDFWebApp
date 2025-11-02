import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { readFile, writeFile } from 'fs/promises';

export async function convertImageToPDF(
  inputPath: string,
  outputPath: string
): Promise<void> {
  const imageBuffer = await readFile(inputPath);
  
  // Optimize image
  const optimizedImage = await sharp(imageBuffer)
    .jpeg({ quality: 85 })
    .toBuffer();

  const pdfDoc = await PDFDocument.create();
  
  // Embed image
  const image = await pdfDoc.embedJpg(optimizedImage);
  const { width, height } = image.scale(1);
  
  const page = pdfDoc.addPage([width, height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width,
    height,
  });

  const pdfBytes = await pdfDoc.save();
  await writeFile(outputPath, pdfBytes);
}