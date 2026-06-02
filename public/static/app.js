// ============================================================
// صناعة الخطباء — سكربت التفاعلات + نظام التدرّج في الدراسة
// ============================================================
(function () {
  'use strict';

  // ---------- أدوات مساعدة للأرقام العربية ----------
  function toArabicDigits(str) {
    var map = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(str).replace(/[0-9]/g, function (d) { return map[+d]; });
  }

  // ---------- التخزين ----------
  var KEY = 'sk_progress_v1';      // الدروس المكتملة { lessonId: true }
  var START_KEY = 'sk_started_v1'; // أوقات بدء الدروس { lessonId: timestamp }
  function getJSON(k) {
    try { return JSON.parse(localStorage.getItem(k) || '{}'); }
    catch (e) { return {}; }
  }
  function setJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function getProgress() { return getJSON(KEY); }
  function saveProgress(p) { setJSON(KEY, p); }
  function getStarts() { return getJSON(START_KEY); }
  function saveStarts(s) { setJSON(START_KEY, s); }

  // ---------- ترتيب الدروس ونظام الفتح ----------
  var lessonOrder = [];
  try { lessonOrder = JSON.parse(document.body.dataset.lessonOrder || '[]'); }
  catch (e) { lessonOrder = []; }

  // هل الدرس مفتوح للدراسة؟ (الأول دائمًا، أو السابق مكتمل)
  function isLessonUnlocked(id) {
    var p = getProgress();
    var i = lessonOrder.indexOf(id);
    if (i <= 0) return true;            // أول درس أو غير معروف
    var prevId = lessonOrder[i - 1];
    return !!p[prevId];                 // يُفتح فقط إذا أُكمل السابق
  }

  var MIN_MINUTES = 5;
  var MIN_MS = MIN_MINUTES * 60 * 1000;

  // ---------- قائمة الجوال ----------
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // ---------- شريط تقدّم القراءة ----------
  var bar = document.getElementById('readProgress');
  if (bar) {
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
      bar.style.width = Math.min(100, Math.max(0, scrolled * 100)) + '%';
    }, { passive: true });
  }

  // ---------- تأثير الظهور عند التمرير ----------
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ============================================================
  //  منطق صفحة الدرس (نظام التدرّج)
  // ============================================================
  var currentLessonId = document.body.dataset.lessonId;
  var gate = document.getElementById('lessonGate');
  var startBtn = document.getElementById('startLessonBtn');
  var nextBtn = document.getElementById('nextLessonBtn');

  // حالة الاختبار: هل كل الأسئلة أُجيب عنها صحيحًا؟
  function quizAllCorrect() {
    var qs = document.querySelectorAll('.quiz-q');
    if (qs.length === 0) return true; // درس بلا أسئلة
    var ok = true;
    qs.forEach(function (q) {
      if (q.dataset.answered !== '1') { ok = false; return; }
      if (q.querySelector('.quiz-opt.wrong')) { ok = false; }
    });
    return ok;
  }

  // هل بدأ الدرس؟ وكم بقي من الوقت؟
  function getStartTime() {
    var s = getStarts();
    return s[currentLessonId] || 0;
  }
  function timeConditionMet() {
    var t = getStartTime();
    if (!t) return false;
    return (Date.now() - t) >= MIN_MS;
  }

  // ---------- إدارة لوحة البوّابة (Gate) ----------
  var countdownTimer = null;

  function startLesson() {
    var s = getStarts();
    if (!s[currentLessonId]) {
      s[currentLessonId] = Date.now();
      saveStarts(s);
    }
    refreshGate();
  }

  function formatRemaining() {
    var t = getStartTime();
    var remaining = Math.max(0, MIN_MS - (Date.now() - t));
    var totalSec = Math.ceil(remaining / 1000);
    var mm = Math.floor(totalSec / 60);
    var ss = totalSec % 60;
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return toArabicDigits(pad(mm) + ':' + pad(ss));
  }

  function refreshGate() {
    if (!gate) return;
    var started = !!getStartTime();
    var timeMet = timeConditionMet();
    var quizMet = quizAllCorrect();

    var gateIcon = document.getElementById('gateIcon');
    var gateTitle = document.getElementById('gateTitle');
    var gateSub = document.getElementById('gateSub');
    var gateTimer = document.getElementById('gateTimer');
    var condTime = document.getElementById('condTime');
    var condQuiz = document.getElementById('condQuiz');

    // حالة الأزرار
    if (started && startBtn) {
      startBtn.style.display = 'none';
    }

    // مؤقّت العدّ التنازلي
    if (started && !timeMet) {
      if (gateTimer) gateTimer.style.display = 'inline-flex';
      var cd = document.getElementById('gateCountdown');
      if (cd) cd.textContent = formatRemaining();
      if (!countdownTimer) {
        countdownTimer = setInterval(function () {
          var cdEl = document.getElementById('gateCountdown');
          if (cdEl) cdEl.textContent = formatRemaining();
          if (timeConditionMet()) {
            clearInterval(countdownTimer);
            countdownTimer = null;
            refreshGate();
            showToast('انقضت مدّة الانتظار ✓');
          }
        }, 1000);
      }
    } else if (gateTimer) {
      gateTimer.style.display = 'none';
    }

    // تحديث مؤشّرات الشروط
    setCond(condTime, timeMet);
    setCond(condQuiz, quizMet);

    // تحديث العنوان والأيقونة العامة
    if (started && gateIcon && gateTitle && gateSub) {
      if (timeMet && quizMet) {
        gateIcon.className = 'fa-solid fa-lock-open gate-icon open';
        gate.classList.add('gate-unlocked');
        gateTitle.textContent = 'أحسنت! اكتمل الدرس — يمكنك الانتقال للدرس التالي';
        gateSub.textContent = 'استوفيتَ شرطَي المدّة والاختبار بنجاح.';
      } else {
        gateIcon.className = 'fa-solid fa-hourglass-half gate-icon';
        gate.classList.remove('gate-unlocked');
        gateTitle.textContent = 'الدرس قيد الدراسة';
        gateSub.textContent = 'أكمل قراءة الدرس وأجب عن الأسئلة، وانتظر انتهاء المدّة لفتح الانتقال.';
      }
    }

    // فتح / قفل زر التالي + تسجيل الإكمال
    if (timeMet && quizMet) {
      unlockNext();
      markLessonComplete();
    } else {
      lockNext();
    }
  }

  function setCond(el, met) {
    if (!el) return;
    var icon = el.querySelector('i');
    if (met) {
      el.classList.add('met');
      if (icon) icon.className = 'fa-solid fa-circle-check';
    } else {
      el.classList.remove('met');
      if (icon) icon.className = 'fa-regular fa-circle';
    }
  }

  function lockNext() {
    if (!nextBtn) return;
    nextBtn.disabled = true;
    nextBtn.classList.add('is-locked');
    var label = nextBtn.querySelector('.next-label');
    var icon = nextBtn.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-lock';
    if (label) {
      label.textContent = nextBtn.dataset.finish === '1'
        ? 'إنهاء الدورة مقفل'
        : 'الدرس التالي مقفل';
    }
  }

  function unlockNext() {
    if (!nextBtn) return;
    if (!nextBtn.classList.contains('is-locked')) return; // مفتوح مسبقًا
    nextBtn.disabled = false;
    nextBtn.classList.remove('is-locked');
    nextBtn.classList.add('is-unlocked');
    var label = nextBtn.querySelector('.next-label');
    var icon = nextBtn.querySelector('i');
    if (nextBtn.dataset.finish === '1') {
      if (icon) icon.className = 'fa-solid fa-flag-checkered';
      if (label) label.textContent = 'أنهيت الدورة!';
    } else {
      if (icon) icon.className = 'fa-solid fa-arrow-left';
      if (label) label.textContent = 'الدرس التالي';
    }
  }

  if (startBtn) {
    startBtn.addEventListener('click', startLesson);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (nextBtn.disabled || nextBtn.classList.contains('is-locked')) {
        showToast('أكمل شروط الدرس أولًا ⏳');
        return;
      }
      var href = nextBtn.dataset.nextHref;
      if (href) window.location.href = href;
    });
  }

  // ---------- الاختبارات (Quiz) ----------
  document.querySelectorAll('.quiz-opt').forEach(function (opt) {
    opt.addEventListener('click', function () {
      var q = opt.closest('.quiz-q');
      if (!q || q.dataset.answered === '1' || q.dataset.checking === '1') return;

      // لا يُسمح بالإجابة قبل بدء الدرس
      if (gate && !getStartTime()) {
        showToast('اضغط «بدء الدرس» أولًا ▶');
        return;
      }

      var correctIdx = parseInt(q.dataset.answer, 10);
      var chosenIdx = parseInt(opt.dataset.idx, 10);
      var options = q.querySelectorAll('.quiz-opt');
      var explain = q.querySelector('.quiz-explain');
      var isCorrect = (chosenIdx === correctIdx);

      if (isCorrect) {
        // إجابة صحيحة: تُقفل نهائيًا
        q.dataset.answered = '1';
        options.forEach(function (o, i) {
          o.classList.add('disabled');
          if (i === correctIdx) o.classList.add('correct');
        });
        if (explain) explain.classList.add('show');
        updateQuizScore();
        refreshGate();
      } else {
        // إجابة خاطئة: تُعرض مؤقتًا ثم يُعاد فتح السؤال لإعادة المحاولة
        q.dataset.checking = '1';
        opt.classList.add('wrong');
        if (explain) explain.classList.add('show');
        showToast('إجابة غير صحيحة — حاول مرّة أخرى ✋');
        updateQuizScore();
        setTimeout(function () {
          opt.classList.remove('wrong');
          if (explain) explain.classList.remove('show');
          q.dataset.checking = '0';
          updateQuizScore();
          refreshGate();
        }, 2200);
      }
    });
  });

  function updateQuizScore() {
    var scoreEl = document.getElementById('quizScore');
    if (!scoreEl) return;
    var total = document.querySelectorAll('.quiz-q').length;
    var answered = document.querySelectorAll('.quiz-q[data-answered="1"]').length;
    var correct = 0;
    document.querySelectorAll('.quiz-q[data-answered="1"]').forEach(function (q) {
      if (!q.querySelector('.quiz-opt.wrong')) correct++;
    });
    scoreEl.textContent =
      'أجبتَ على ' + toArabicDigits(answered) + ' من ' + toArabicDigits(total) +
      ' — الصحيح: ' + toArabicDigits(correct);
  }

  // ---------- تسجيل إتمام الدرس ----------
  function markLessonComplete() {
    if (!currentLessonId) return;
    var p = getProgress();
    if (!p[currentLessonId]) {
      p[currentLessonId] = true;
      saveProgress(p);
      showToast('أحسنت! تم إتمام هذا الدرس ✓');
    }
    paintCompletion();
  }

  // ---------- رسم حالة الإتمام/القفل في القوائم ----------
  function paintCompletion() {
    var p = getProgress();
    document.querySelectorAll('[data-lesson-link]').forEach(function (el) {
      var id = el.dataset.lessonLink;
      var badge = el.querySelector('.done-badge');
      var unlocked = isLessonUnlocked(id);

      // حالة الإتمام
      if (p[id]) {
        el.classList.add('completed');
        if (badge) badge.style.display = 'inline';
      }

      // حالة القفل (الدرس غير متاح بعد)
      if (!unlocked && !p[id]) {
        el.classList.add('locked-lesson');
        el.setAttribute('aria-disabled', 'true');
        // منع الانتقال بالنقر
        if (!el.dataset.lockBound) {
          el.dataset.lockBound = '1';
          el.addEventListener('click', function (e) {
            if (el.classList.contains('locked-lesson')) {
              e.preventDefault();
              showToast('أكمل الدرس السابق أولًا 🔒');
            }
          });
        }
        // إضافة أيقونة قفل إن لم توجد
        if (!el.querySelector('.lock-badge')) {
          var lock = document.createElement('span');
          lock.className = 'lock-badge';
          lock.innerHTML = '<i class="fa-solid fa-lock"></i>';
          el.appendChild(lock);
        }
      } else {
        el.classList.remove('locked-lesson');
        el.removeAttribute('aria-disabled');
      }
    });

    // عداد التقدّم العام
    var counter = document.getElementById('progressCounter');
    var fill = document.getElementById('progressFill');
    if (counter) {
      var totalLessons = parseInt(counter.dataset.total || '0', 10);
      var done = Object.keys(p).filter(function (k) { return p[k]; }).length;
      counter.textContent = toArabicDigits(done) + ' / ' + toArabicDigits(totalLessons);
      if (fill && totalLessons > 0) {
        fill.style.width = Math.round((done / totalLessons) * 100) + '%';
      }
    }
  }

  // ---------- منع الوصول المباشر للدروس المقفلة ----------
  function enforceLessonAccess() {
    if (!currentLessonId || lessonOrder.length === 0) return;
    if (isLessonUnlocked(currentLessonId)) return;
    // إعادة التوجيه إلى أول درس غير مكتمل ومتاح
    var p = getProgress();
    var target = lessonOrder[0];
    for (var i = 0; i < lessonOrder.length; i++) {
      if (isLessonUnlocked(lessonOrder[i]) && !p[lessonOrder[i]]) {
        target = lessonOrder[i];
        break;
      }
      // إن كان مكتملًا تابع، خذ آخر مفتوح
      if (isLessonUnlocked(lessonOrder[i])) target = lessonOrder[i];
    }
    showToast('هذا الدرس مقفل — سيُعاد توجيهك للدرس المتاح 🔒');
    setTimeout(function () {
      window.location.replace('/lesson/' + target);
    }, 1400);
  }

  // ---------- التهيئة ----------
  paintCompletion();
  enforceLessonAccess();
  if (gate) {
    refreshGate(); // يضبط الحالة عند تحميل صفحة الدرس
  }

  // ---------- Toast ----------
  function showToast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
      'background:#0f569b;color:#fff;padding:14px 26px;border-radius:12px;font-weight:700;' +
      'box-shadow:0 12px 30px rgba(10,58,107,.35);z-index:200;font-family:inherit;max-width:90%;text-align:center;';
    document.body.appendChild(t);
    setTimeout(function () {
      t.style.transition = 'opacity .4s'; t.style.opacity = '0';
      setTimeout(function () { t.remove(); }, 400);
    }, 2600);
  }

  // ---------- روابط التمرير الناعم داخل الصفحة ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();
