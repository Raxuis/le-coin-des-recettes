import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPDF(element: HTMLElement, title: string) {
    if (!element) return;

    const hiddenElements = element.querySelectorAll('.export-hidden');
    hiddenElements.forEach(el => el.setAttribute('style', 'display: none;'));

    const canvas = await html2canvas(element, {
        scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${title}.pdf`);

    // Restore visibility of the hidden elements
    hiddenElements.forEach(el => el.removeAttribute('style'));
}
