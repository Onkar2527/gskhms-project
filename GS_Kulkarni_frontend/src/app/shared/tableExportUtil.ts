import * as XLSX from 'xlsx';
import { TableElement } from './TableElement';
import  jsPDF  from 'jspdf';
import autoTable from 'jspdf-autotable';

const getFileName = (name: string) => {
  const timeSpan = new Date().toISOString();
  const sheetName = name || 'ExportResult';
  const fileName = `${sheetName}-${timeSpan}`;
  return {
    sheetName,
    fileName,
  };
};
export class TableExportUtil {
  static exportToExcel(arr: Partial<TableElement>[], name: string) {
    const { sheetName, fileName } = getFileName(name);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(arr);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  static exportToPDF(exportData: any[], title: string) {
    const doc = new jsPDF('l', 'mm', [297, 210]);
    const dataValue: any = Object.keys(exportData).map(function (
      personNamedIndex: any
    ) {
      return Object.values(exportData[personNamedIndex]);
    });
    const keys: any = Object.keys(exportData[0]);

    autoTable(doc, {
      head: [keys],
      body: dataValue,
      didDrawPage: function (data) {
        // Header
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text(title, data.settings.margin.left, 22);
    },
    margin: {top: 30}
    });

    const { fileName } = getFileName('pdf');

    doc.save(`${fileName}.pdf`);
  }
}
