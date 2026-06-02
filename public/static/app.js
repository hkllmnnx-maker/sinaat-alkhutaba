// ============================================================
// صناعة الخطباء — سكربت التفاعلات
// ============================================================
(function () {
  'use strict';

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

  // ---------- الاختبارات (Quiz) ----------
  document.querySelectorAll('.quiz-opt').forEach(function (opt) {
    opt.addEventListener('click', function () {
      var q = opt.closest('.quiz-q');
      if (!q || q.dataset.answered === '1') return;
      q.dataset.answered = '1';

      var correctIdx = parseInt(q.dataset.answer, 10);
      var chosenIdx = parseInt(opt.dataset.idx, 10);
      var options = q.querySelectorAll('.quiz-opt');
      options.forEach(function (o, i) {
        o.classList.add('disabled');
        if (i === correctIdx) o.classList.add('correct');
        if (i === chosenIdx && chosenIdx !== correctIdx) o.classList.add('wrong');
      });
      var explain = q.querySelector('.quiz-explain');
      if (explain) explain.classList.add('show');

      // تحديث النتيجة
      updateQuizScore();
    });
  });

  function updateQuizScore() {
    var scoreEl = document.getElementById('quizScore');
    if (!scoreEl) return;
    var total = document.querySelectorAll('.quiz-q').length;
    var answered = document.querySelectorAll('.quiz-q[data-answered="1"]').length;
    var correct = 0;
    document.querySelectorAll('.quiz-q[data-answered="1"]').forEach(function (q) {
      // الإجابة صحيحة إذا لم يوجد خيار مُعلّم كخطأ
      var chosenWrong = q.querySelector('.quiz-opt.wrong');
      if (!chosenWrong) correct++;
    });
    scoreEl.textContent = 'أجبتَ على ' + answered + ' من ' + total + ' — الصحيح: ' + correct;
    if (answered === total) {
      markLessonComplete();
    }
  }

  // ---------- تتبّع إتمام الدروس (localStorage) ----------
  var KEY = 'sk_progress_v1';
  function getProgress() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
  }

  function markLessonComplete() {
    var lessonId = document.body.dataset.lessonId;
    if (!lessonId) return;
    var p = getProgress();
    if (!p[lessonId]) {
      p[lessonId] = true;
      saveProgress(p);
      showToast('أحسنت! تم إتمام هذا الدرس ✓');
    }
    paintCompletion();
  }

  // زر "أنهيت الدرس"
  var doneBtn = document.getElementById('markDoneBtn');
  if (doneBtn) {
    doneBtn.addEventListener('click', function () {
      markLessonComplete();
      doneBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> تم إتمام الدرس';
    });
  }

  // رسم حالة الإتمام في الشريط الجانبي وصفحة الدورة
  function paintCompletion() {
    var p = getProgress();
    document.querySelectorAll('[data-lesson-link]').forEach(function (el) {
      var id = el.dataset.lessonLink;
      var badge = el.querySelector('.done-badge');
      if (p[id]) {
        el.classList.add('completed');
        if (badge) badge.style.display = 'inline';
      }
    });
    // عداد التقدّم العام
    var counter = document.getElementById('progressCounter');
    var fill = document.getElementById('progressFill');
    if (counter) {
      var totalLessons = parseInt(counter.dataset.total || '0', 10);
      var done = Object.keys(p).filter(function (k) { return p[k]; }).length;
      counter.textContent = done + ' / ' + totalLessons;
      if (fill && totalLessons > 0) {
        fill.style.width = Math.round((done / totalLessons) * 100) + '%';
      }
    }
  }
  paintCompletion();

  // وضع علامة على الدرس الحالي عند تجاوز نسبة القراءة 90%
  if (document.body.dataset.lessonId) {
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
      if (scrolled > 0.92) markLessonComplete();
    }, { passive: true });
  }

  // ---------- Toast ----------
  function showToast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
      'background:#0f569b;color:#fff;padding:14px 26px;border-radius:12px;font-weight:700;' +
      'box-shadow:0 12px 30px rgba(10,58,107,.35);z-index:200;font-family:inherit;';
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
