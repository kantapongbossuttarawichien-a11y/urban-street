const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  if (!e || !e.parameter) return JSONResponse({ message: "Script is running! Please call via URL." });
  
  const action = e.parameter.action;
  const sheetName = e.parameter.sheet; 
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) return JSONResponse({ error: "ไม่พบใบงานชื่อ: " + sheetName });
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 1) return JSONResponse({ [sheetName]: [] });
  
  const headers = data[0];
  const rows = data.slice(1);
  
  const result = rows.map((row, index) => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    // เพิ่ม _rowNumber แยกออกมา เพื่อใช้ใน update โดยไม่ชนกับคอลัมน์ id
    obj._rowNumber = index + 2;
    return obj;
  });
  
  const output = {};
  output[sheetName] = result;
  return JSONResponse(output);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(data.sheet);
  
  if (!sheet) return JSONResponse({ error: "Sheet not found: " + data.sheet });

  if (data.action === "add") {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const newRow = headers.map(h => data.payload[h] !== undefined ? data.payload[h] : "");
    sheet.appendRow(newRow);
    return JSONResponse({ success: true });
  }
  
  if (data.action === "update") {
    const targetId = String(data.id);
    const allData = sheet.getDataRange().getValues();
    const headers = allData[0];
    
    // ค้นหา row โดยจับคู่ค่าในคอลัมน์ "id" แทนการใช้ตัวเลข row โดยตรง
    const idColIndex = headers.indexOf("id");
    let rowNumber = -1;
    
    if (idColIndex >= 0) {
      for (let i = 1; i < allData.length; i++) {
        if (String(allData[i][idColIndex]) === targetId) {
          rowNumber = i + 1; // +1 เพราะ array เริ่มที่ 0 แต่ Sheets เริ่มที่ 1
          break;
        }
      }
    }
    
    if (rowNumber === -1) {
      return JSONResponse({ error: "ไม่พบรายการที่มี id: " + targetId });
    }
    
    for (let key in data.payload) {
      if (key === "_rowNumber") continue; // ข้ามฟิลด์ internal
      const colIndex = headers.indexOf(key) + 1;
      if (colIndex > 0) {
        sheet.getRange(rowNumber, colIndex).setValue(data.payload[key]);
      }
    }
    return JSONResponse({ success: true });
  }

  // ลบแถวออกจาก Google Sheets ถาวร โดยค้นหาจาก id
  if (data.action === "delete") {
    const targetId = String(data.id);
    const allData = sheet.getDataRange().getValues();
    const headers = allData[0];

    const idColIndex = headers.indexOf("id");
    if (idColIndex === -1) {
      return JSONResponse({ error: "ไม่พบคอลัมน์ id ใน sheet: " + data.sheet });
    }

    for (let i = 1; i < allData.length; i++) {
      if (String(allData[i][idColIndex]) === targetId) {
        sheet.deleteRow(i + 1); // +1 เพราะ array index 0 = แถวที่ 1 ของ Sheets
        return JSONResponse({ success: true, message: "ลบรายการ id " + targetId + " สำเร็จ" });
      }
    }

    return JSONResponse({ error: "ไม่พบรายการที่มี id: " + targetId });
  }
  
  return JSONResponse({ error: "Unknown action: " + data.action });
}

function JSONResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
