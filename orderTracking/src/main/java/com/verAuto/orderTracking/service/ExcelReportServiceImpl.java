package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.OrderItem;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelReportServiceImpl implements ExcelReportService{

    public ByteArrayInputStream exportOrdersToExcel(List<OrderItem> orders) {
        // SXSSFWorkbook(100) -> keeps only 100 rows in RAM
        try (SXSSFWorkbook workbook = new SXSSFWorkbook(100);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Optimization: compress the temporary XML files on disk
            workbook.setCompressTempFiles(true);

            Sheet sheet = workbook.createSheet("Rapport Commandes");

            // 1. Create Styles (Header and Date)
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dateStyle = workbook.createCellStyle();
            dateStyle.setDataFormat(workbook.getCreationHelper().createDataFormat().getFormat("dd-mm-yyyy"));

            // 2. Create Header Row
            String[] columns = {"Date de creation", "Libelle","Matricule", "Companie",
                    "Destination", "Transport", "Status", "Commentaire",
                     "dernière mise à jour", "Num Dossier"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // 3. Fill Data
            int rowIdx = 1;
            for (OrderItem item : orders) {
                Row row = sheet.createRow(rowIdx++);

                Cell dateCell = row.createCell(0);
                dateCell.setCellValue(item.getCreatedAt());
                dateCell.setCellStyle(dateStyle);
                String vehicle =item.getWindowType().getLabel() + " " + item.getCarModel().getCarBrand().getBrand() + " " + item.getCarModel().getModel();
                row.createCell(1).setCellValue(vehicle);
                row.createCell(2).setCellValue(item.getRegistrationNumber());
                row.createCell(3).setCellValue(item.getCompany().getCompanyName());
                row.createCell(4).setCellValue(item.getCity().getCityName());

                setSafeStringValue(row,5, (item.getTransitCompany() != null ? item.getTransitCompany().getName() : ""));
                row.createCell(6).setCellValue(item.getStatus().getLabel());
                setSafeStringValue(row,7, item.getComment());
                Cell dataCell2 = row.createCell(8);
                dataCell2.setCellValue(item.getUpdatedAt());
                dataCell2.setCellStyle(dateStyle);
                row.createCell(9).setCellValue(item.getFileNumber());
            }

            // 4. Set Fixed Column Widths (Mandatory for SXSSF as autoSize is slow/restricted)
            for (int i = 0; i < columns.length; i++) {
                sheet.setColumnWidth(i, 5000);
            }

            workbook.write(out);

            // IMPORTANT: Delete temporary files from disk
            workbook.dispose();

            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Erreur génération Excel: " + e.getMessage());
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }
    private void setSafeStringValue(Row row, int cellIndex, String value) {
        row.createCell(cellIndex).setCellValue(value != null ? value : "");
    }
}
