import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function convertWordToPDF(
  inputPath: string,
  outputPath: string
): Promise<void> {
  try {
    // Using LibreOffice for conversion (needs to be installed on server)
    await execPromise(
      `libreoffice --headless --convert-to pdf --outdir ${outputPath.split('/').slice(0, -1).join('/')} ${inputPath}`
    );
  } catch (error) {
    throw new Error(`Word conversion failed: ${error}`);
  }
}