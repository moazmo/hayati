# Installation Guide | دليل التثبيت

## System Requirements | متطلبات النظام

### Minimum Requirements | المتطلبات الدنيا

- **Operating System | نظام التشغيل**: Windows 10 (64-bit) or later
- **RAM | الذاكرة**: 4 GB minimum, 8 GB recommended
- **Storage | التخزين**: 500 MB free space
- **Display | الشاشة**: 1366x768 resolution minimum

### Recommended Requirements | المتطلبات الموصى بها

- **Operating System | نظام التشغيل**: Windows 11 (64-bit)
- **RAM | الذاكرة**: 8 GB or more
- **Storage | التخزين**: 1 GB free space (for data and updates)
- **Display | الشاشة**: 1920x1080 resolution or higher
- **Network | الشبكة**: Internet connection for updates (optional)

## Installation Methods | طرق التثبيت

### Method 1: Download from GitHub Releases | الطريقة الأولى: التحميل من إصدارات جيتهب

1. **Visit the releases page | زيارة صفحة الإصدارات**
   - Go to: https://github.com/hayati-app/hayati/releases
   - اذهب إلى: https://github.com/hayati-app/hayati/releases

2. **Download the latest version | تحميل أحدث إصدار**
   - Click on the latest release
   - Download `Hayati-Setup-x.x.x.exe` for Windows
   - انقر على أحدث إصدار
   - حمل `Hayati-Setup-x.x.x.exe` لنظام ويندوز

3. **Install the application | تثبيت التطبيق**
   - Run the downloaded installer
   - Follow the installation wizard
   - شغل برنامج التثبيت المُحمل
   - اتبع معالج التثبيت

### Method 2: Build from Source | الطريقة الثانية: البناء من المصدر

For developers who want to build from source:
للمطورين الذين يريدون البناء من المصدر:

1. **Prerequisites | المتطلبات المسبقة**
   ```bash
   # Install Node.js (v18 or higher)
   # Install Git
   ```

2. **Clone the repository | استنساخ المستودع**
   ```bash
   git clone https://github.com/hayati-app/hayati.git
   cd hayati
   ```

3. **Install dependencies | تثبيت التبعيات**
   ```bash
   npm install
   ```

4. **Build the application | بناء التطبيق**
   ```bash
   npm run build
   npm run package
   ```

## First Time Setup | الإعداد الأولي

### 1. Language Selection | اختيار اللغة

When you first start Hayati, you'll be prompted to:
عند تشغيل حياتي لأول مرة، ستُطلب منك:

- Choose your preferred language (Arabic/English)
- اختيار لغتك المفضلة (العربية/الإنجليزية)
- Set your location for prayer times
- تحديد موقعك لأوقات الصلاة

### 2. Prayer Times Configuration | إعداد أوقات الصلاة

1. **Location Setup | إعداد الموقع**
   - Allow location access for automatic detection
   - أو manually enter your city name
   - اسمح بالوصول للموقع للكشف التلقائي
   - أو أدخل اسم مدينتك يدوياً

2. **Calculation Method | طريقة الحساب**
   - Choose your preferred calculation method
   - Common methods: Muslim World League, Egyptian, etc.
   - اختر طريقة الحساب المفضلة لديك
   - الطرق الشائعة: رابطة العالم الإسلامي، المصرية، إلخ

### 3. Notification Settings | إعدادات الإشعارات

Configure notifications for:
إعداد الإشعارات لـ:

- Prayer times | أوقات الصلاة
- Task reminders | تذكيرات المهام
- Habit tracking | تتبع العادات

## Troubleshooting | استكشاف الأخطاء

### Common Issues | المشاكل الشائعة

#### Installation Problems | مشاكل التثبيت

**Problem**: Installation fails with permission error
**المشكلة**: فشل التثبيت مع خطأ في الصلاحيات

**Solution**:
1. Run installer as Administrator
2. Disable antivirus temporarily during installation
3. Ensure sufficient disk space

**الحل**:
1. شغل برنامج التثبيت كمدير
2. عطل برنامج مكافحة الفيروسات مؤقتاً أثناء التثبيت
3. تأكد من وجود مساحة كافية على القرص

#### Prayer Times Inaccurate | أوقات الصلاة غير دقيقة

**Problem**: Prayer times are not correct for your location
**المشكلة**: أوقات الصلاة غير صحيحة لموقعك

**Solution**:
1. Check location settings in preferences
2. Try a different calculation method
3. Manually adjust times if needed

**الحل**:
1. تحقق من إعدادات الموقع في التفضيلات
2. جرب طريقة حساب مختلفة
3. اضبط الأوقات يدوياً إذا لزم الأمر

#### Arabic Text Display Issues | مشاكل عرض النص العربي

**Problem**: Arabic text appears broken or reversed
**المشكلة**: النص العربي يظهر مكسور أو معكوس

**Solution**:
1. Ensure Cairo font is installed
2. Restart the application
3. Check Windows Arabic language support

**الحل**:
1. تأكد من تثبيت خط Cairo
2. أعد تشغيل التطبيق
3. تحقق من دعم اللغة العربية في ويندوز

### Getting Help | الحصول على المساعدة

If you continue to experience issues:
إذا استمررت في مواجهة مشاكل:

1. **Check the FAQ** | راجع الأسئلة الشائعة
2. **Search existing issues** on GitHub | ابحث في المشاكل الموجودة على جيتهب
3. **Create a new issue** with details | أنشئ مشكلة جديدة مع التفاصيل
4. **Contact support** | اتصل بالدعم: support@hayati-app.com

## Updates | التحديثات

### Automatic Updates | التحديثات التلقائية

Hayati checks for updates automatically:
حياتي يتحقق من التحديثات تلقائياً:

- Updates are downloaded in the background
- You'll be notified when an update is ready
- Updates require application restart
- التحديثات تُحمل في الخلفية
- ستُخطر عندما يكون التحديث جاهزاً
- التحديثات تتطلب إعادة تشغيل التطبيق

### Manual Updates | التحديثات اليدوية

To update manually:
للتحديث يدوياً:

1. Download the latest version from GitHub releases
2. Install over the existing installation
3. Your data will be preserved
4. حمل أحدث إصدار من إصدارات جيتهب
5. ثبت فوق التثبيت الموجود
6. بياناتك ستُحفظ

## Data Management | إدارة البيانات

### Data Location | موقع البيانات

Your data is stored locally at:
بياناتك مُخزنة محلياً في:

```
Windows: %APPDATA%/Hayati/
```

### Backup | النسخ الاحتياطي

**Automatic Backups**:
- Daily backups created automatically
- Last 7 days kept by default

**Manual Backups**:
- Use File → Export Data menu
- Save to external drive for safety

**النسخ الاحتياطية التلقائية**:
- نسخ احتياطية يومية تُنشأ تلقائياً
- آخر 7 أيام تُحفظ افتراضياً

**النسخ الاحتياطية اليدوية**:
- استخدم قائمة ملف ← تصدير البيانات
- احفظ في قرص خارجي للأمان

### Data Migration | ترحيل البيانات

When upgrading from older versions:
عند الترقية من إصدارات أقدم:

1. Backup your current data first
2. Install the new version
3. Data will be migrated automatically
4. احتفظ بنسخة احتياطية من بياناتك أولاً
5. ثبت الإصدار الجديد
6. البيانات ستُرحل تلقائياً

---

*For more help, visit our [GitHub Wiki](https://github.com/hayati-app/hayati/wiki)*

*للمزيد من المساعدة، زر [ويكي جيتهب](https://github.com/hayati-app/hayati/wiki)*
