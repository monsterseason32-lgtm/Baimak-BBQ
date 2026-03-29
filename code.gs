// ==========================================
// 1. การตั้งค่าเริ่มต้น (Configuration)
// ==========================================
const SPREADSHEET_ID = '1cF3A1Gncp-_TXMI-dhSIj4t2gIX4eXDYDFSjEEsZO3m5t4X2DUjaSVm6'; 

// ฟังก์ชันสำหรับตั้งค่าฐานข้อมูลครั้งแรก (ให้กดยืนยันสิทธิ์และรันฟังก์ชันนี้ 1 ครั้งใน Apps Script Editor)
function initDatabase() {
  let ss;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    // หากเปิดด้วย ID ไม่ได้ ให้ลองดึงจากหน้าปัจจุบัน (กรณีเป็น Container-bound script)
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
      Logger.log("ใช้ Active Spreadsheet แทน ID ที่ระบุ");
    } catch (err) {
      throw new Error("ไม่พบ Spreadsheet: ตรวจสอบ ID หรือการแชร์ไฟล์ (ID ที่ใช้อยู่: " + SPREADSHEET_ID + ")");
    }
  }

  const sheets = ['Menu', 'Promotions', 'Orders', 'Users'];
  
  sheets.forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      if (name === 'Orders') sheet.appendRow(['Timestamp', 'Order ID', 'Queue', 'User ID', 'Customer Name', 'Items', 'Total', 'Status']);
      if (name === 'Users') sheet.appendRow(['User ID', 'Display Name', 'Picture URL', 'Last Login']);
      if (name === 'Menu') sheet.appendRow(['id', 'name', 'price', 'category', 'img', 'hasSpiciness']);
      if (name === 'Promotions') sheet.appendRow(['id', 'title', 'desc', 'img', 'btnText', 'action', 'active']);
      Logger.log('Created sheet: ' + name);
    } else {
      Logger.log('Sheet already exists: ' + name);
    }
  });
  return "Database Initialized Successfully!";
}

