/**
 * Utilities for downloading and previewing email attachments (PDFs, Images, Docs)
 */

/**
 * Creates a valid, openable 1-page PDF Blob for sample/mock PDF attachments
 */
export function createMockPdfBlob(filename, title) {
  const safeTitle = (title || filename || 'Document').replace(/[()\\]/g, '');
  const text = `Document: ${safeTitle}`;
  const length = text.length + 35;

  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${length} >>
stream
BT
/F1 18 Tf
72 710 Td
(${text}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000229 00000 n 
0000000360 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
440
%%EOF`;

  return new Blob([content], { type: 'application/pdf' });
}

/**
 * Initiates an actual browser download for any attached file (PDF, image, doc)
 */
export function downloadAttachment(file) {
  if (!file) return;

  const filename = file.name || 'document.pdf';

  // Case 1: Attachment contains uploaded Data URL (e.g. from FileReader)
  if (file.dataUrl || (file.url && file.url.startsWith('data:'))) {
    const dataUrl = file.dataUrl || file.url;
    triggerDownload(dataUrl, filename);
    return;
  }

  // Case 2: Attachment has an existing fetchable or blob URL
  if (file.url && (file.url.startsWith('blob:') || file.url.startsWith('http'))) {
    triggerDownload(file.url, filename);
    return;
  }

  // Case 3: PDF attachment without data URL (e.g. sample mock PDF)
  if (filename.toLowerCase().endsWith('.pdf') || (file.type && file.type.includes('pdf'))) {
    const pdfBlob = createMockPdfBlob(filename, `Gmail Attachment - ${filename}`);
    const blobUrl = URL.createObjectURL(pdfBlob);
    triggerDownload(blobUrl, filename);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    return;
  }

  // Case 4: Other file types fallback
  const blob = new Blob([file.content || `Content for ${filename}`], {
    type: file.type || 'application/octet-stream'
  });
  const blobUrl = URL.createObjectURL(blob);
  triggerDownload(blobUrl, filename);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
}

/**
 * Triggers browser file download via temporary anchor element
 */
function triggerDownload(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
