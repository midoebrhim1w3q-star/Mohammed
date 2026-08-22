/* ============================================================
   مرصد العمر — منطق حساب العمر والبرج الفلكي
   جافاسكربت خالص بدون أي مكتبات خارجية
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- مفاتيح التخزين المحلي ---------------- */
  var STORAGE_DATE = "ageapp:birthDate";
  var STORAGE_NAME = "ageapp:userName";
  var STORAGE_THEME = "ageapp:theme";

  /* ---------------- عناصر الصفحة ---------------- */
  var form = document.getElementById("ageForm");
  var nameInput = document.getElementById("userName");
  var dateInput = document.getElementById("birthDate");
  var resetBtn = document.getElementById("resetBtn");
  var againBtn = document.getElementById("againBtn");
  var shareBtn = document.getElementById("shareBtn");
  var shareNote = document.getElementById("shareNote");
  var errorMsg = document.getElementById("errorMsg");
  var results = document.getElementById("results");
  var themeToggle = document.getElementById("themeToggle");

  var out = {
    name: document.getElementById("displayName"),
    exactAge: document.getElementById("exactAge"),
    years: document.getElementById("statYears"),
    months: document.getElementById("statMonths"),
    weeks: document.getElementById("statWeeks"),
    days: document.getElementById("statDays"),
    hours: document.getElementById("statHours"),
    minutes: document.getElementById("statMinutes"),
    zodiacName: document.getElementById("zodiacName"),
    zodiacGlyph: document.getElementById("zodiacGlyph"),
    zodiacRange: document.getElementById("zodiacRange"),
    zodiacTraits: document.getElementById("zodiacTraits"),
    bdayDays: document.getElementById("daysToBirthday"),
    bdayUnit: document.getElementById("bdayUnit"),
    bdayDate: document.getElementById("nextBirthdayDate"),
    bdayDay: document.getElementById("nextBirthdayDay")
  };

  /* ---------------- بيانات الأبراج الفلكية ----------------
     start: [شهر, يوم] بداية البرج — الترتيب من الجدي إلى الجدي
  --------------------------------------------------------- */
  var ZODIACS = [
    {
      name: "الجدي",
      glyph: "♑",
      from: [12, 22],
      to: [1, 19],
      traits: "منظّم وطموح وصبور، يثق بالعمل الطويل أكثر من الحظ السريع، ويصل إلى أهدافه بخطوات محسوبة."
    },
    {
      name: "الدلو",
      glyph: "♒",
      from: [1, 20],
      to: [2, 18],
      traits: "مستقل التفكير ومبتكر، يحب الأفكار الجديدة والقضايا الإنسانية، ويرفض القوالب الجاهزة."
    },
    {
      name: "الحوت",
      glyph: "♓",
      from: [2, 19],
      to: [3, 20],
      traits: "حسّاس وخيالي وعطوف، يمتلك حدسًا قويًا وقدرة نادرة على فهم مشاعر من حوله."
    },
    {
      name: "الحمل",
      glyph: "♈",
      from: [3, 21],
      to: [4, 19],
      traits: "جسور ومتحمّس ومبادر، يفضّل أن يبدأ الأمور بنفسه ولا يطيق الانتظار الطويل."
    },
    {
      name: "الثور",
      glyph: "♉",
      from: [4, 20],
      to: [5, 20],
      traits: "ثابت ومخلص ومحبّ للجمال والاستقرار، يبني ما يملك بهدوء ولا يتخلى عنه بسهولة."
    },
    {
      name: "الجوزاء",
      glyph: "♊",
      from: [5, 21],
      to: [6, 20],
      traits: "سريع البديهة واجتماعي وكثير الأسئلة، يتعلّم بسرعة ويجيد التعبير عن نفسه."
    },
    {
      name: "السرطان",
      glyph: "♋",
      from: [6, 21],
      to: [7, 22],
      traits: "وفيّ وحنون ومرتبط بأهله وذكرياته، يحمي من يحب ويمنحهم إحساسًا بالأمان."
    },
    {
      name: "الأسد",
      glyph: "♌",
      from: [7, 23],
      to: [8, 22],
      traits: "واثق وكريم وصاحب حضور لافت، يحب التقدير ويقود من حوله بحماس وسخاء."
    },
    {
      name: "العذراء",
      glyph: "♍",
      from: [8, 23],
      to: [9, 22],
      traits: "دقيق ومنطقي ومهتم بالتفاصيل، يحسّن كل ما تقع عليه يده ويحب النظام."
    },
    {
      name: "الميزان",
      glyph: "♎",
      from: [9, 23],
      to: [10, 22],
      traits: "دبلوماسي ومحبّ للعدل والتوازن، يجيد التوفيق بين الأطراف وينفر من الخلاف."
    },
    {
      name: "العقرب",
      glyph: "♏",
      from: [10, 23],
      to: [11, 21],
      traits: "عميق وشديد التركيز وقوي الإرادة، لا يفعل شيئًا بنصف قلب ويصعب نسيان مواقفه."
    },
    {
      name: "القوس",
      glyph: "♐",
      from: [11, 22],
      to: [12, 21],
      traits: "متفائل ومحبّ للحرية والسفر والمعرفة، يرى الصورة الكبيرة ولا يخشى المجازفة."
    }
  ];

  var AR_MONTHS = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  var AR_WEEKDAYS = [
    "الأحد", "الإثنين", "الثلاثاء", "الأربعاء",
    "الخميس", "الجمعة", "السبت"
  ];

  var MS_MINUTE = 60 * 1000;
  var MS_HOUR = 60 * MS_MINUTE;
  var MS_DAY = 24 * MS_HOUR;

  /* حالة التطبيق: تاريخ الميلاد الحالي المحسوب + مؤقّت التحديث */
  var currentBirth = null;
  var currentName = "";
  var ticker = null;

  /* ============================================================
     1) أدوات مساعدة
     ============================================================ */

  /** تنسيق الأرقام بفواصل الآلاف بالأرقام العربية */
  function fmt(n) {
    return Number(n).toLocaleString("ar-EG");
  }

  /** تنسيق رقم بالأرقام العربية بدون فواصل آلاف (للسنوات مثل ١٩٩٨) */
  function fmtPlain(n) {
    return Number(n).toLocaleString("ar-EG", { useGrouping: false });
  }

  /** هل السنة كبيسة؟ */
  function isLeapYear(y) {
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  }

  /** عدد أيام شهر معيّن (month: 0-11) مع مراعاة السنوات الكبيسة */
  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  /** تحويل قيمة حقل التاريخ (YYYY-MM-DD) إلى كائن تاريخ محلي */
  function parseInputDate(value) {
    var parts = String(value).split("-");
    if (parts.length !== 3) return null;

    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);

    if (!y || !m || !d) return null;
    if (m < 1 || m > 12) return null;
    if (d < 1 || d > daysInMonth(y, m - 1)) return null; // يرفض 31 فبراير مثلًا

    var date = new Date(y, m - 1, d, 0, 0, 0, 0);
    // التحقق من مطابقة التاريخ الناتج للمُدخل
    if (
      date.getFullYear() !== y ||
      date.getMonth() !== m - 1 ||
      date.getDate() !== d
    ) {
      return null;
    }
    return date;
  }

  /** صياغة تاريخ بالعربية: ١٢ مارس ١٩٩٨ */
  function formatArabicDate(date) {
    return (
      fmtPlain(date.getDate()) +
      " " +
      AR_MONTHS[date.getMonth()] +
      " " +
      fmtPlain(date.getFullYear())
    );
  }

  /**
   * صياغة صحيحة للعدد في العربية:
   *   1  → سنة واحدة
   *   2  → سنتان
   *  3-10 → ٣ سنوات (جمع)
   *  11+ → ١١ سنة (مفرد منصوب)
   */
  function pluralize(count, one, two, few, many) {
    if (count === 0) return "";
    if (count === 1) return one;
    if (count === 2) return two;
    if (count <= 10) return fmt(count) + " " + few;
    return fmt(count) + " " + many;
  }

  /* ============================================================
     2) حساب العمر الدقيق
     ============================================================ */

  /**
   * يضيف عددًا من الشهور إلى تاريخ معيّن مع تثبيت اليوم داخل حدود الشهر.
   * مثال: 31 يناير + شهر واحد = 28 أو 29 فبراير (حسب السنة الكبيسة).
   */
  function addMonths(date, count) {
    var target = new Date(
      date.getFullYear(),
      date.getMonth() + count,
      1,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
    var limit = daysInMonth(target.getFullYear(), target.getMonth());
    target.setDate(Math.min(date.getDate(), limit));
    return target;
  }

  /**
   * يحسب الفرق الدقيق بين تاريخ الميلاد واللحظة الحالية.
   *
   * الطريقة: نحدد أولًا عدد الشهور الكاملة المنقضية، ثم نحسب الأيام
   * المتبقية بعد آخر "ذكرى شهرية" فعلية. هذا يراعي اختلاف عدد أيام
   * الشهور (28/29/30/31) والسنوات الكبيسة تلقائيًا، بدلًا من الاعتماد
   * على استلاف رقم ثابت من الشهر السابق.
   */
  function calculateAge(birth, now) {
    // تقدير أولي لعدد الشهور، ثم تصحيحه بالمقارنة الفعلية
    var totalMonths =
      (now.getFullYear() - birth.getFullYear()) * 12 +
      (now.getMonth() - birth.getMonth());

    if (totalMonths < 0) totalMonths = 0;

    // إن كانت الذكرى الشهرية لم تحن بعد، نتراجع شهرًا
    while (totalMonths > 0 && addMonths(birth, totalMonths).getTime() > now.getTime()) {
      totalMonths -= 1;
    }
    // وإن كانت هناك ذكرى شهرية أخرى قد مرّت، نتقدّم
    while (addMonths(birth, totalMonths + 1).getTime() <= now.getTime()) {
      totalMonths += 1;
    }

    // الأيام المتبقية بعد آخر ذكرى شهرية
    var anchor = addMonths(birth, totalMonths);
    var days = Math.floor((now.getTime() - anchor.getTime()) / MS_DAY);

    var diffMs = now.getTime() - birth.getTime();

    return {
      years: Math.floor(totalMonths / 12),
      months: totalMonths % 12,
      days: days,
      totalMonths: totalMonths,
      totalDays: Math.floor(diffMs / MS_DAY),
      totalWeeks: Math.floor(diffMs / MS_DAY / 7),
      totalHours: Math.floor(diffMs / MS_HOUR),
      totalMinutes: Math.floor(diffMs / MS_MINUTE)
    };
  }

  /* ============================================================
     3) البرج الفلكي
     ============================================================ */

  /** يعيد كائن البرج الموافق لتاريخ الميلاد */
  function getZodiac(date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();

    for (var i = 0; i < ZODIACS.length; i++) {
      var z = ZODIACS[i];
      var fromM = z.from[0], fromD = z.from[1];
      var toM = z.to[0], toD = z.to[1];

      // البرج الذي يعبر نهاية السنة (الجدي)
      if (fromM > toM) {
        if (
          (month === fromM && day >= fromD) ||
          (month === toM && day <= toD)
        ) {
          return z;
        }
      } else if (
        (month === fromM && day >= fromD) ||
        (month === toM && day <= toD)
      ) {
        return z;
      }
    }
    return ZODIACS[0];
  }

  /** نص المدى الزمني للبرج، مثال: 23 يوليو — 22 أغسطس */
  function zodiacRangeText(z) {
    return (
      fmt(z.from[1]) + " " + AR_MONTHS[z.from[0] - 1] +
      " — " +
      fmt(z.to[1]) + " " + AR_MONTHS[z.to[0] - 1]
    );
  }

  /* ============================================================
     4) عيد الميلاد القادم
     ============================================================ */

  function getNextBirthday(birth, now) {
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var month = birth.getMonth();
    var day = birth.getDate();

    /** يبني تاريخ عيد الميلاد لسنة معيّنة (يعالج 29 فبراير) */
    function buildFor(year) {
      if (month === 1 && day === 29 && !isLeapYear(year)) {
        return new Date(year, 2, 1); // 1 مارس في السنوات غير الكبيسة
      }
      return new Date(year, month, day);
    }

    var next = buildFor(today.getFullYear());
    if (next.getTime() < today.getTime()) {
      next = buildFor(today.getFullYear() + 1);
    }

    var remaining = Math.round((next.getTime() - today.getTime()) / MS_DAY);

    return { date: next, remaining: remaining, isToday: remaining === 0 };
  }

  /* ============================================================
     5) عرض النتائج
     ============================================================ */

  /** يبني نص العمر الدقيق: "٢٨ سنة و٥ شهور و١٠ أيام" */
  function ageToPhrase(age) {
    var parts = [];
    var y = pluralize(age.years, "سنة واحدة", "سنتان", "سنوات", "سنة");
    var m = pluralize(age.months, "شهر واحد", "شهران", "شهور", "شهرًا");
    var d = pluralize(age.days, "يوم واحد", "يومان", "أيام", "يومًا");
    if (y) parts.push(y);
    if (m) parts.push(m);
    if (d) parts.push(d);
    return parts.length ? parts.join(" و") : "أقل من يوم";
  }

  function render(birth, name) {
    var now = new Date();
    var age = calculateAge(birth, now);
    var zodiac = getZodiac(birth);
    var bday = getNextBirthday(birth, now);

    // الاسم
    out.name.textContent = name || "صديقنا";

    // العمر الدقيق كنص
    out.exactAge.textContent = ageToPhrase(age);

    // الإحصاءات
    out.years.textContent = fmt(age.years);
    out.months.textContent = fmt(age.totalMonths);
    out.weeks.textContent = fmt(age.totalWeeks);
    out.days.textContent = fmt(age.totalDays);
    out.hours.textContent = fmt(age.totalHours);
    out.minutes.textContent = fmt(age.totalMinutes);

    // البرج
    out.zodiacName.textContent = zodiac.name;
    out.zodiacGlyph.textContent = zodiac.glyph;
    out.zodiacRange.textContent = zodiacRangeText(zodiac);
    out.zodiacTraits.textContent = zodiac.traits;

    // عيد الميلاد القادم
    out.bdayDays.textContent = fmt(bday.remaining);
    // صياغة وحدة العدّاد حسب العدد المتبقي
    if (out.bdayUnit) {
      if (bday.isToday) out.bdayUnit.textContent = "يوم — إنه اليوم!";
      else if (bday.remaining === 1) out.bdayUnit.textContent = "يوم متبقٍ";
      else if (bday.remaining === 2) out.bdayUnit.textContent = "يومان متبقيان";
      else if (bday.remaining <= 10) out.bdayUnit.textContent = "أيام متبقية";
      else out.bdayUnit.textContent = "يومًا متبقيًا";
    }
    out.bdayDate.textContent = formatArabicDate(bday.date);
    out.bdayDay.textContent = bday.isToday
      ? "عيد ميلادك اليوم، كل عام وأنت بخير!"
      : "يوم " + AR_WEEKDAYS[bday.date.getDay()];

    return age;
  }

  /** تحديث القيم المتغيرة لحظيًا (الساعات والدقائق والأيام) */
  function startTicker() {
    stopTicker();
    ticker = setInterval(function () {
      if (!currentBirth) return;
      var age = calculateAge(currentBirth, new Date());
      out.hours.textContent = fmt(age.totalHours);
      out.minutes.textContent = fmt(age.totalMinutes);
      out.days.textContent = fmt(age.totalDays);
    }, 1000);
  }

  function stopTicker() {
    if (ticker) {
      clearInterval(ticker);
      ticker = null;
    }
  }

  /* ============================================================
     6) التعامل مع الأخطاء
     ============================================================ */

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.hidden = false;
    results.hidden = true;
    stopTicker();
  }

  function clearError() {
    errorMsg.hidden = true;
    errorMsg.textContent = "";
  }

  /* ============================================================
     7) إعادة تشغيل التأثير الحركي عند كل حساب
     ============================================================ */

  function replayAnimation() {
    results.hidden = true;
    // إعادة تدفق الصفحة لإجبار المتصفح على إعادة تشغيل الأنيميشن
    void results.offsetHeight;
    results.hidden = false;
  }

  /* ============================================================
     8) الأحداث
     ============================================================ */

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    shareNote.textContent = "";

    var value = dateInput.value;
    if (!value) {
      showError("الرجاء إدخال تاريخ ميلادك أولًا.");
      dateInput.focus();
      return;
    }

    var birth = parseInputDate(value);
    if (!birth) {
      showError("التاريخ المُدخل غير صحيح، تأكد من اليوم والشهر والسنة.");
      dateInput.focus();
      return;
    }

    var now = new Date();
    if (birth.getTime() > now.getTime()) {
      showError("لا يمكن اختيار تاريخ ميلاد في المستقبل، اختر تاريخًا سابقًا.");
      dateInput.focus();
      return;
    }

    if (birth.getFullYear() < 1900) {
      showError("الرجاء إدخال سنة ميلاد واقعية (بعد عام 1900).");
      dateInput.focus();
      return;
    }

    clearError();

    currentBirth = birth;
    currentName = nameInput.value.trim();

    render(currentBirth, currentName);
    replayAnimation();
    startTicker();

    // حفظ آخر تاريخ ميلاد (واسم المستخدم) في التخزين المحلي
    try {
      localStorage.setItem(STORAGE_DATE, value);
      localStorage.setItem(STORAGE_NAME, currentName);
    } catch (e) {
      /* التخزين المحلي غير متاح — نتجاهل بهدوء */
    }

    results.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /** إعادة الحساب: تفريغ الحقول والنتائج */
  function resetAll() {
    form.reset();
    clearError();
    results.hidden = true;
    shareNote.textContent = "";
    currentBirth = null;
    stopTicker();
    nameInput.focus();
  }

  resetBtn.addEventListener("click", resetAll);

  againBtn.addEventListener("click", function () {
    resetAll();
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* ---------------- مشاركة النتيجة ---------------- */
  shareBtn.addEventListener("click", function () {
    if (!currentBirth) return;

    var age = calculateAge(currentBirth, new Date());
    var zodiac = getZodiac(currentBirth);
    var bday = getNextBirthday(currentBirth, new Date());

    var text =
      (currentName ? currentName + " — " : "") +
      "عمري " + ageToPhrase(age) +
      " (" + fmt(age.totalDays) + " يومًا • " + fmt(age.totalHours) + " ساعة)." +
      " برجي " + zodiac.name + " " + zodiac.glyph + "." +
      (bday.isToday
        ? " عيد ميلادي اليوم!"
        : " باقي " + fmt(bday.remaining) + " يومًا لعيد ميلادي.") +
      " احسب عمرك أيضًا من مرصد العمر.";

    if (navigator.share) {
      navigator
        .share({ title: "نتيجة حساب العمر والبرج", text: text })
        .then(function () {
          shareNote.textContent = "تمت المشاركة.";
        })
        .catch(function () {
          /* المستخدم ألغى المشاركة */
        });
      return;
    }

    // بديل: نسخ النص إلى الحافظة
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(function () {
          shareNote.textContent = "تم نسخ النتيجة إلى الحافظة.";
        })
        .catch(function () {
          shareNote.textContent = "لم نتمكن من النسخ، انسخ النتيجة يدويًا.";
        });
    } else {
      shareNote.textContent = "المشاركة غير مدعومة في هذا المتصفح.";
    }
  });

  /* ---------------- تبديل الوضع الفاتح/الداكن ---------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    // الأيقونتان (شمس/قمر) تتبادلان الظهور عبر CSS حسب data-theme
    themeToggle.querySelector(".theme-btn__label").textContent = isDark
      ? "الوضع الفاتح"
      : "الوضع الداكن";

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#0b1020" : "#eef1f8");

    try {
      localStorage.setItem(STORAGE_THEME, theme);
    } catch (e) {}
  }

  themeToggle.addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  /* ============================================================
     9) التهيئة عند تحميل الصفحة
     ============================================================ */

  function init() {
    // منع اختيار تاريخ في المستقبل على مستوى الحقل نفسه
    var today = new Date();
    var iso =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");
    dateInput.max = iso;
    dateInput.min = "1900-01-01";

    // استعادة الوضع المحفوظ أو تفضيل النظام
    var savedTheme = null;
    try {
      savedTheme = localStorage.getItem(STORAGE_THEME);
    } catch (e) {}

    if (!savedTheme) {
      var prefersLight =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      savedTheme = prefersLight ? "light" : "dark";
    }
    applyTheme(savedTheme);

    // استعادة آخر تاريخ ميلاد واسم محفوظين
    try {
      var savedDate = localStorage.getItem(STORAGE_DATE);
      var savedName = localStorage.getItem(STORAGE_NAME);
      if (savedName) nameInput.value = savedName;
      if (savedDate && parseInputDate(savedDate)) {
        dateInput.value = savedDate;
        currentBirth = parseInputDate(savedDate);
        currentName = savedName || "";
        render(currentBirth, currentName);
        results.hidden = false;
        startTicker();
      }
    } catch (e) {}
  }

  init();
})();
