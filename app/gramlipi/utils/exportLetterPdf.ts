import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Renders a DOM node to an image and embeds it in a downloadable A4 PDF.
 * We deliberately go through html2canvas rather than jsPDF's native text API:
 * jsPDF's built-in fonts don't support Kannada glyphs, so native text would
 * render Kannada letters as blank boxes. Capturing the already-rendered
 * (browser-fonted) DOM works for any script without embedding a font file.
 */
export async function exportNodeToPdf(node: HTMLElement, fileName: string): Promise<void> {
  const canvas = await html2canvas(node, {
    scale: 2, // higher scale = sharper text in the output PDF
    backgroundColor: '#ffffff',
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;

  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Handles letters long enough to spill onto a second page (a lengthy
  // complaint description could push past one A4 page).
  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  pdf.save(fileName);
}