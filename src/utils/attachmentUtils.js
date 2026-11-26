/**
 * Utilities for downloading and previewing email attachments (Spreadsheets, PDFs, Images, Docs)
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
 * Creates a valid CSV / Excel spreadsheet Blob for sample/mock Excel attachments
 */
export function createMockExcelBlob(filename) {
  const csvContent = `Candidate_ID,Applicant_Name,College,Branch,Test_Slot,Status
GTBIT_2026_01,Deepanshu Sharma,GTBIT,CSE,10:00 AM - 12:00 PM,Shortlisted
GTBIT_2026_02,Saurabh Singh,GTBIT,IT,10:00 AM - 12:00 PM,Shortlisted
GTBIT_2026_03,Prabhmehar Kaur,GTBIT,CSE,02:00 PM - 04:00 PM,Confirmed
GTBIT_2026_04,Harmeet Singh,GTBIT,ECE,02:00 PM - 04:00 PM,Confirmed
GTBIT_2026_05,Hridyamann,GTBIT,CSE,02:00 PM - 04:00 PM,Confirmed
GTBIT_2026_06,TEGVEER Singh,GTBIT,IT,04:00 PM - 06:00 PM,Shortlisted
GTBIT_2026_07,Pushpender,GTBIT,CSE,04:00 PM - 06:00 PM,Shortlisted
`;
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

/**
 * Initiates an actual browser download for any attached file (Spreadsheet, PDF, image, doc)
 */
export function downloadAttachment(file) {
  if (!file) return;

  const filename = file.name || 'document.pdf';
  const lower = filename.toLowerCase();

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

  // Case 3: Excel / Spreadsheet file (.xlsx, .xls, .csv)
  if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv') || file.type?.includes('sheet') || file.type?.includes('excel') || file.type?.includes('csv')) {
    const excelBlob = createMockExcelBlob(filename);
    const blobUrl = URL.createObjectURL(excelBlob);
    triggerDownload(blobUrl, filename);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    return;
  }

  // Case 4: PDF attachment without data URL
  if (lower.endsWith('.pdf') || (file.type && file.type.includes('pdf'))) {
    const pdfBlob = createMockPdfBlob(filename, `Gmail Attachment - ${filename}`);
    const blobUrl = URL.createObjectURL(pdfBlob);
    triggerDownload(blobUrl, filename);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    return;
  }

  // Case 5: Other file types fallback
  const blob = new Blob([file.content || `Content for ${filename}`], {
    type: file.type || 'application/octet-stream'
  });
  const blobUrl = URL.createObjectURL(blob);
  triggerDownload(blobUrl, filename);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
}

/**
 * Downloads all attachments in an email sequentially
 */
export function downloadAllAttachments(attachments) {
  if (!Array.isArray(attachments) || attachments.length === 0) return;
  attachments.forEach((file, index) => {
    setTimeout(() => {
      downloadAttachment(file);
    }, index * 250);
  });
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
