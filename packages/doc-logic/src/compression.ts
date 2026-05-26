import { PDFDocument } from 'pdf-lib';

/**
 * Strips metadata and applies object stream compression to a PDF.
 * This is the primary client-side compression for My Docs.
 */
export async function compressPDF(pdfBytes: Uint8Array): Promise<Uint8Array> {
  try {
    const doc = await PDFDocument.load(pdfBytes);
    
    // Strip potentially sensitive/redundant metadata
    doc.setTitle('');
    doc.setAuthor('');
    doc.setSubject('');
    doc.setKeywords([]);
    doc.setProducer('');
    doc.setCreator('');
    doc.setCreationDate(new Date());
    doc.setModificationDate(new Date());

    // Save with optimizations: object streams and binary compression
    const compressedBytes = await doc.save({ 
      useObjectStreams: true,
      addDefaultPage: false 
    });

    return compressedBytes;
  } catch (error) {
    console.error('[DocLogic] Compression Error:', error);
    throw new Error('Failed to compress PDF. Please ensure it is a valid, unencrypted PDF.');
  }
}

/**
 * Validates file size and type for My Docs.
 */
export function validateDocument(fileSize: number, mimeType: string): { valid: boolean; error?: string } {
  const MAX_SIZE_50MB = 50 * 1024 * 1024;
  
  if (mimeType !== 'application/pdf') {
    return { valid: false, error: 'FILE_TYPE_ERROR' };
  }
  
  if (fileSize > MAX_SIZE_50MB) {
    return { valid: false, error: 'SIZE_LIMIT_ERROR' };
  }
  
  return { valid: true };
}
