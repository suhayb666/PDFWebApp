import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { readFile } from 'fs/promises';

export async function convertExcelToPDF(
  inputPath: string,
  outputPath: string
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(inputPath);

  const doc = new PDFDocument({ margin: 30 });
  const stream = createWriteStream(outputPath);
  doc.pipe(stream);

  workbook.eachSheet((worksheet, sheetId) => {
    doc.fontSize(16).text(worksheet.name, { underline: true });
    doc.moveDown();

    worksheet.eachRow((row, rowNumber) => {
      const rowData = row.values as any[];
      const text = rowData.slice(1).join(' | ');
      doc.fontSize(10).text(text);
    });

    if (sheetId < workbook.worksheets.length) {
      doc.addPage();
    }
  });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}