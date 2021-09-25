import React from 'react'
import {Button} from 'reactstrap';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import i18next from "i18next";

export const ExportCsv = ({csvData, fileName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <Button size="sm" color="warning" type="button" onClick={(e) => exportToCSV(csvData,fileName)}>{i18next.t("Export")}</Button>
    )
}

export default ExportCsv