// ฟังก์ชันสำหรับนำเข้าข้อมูลตัวอย่าง (Seed Data)
function seedDatabase() {
  const menuSheet = getSheet('Menu');
  const promoSheet = getSheet('Promotions');
  
  // ล้างข้อมูลเก่า (ไม่ลบหัวตาราง)
  if (menuSheet.getLastRow() > 1) menuSheet.getRange(2, 1, menuSheet.getLastRow()-1, 5).clearContent();
  if (promoSheet.getLastRow() > 1) promoSheet.getRange(2, 1, promoSheet.getLastRow()-1, 7).clearContent();

  const mockMenu = [
    ['m1', 'หมูสามชั้นสไลด์', 15, 'เนื้อสัตว์', 'https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?auto=format&fit=crop&w=300&q=80', true],
    ['m2', 'เนื้อโคขุน', 20, 'เนื้อสัตว์', 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=300&q=80', true],
    ['m3', 'เบคอนพันเห็ดเข็มทอง', 15, 'เนื้อสัตว์', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80', true],
    ['b1', 'ไส้กรอกหนังกรอบ', 10, 'ลูกชิ้น', 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=300&q=80', true],
    ['b2', 'เต้าหู้ชีส', 15, 'ลูกชิ้น', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?auto=format&fit=crop&w=300&q=80', true],
    ['v1', 'เห็ดออรินจิ', 10, 'ผัก', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=300&q=80', true],
    ['v2', 'บล็อคโคลี่', 10, 'ผัก', 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=300&q=80', true],
    ['n1', 'เส้นมันหนึบ', 15, 'เส้น', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80', true]
  ];

  const mockPromos = [
    ['p1', '<span class="text-primary">เซ็ตหม่าล่า</span> โคตรคุ้ม!', 'อิ่มจุกๆ ลดพิเศษ 20% เฉพาะสั่งผ่านแอพ', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', 'สั่งเลยตอนนี้', 'search', true],
    ['p2', 'ใหม่! <span class="text-gold">ชีสเยิ้มมม</span>', 'สายชีสห้ามพลาด เต้าหู้ชีสสุดฟิน', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?auto=format&fit=crop&w=600&q=80', 'ดูเมนูเลย', 'ลูกชิ้น', true],
    ['p3', 'สายผัก รักสุขภาพ', 'ผักสด สะอาด คัดสรรมาเพื่อคุณ', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80', 'สายตี้ผัก', 'ผัก', true]
  ];

  menuSheet.getRange(2, 1, mockMenu.length, 5).setValues(mockMenu);
  promoSheet.getRange(2, 1, mockPromos.length, 7).setValues(mockPromos);

  return "Database Seeded Successfully!";
}

// ฟังก์ชันสำหรับดึง Sheet
function getSheet(sheetName) {
  let ss;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    try { 
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (err) {
      throw new Error("ไม่สามารถเข้าถึง Spreadsheet ได้: " + e.message);
    }
  }
  
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    // หากไม่มี ให้พยายามสร้าง (ต้องรัน initDatabase ก่อน หรือมีสิทธิ์ Editor)
    initDatabase();
    sheet = ss.getSheetByName(sheetName);
  }
  return sheet;
}

// ==========================================
// 2. Main Entry Point: doPost (รองรับการเรียกแบบ POST ทั้งหมด)
// ==========================================
function doPost(e) {
  let action = e.parameter.action;
  let payload = {};
  
  try {
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }
  } catch (err) {}

  // หากไม่มี action ใน URL ให้หาจาก payload
  if (!action && payload.action) action = payload.action;

  let responseData;

  try {
    switch (action) {
      // ดึงข้อมูล
      case 'getMenu': responseData = getMenuData(); break;
      case 'getPromotions': responseData = getPromotionsData(); break;
      case 'getOrders': responseData = getOrdersData(); break;
      
      // จัดการเมนู (Admin)
      case 'saveMenu': responseData = saveMenu(payload); break;
      case 'deleteMenu': responseData = deleteMenu(payload.id); break;
      
      // บันทึกข้อมูล
      case 'saveUser': responseData = saveUser(payload); break;
      case 'createOrder': responseData = createOrder(payload); break;
      case 'updateStatus': responseData = updateOrderStatus(payload.orderId, payload.status); break;
      
      // จัดการแบนเนอร์ (Admin)
      case 'saveBanner': responseData = saveBanner(payload); break;
      case 'deleteBanner': responseData = deleteBanner(payload.id); break;
      case 'toggleBanner': responseData = toggleBanner(payload.id, payload.active); break;
      case 'reorderBanners': responseData = reorderBanners(payload); break;

      default:
        responseData = { success: false, message: 'Invalid Action: ' + action };
    }
  } catch (error) {
    responseData = { success: false, message: error.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

// ฟังก์ชัน fallback สำหรับ GET
function doGet(e) {
  return doPost(e);
}

// ==========================================
// 3. ฟังก์ชันการดึงข้อมูล (Read Data)
// ==========================================

function getMenuData() {
  const data = getSheetData('Menu');
  return data.map(row => ({
    id: row[0], name: row[1], price: row[2], category: row[3], img: row[4], 
    hasSpiciness: row[5] === true || row[5] === 'TRUE'
  })).filter(i => i.id);
}

function getPromotionsData() {
  const data = getSheetData('Promotions');
  return data.map(row => ({
    id: row[0], title: row[1], desc: row[2], img: row[3], 
    btnText: row[4], action: row[5], active: row[6] === true || row[6] === 'TRUE'
  })).filter(i => i.id);
}

function getOrdersData() {
  const data = getSheetData('Orders');
  // เรียงออเดอร์ล่าสุดไว้ข้างบน และแปลง Items กลับเป็น Array
  return data.map(row => ({
    timestamp: row[0], id: row[1], queue: row[2], userId: row[3], 
    customerName: row[4], items: JSON.parse(row[5] || '[]'), 
    total: row[6], status: row[7],
    time: row[0] instanceof Date ? Utilities.formatDate(row[0], "GMT+7", "HH:mm") : ""
  })).reverse();
}

// ==========================================
// 4. ฟังก์ชันการบันทึกและจัดการข้อมูล (Write/Update)
// ==========================================

function saveUser(user) {
  const sheet = getSheet('Users');
  const values = sheet.getDataRange().getValues();
  let foundRow = -1;
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === user.userId) {
      foundRow = i + 1;
      break;
    }
  }
  
  const now = new Date();
  if (foundRow > -1) {
    sheet.getRange(foundRow, 2, 1, 3).setValues([[user.name, user.picUrl, now]]);
  } else {
    sheet.appendRow([user.userId, user.name, user.picUrl, now]);
  }
  return { success: true };
}

function createOrder(order) {
  const sheet = getSheet('Orders');
  const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
  const queueNo = 'Q' + (sheet.getLastRow()).toString().padStart(2, '0');
  
  sheet.appendRow([
    new Date(), orderId, queueNo, order.userId, 
    order.customerName, JSON.stringify(order.items), order.total, 'pending'
  ]);
  
  return { success: true, orderId: orderId, queue: queueNo };
}

function updateOrderStatus(orderId, status) {
  const sheet = getSheet('Orders');
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][1] === orderId) {
      sheet.getRange(i + 1, 8).setValue(status);
      return { success: true };
    }
  }
  return { success: false, message: 'Order not found' };
}

// ==========================================
// 5. ฟังก์ชันการจัดการเมนู (Menu Management)
// ==========================================

function saveMenu(menu) {
  const sheet = getSheet('Menu');
  const values = sheet.getDataRange().getValues();
  let foundRow = -1;
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === menu.id) {
      foundRow = i + 1;
      break;
    }
  }
  
  const rowData = [menu.id, menu.name, menu.price, menu.category, menu.img, menu.hasSpiciness];
  if (foundRow > -1) {
    sheet.getRange(foundRow, 1, 1, 6).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  return { success: true };
}

function deleteMenu(id) {
  const sheet = getSheet('Menu');
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false };
}

function saveBanner(banner) {
  const sheet = getSheet('Promotions');
  const values = sheet.getDataRange().getValues();
  let foundRow = -1;
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === banner.id) {
      foundRow = i + 1;
      break;
    }
  }
  
  const rowData = [banner.id, banner.title, banner.desc, banner.img, banner.btnText, banner.action, banner.active];
  if (foundRow > -1) {
    sheet.getRange(foundRow, 1, 1, 7).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  return { success: true };
}

function deleteBanner(id) {
  const sheet = getSheet('Promotions');
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false };
}

function toggleBanner(id, active) {
  const sheet = getSheet('Promotions');
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      sheet.getRange(i + 1, 7).setValue(active);
      return { success: true };
    }
  }
  return { success: false };
}

function reorderBanners(payload) {
  const sheet = getSheet('Promotions');
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true }; // ข้ามหากมีแค่หัวตาราง

  const headers = data.shift(); // ดึง Header ออกมาเก็บไว้ชั่วคราว
  const newOrderIds = payload.bannerIds || [];
  
  // จัดเรียงข้อมูลตามลำดับ ID ที่ส่งมาจาก Frontend
  data.sort((a, b) => {
    let indexA = newOrderIds.indexOf(a[0]);
    let indexB = newOrderIds.indexOf(b[0]);
    if (indexA === -1) indexA = 999;
    if (indexB === -1) indexB = 999;
    return indexA - indexB;
  });
  
  // ลบข้อมูลเดิมแล้วเขียนข้อมูลชุดใหม่ทับลงไป
  sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
  
  return { success: true };
}

// ==========================================
// Helper Utility
// ==========================================
function getSheetData(sheetName) {
  const sheet = getSheet(sheetName);
  const range = sheet.getDataRange();
  const values = range.getValues();
  values.shift(); // Remove headers
  return values;
}
