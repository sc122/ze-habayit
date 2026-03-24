# הגדרת Google Sheets — 3 צעדים

## שלב 1 — צור Google Sheet
1. פתח [Google Sheets](https://sheets.new) → Sheet חדש
2. שנה שם לגיליון: `תגובות`
3. בשורה 1 הכנס: **A1** = `תאריך` | **B1** = `שאלה`

## שלב 2 — צור Apps Script
1. בתפריט: **תוספות → Apps Script**
2. מחק את הקוד הקיים והדבק:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
    sheet.appendRow([timestamp, data.question]);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. שמור (Ctrl+S)

## שלב 3 — פרוס ועתיק URL
1. לחץ **פרוס → פריסה חדשה**
2. סוג: **אפליקציית אינטרנט**
3. הגדר: "הפעל בתור" = **אני** | "מי יכול לגשת" = **כולם**
4. לחץ **פרוס** → אשר הרשאות
5. **העתק את ה-URL** שמתקבל

## שלב 4 — הגדר env
```bash
cp .env.local.example .env.local
# פתח .env.local והדבק את ה-URL:
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
```

```bash
npm run dev
```
