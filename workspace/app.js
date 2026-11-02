/* ГлобалМеталлХолд — классический сайт-визитка: рендер, i18n RU/EN, анимации, форма */
(function () {
  "use strict";

  var D = window.I18N;
  var PHONE_TEL = "+375290000000"; // TODO: реальный телефон для tel:-ссылки
  var EMAIL = "sales@gmhold.com"; // TODO: реальная почта
  var ALLOWED_EXT = ["pdf", "dwg", "dxf", "zip", "rar"];
  var MAX_SIZE = 20 * 1024 * 1024; // 20 МБ

  /* ---------- SVG-иконки (плейсхолдеры под фирменные) ---------- */
  function svg(paths, vb) {
    return '<svg width="26" height="26" viewBox="' + (vb || "0 0 24 24") + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  }
  var ICONS = {
    logo: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 8v8M8 10v4M16 10v4"/></svg>',
    lathe: svg('<circle cx="7" cy="12" r="3.2"/><path d="M10.2 12H21M17 8.5V15.5M21 10.5v3"/>'),
    mill: svg('<path d="M12 3v6M9 9h6l-1 5h-4L9 9z"/><path d="M12 14v4M8 21h8"/>'),
    laser: svg('<path d="M12 2v7M8.5 9.5A3.5 3.5 0 1 0 15.5 9.5"/><path d="M4 18h16M7 21l2-3M17 21l-2-3"/>'),
    weld: svg('<path d="M4 20l7-9M14 3l6 4-3 6"/><circle cx="10.5" cy="14" r="1.6"/>'),
    structure: svg('<path d="M3 20h18M5 20V8l7-4 7 4v12M9 20v-6h6v6"/>'),
    paint: svg('<path d="M6 3h9v6H6zM15 6h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-6"/><path d="M12 16v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-2"/>'),
    target: svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3"/>'),
    clock: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>'),
    medal: svg('<circle cx="12" cy="9" r="5.5"/><path d="M9 14l-2 7 5-3 5 3-2-7"/>'),
    docs: svg('<path d="M7 3h7l4 4v14H7V3z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>'),
    draft: svg('<path d="M3 21V3h18v18H3z"/><path d="M7 15l4-4 3 3 4-6M7 11h.01"/>'),
    truck: svg('<path d="M2 6h11v10H2zM13 9h4l4 4v3h-2"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="16.5" cy="18" r="1.8"/>'),
    pin: svg('<path d="M12 21s-6.5-5.5-6.5-10A6.5 6.5 0 0 1 18.5 11c0 4.5-6.5 10-6.5 10z"/><circle cx="12" cy="10.5" r="2.3"/>'),
    phone: svg('<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    hours: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>'),
    /* Дополнительные иконки (выбираются в редакторе сайта) */
    map: svg('<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>'),
    factory: svg('<path d="M3 21h18M4 21V11l5 3V11l5 3V11l5 3v7"/><path d="M7 7V4h2v3M4 11V7h1v4"/>'),
    building: svg('<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>'),
    globe: svg('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.3 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.3-3.8-8.5S9.5 5.9 12 3.5z"/>'),
    mobile: svg('<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M10.5 18.5h3"/>'),
    whatsapp: svg('<path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/><path d="M8.8 9.6c.3 2 1.6 3.3 3.6 3.6.7.1 1.3-.2 1.6-.8l-1.4-.9-.8.6c-.9-.4-1.5-1-1.9-1.9l.6-.8-.9-1.4c-.6.3-.9.9-.8 1.6z"/>'),
    envelope: svg('<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 7l9.5 6 9.5-6M9 12l3 2 3-2"/>'),
    chat: svg('<path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9h8M8 12h5"/>'),
    calendar: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h2M14 14h2"/>'),
    star: svg('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"/>')
  };
  window.GMH_ICONS = ICONS; /* доступно редактору сайта (editor.html) */

  /* ---------- Утилиты ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------- Переопределённый контент (правится через «Редактор сайта» — editor.html) ---------- */
  var OVERRIDE_KEY = "gmh-content-override-v1"; // копия контента в localStorage
  var EXPORTED_KEY = "gmh-content-exported-v1"; // контент, загруженный из site-data.json
  function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }
  function readJSON(key) {
    try { var s = localStorage.getItem(key); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  }
  function getBase() {
    var exp = readJSON(EXPORTED_KEY);
    if (exp && exp.ru && exp.en) return exp;
    return { ru: window.I18N.ru, en: window.I18N.en };
  }
  var renderedOnce = false; // контент уже отрендерен фолбэком (DOMContentLoaded) — ждём перезапуска после site-data.json
  function getTranslated(lang) {
    var ov = readJSON(OVERRIDE_KEY);
    if (ov && ov[lang]) return ov[lang];
    return getBase()[lang];
  }

  /* ---------- Рендер секций ---------- */
  function render(t) {
    if (!document.getElementById("hero")) return; // не страница сайта (например, editor.html)
    document.getElementById("hero").innerHTML =
      '<div class="container hero-inner">' +
        '<span class="badge">' + esc(t.hero.badge) + "</span>" +
        "<h1>" + esc(t.hero.title.split("—")[0]) + "<em>—" + esc(t.hero.title.split("—")[1] || "") + "</em></h1>" +
        '<p class="sub">' + esc(t.hero.subtitle) + "</p>" +
        '<div class="hero-cta">' +
          '<a class="btn btn-gold" href="#lead-form">' + esc(t.hero.ctaPrimary) + "</a>" +
          '<a class="btn btn-ghost" href="#services">' + esc(t.hero.ctaSecondary) + "</a>" +
        "</div>" +
        '<p class="hero-note">' + esc(t.hero.note) + "</p>" +
      "</div>";

    document.getElementById("about").innerHTML =
      '<div class="container">' +
        '<div class="section-head reveal"><p class="kicker">GlobalMetalHold</p><h2>' + esc(t.stats.heading) + "</h2>" +
        "<p>" + esc(t.stats.lead) + "</p></div>" +
        '<div class="stats-grid">' + t.stats.items.map(function (s, i) {
          return '<div class="stat reveal" style="transition-delay:' + i * 90 + 'ms"><b>' + esc(s[0]) + "</b><span>" + esc(s[1]) + "</span></div>";
        }).join("") + "</div></div>";

    document.getElementById("services").innerHTML =
      '<div class="container"><div class="section-head reveal"><p class="kicker">' + esc(t.nav.services) + "</p><h2>" + esc(t.services.heading) +
      "</h2><p>" + esc(t.services.subheading) + "</p></div>" +
      '<div class="cards">' + t.services.items.map(function (s, i) {
        return '<article class="card reveal" style="transition-delay:' + (i % 3) * 100 + 'ms">' +
          '<div class="card-icon">' + ICONS[s.icon] + "</div><h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></article>";
      }).join("") + "</div></div>";

    document.getElementById("equipment").innerHTML =
      '<div class="container"><div class="section-head reveal"><p class="kicker">' + esc(t.nav.equipment) + "</p><h2>" + esc(t.equipment.heading) +
      "</h2><p>" + esc(t.equipment.subheading) + "</p>" +
      '<div class="equip-grid">' + t.equipment.groups.map(function (g, i) {
        return '<div class="equip-group reveal" style="transition-delay:' + (i % 2) * 100 + 'ms"><h3>' + esc(g.name) + "</h3><ul>" +
          g.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
      }).join("") + "</div></div></div>";

    document.getElementById("advantages").innerHTML =
      '<div class="container"><div class="section-head reveal"><p class="kicker">' + esc(t.nav.advantages) + "</p><h2>" + esc(t.advantages.heading) + "</h2></div>" +
      '<div class="cards">' + t.advantages.items.map(function (a, i) {
        return '<article class="card reveal" style="transition-delay:' + (i % 3) * 100 + 'ms">' +
          '<div class="card-icon">' + ICONS[a.icon] + "</div><h3>" + esc(a.title) + "</h3><p>" + esc(a.text) + "</p></article>";
      }).join("") + "</div></div>";

    document.getElementById("portfolio").innerHTML =
      '<div class="container"><div class="section-head reveal"><p class="kicker">' + esc(t.nav.portfolio) + "</p><h2>" + esc(t.portfolio.heading) +
      "</h2><p>" + esc(t.portfolio.subheading) + "</p></div>" +
      '<div class="gallery">' + t.portfolio.items.map(function (p, i) {
        var cap = typeof p === "string" ? p : (p.caption || "");
        var img = (typeof p === "object" && p.img)
          ? '<img src="' + p.img + '" alt="' + esc(cap) + '" loading="lazy">'
          : "";
        return '<figure class="shot reveal" style="transition-delay:' + (i % 4) * 80 + 'ms">' + img + "<figcaption>" + esc(cap) + "</figcaption></figure>";
      }).join("") + "</div></div>";

    document.getElementById("process").innerHTML =
      '<div class="container"><div class="section-head reveal"><p class="kicker">' + esc(t.nav.process) + "</p><h2>" + esc(t.process.heading) +
      "</h2><p>" + esc(t.process.subheading) + "</p></div>" +
      '<div class="steps">' + t.process.steps.map(function (s, i) {
        return '<div class="step reveal" style="transition-delay:' + i * 100 + 'ms"><div class="step-num">' + (i + 1) + "</div><h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></div>";
      }).join("") + "</div></div>";

    renderForm(t);
    renderContacts(t);
    renderFooterNav(t);
    observeReveals();
  }

  /* ---------- Форма заявки (без CRM: письмо на почту) ---------- */
  var chosenFile = null;
  // Секция #lead-form существует в разметке один раз — оборачиваем её контейнером при рендере.
  function sectionShell(inner) { return '<div class="container">' + inner + "</div>"; }

  function renderForm(t) {
    var f = t.form, mount = document.getElementById("lead-form");
    mount.innerHTML =
      '<div class="container"><div class="section-head reveal"><p class="kicker">' + esc(t.nav.contact) + "</p><h2>" + esc(f.heading) +
      "</h2><p>" + esc(f.subheading) + "</p></div>" +
      '<form class="lead-form reveal" id="the-form" novalidate>' +
        '<div class="row-2">' +
          field("f-name", f.name, true, "text", f.namePh) +
          field("f-phone", f.phone, true, "tel", f.phonePh) +
        "</div>" +
        '<div class="row-2">' +
          field("f-email", f.email, true, "email", f.emailPh) +
          field("f-company", f.company, false, "text", f.companyPh) +
        "</div>" +
        '<div class="field"><label for="f-comment">' + esc(f.comment) + '</label>' +
          '<textarea id="f-comment" name="comment"></textarea><small class="err-msg" id="e-comment"></small></div>' +
        '<div class="field"><label class="req" for="f-file">' + esc(f.drawing) + "</label>" +
          '<div class="dropzone" id="dz" tabindex="0" role="button">' + esc(f.dropzone) + "</div>" +
          '<input type="file" id="f-file" class="hidden" accept=".pdf,.dwg,.dxf,.zip,.rar">' +
          '<p class="hint">' + esc(f.drawingHint) + '</p><small class="err-msg" id="e-file"></small></div>' +
        '<button class="btn btn-gold" type="submit" id="submit-btn" style="width:100%">' + esc(f.submit) + "</button>" +
        '<p class="consent">' + esc(f.consent) + "</p>" +
      "</form>" +
      '<div class="lead-form form-success hidden" id="success-box" role="status" aria-live="polite">' +
        '<div class="ok-icon">✓</div><h3 id="ok-title"></h3><p id="ok-text"></p>' +
        '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">' +
        '<a class="btn btn-gold" id="ok-mail" href="#">' + esc(f.openMail) + "</a>" +
        '<button class="btn btn-ghost" id="ok-again" type="button">' + esc(f.another) + "</button></div>" +
        '<p class="hint" style="margin-top:16px">' + esc(f.noMail) + '<a href="mailto:' + EMAIL + '" style="color:var(--gold)">' + EMAIL + "</a></p>" +
      "</div></div>";

    var form = document.getElementById("the-form");
    ["name", "phone", "email", "company"].forEach(function (k) {
      var inp = document.getElementById("f-" + k), er = document.getElementById("e-" + k);
      if (inp && er) inp.setAttribute("aria-describedby", er.id);
    });
    var cInp = document.getElementById("f-comment"), cErr = document.getElementById("e-comment");
    if (cInp && cErr) cInp.setAttribute("aria-describedby", cErr.id);
    var fInp = document.getElementById("f-file"), fErr = document.getElementById("e-file");
    if (fInp && fErr) fInp.setAttribute("aria-describedby", fErr.id);
    var dz = document.getElementById("dz");
    var fileInput = document.getElementById("f-file");

    function setFile(file) {
      chosenFile = file || null;
      if (!file) {
        dz.classList.remove("has-file"); dz.textContent = t.form.dropzone; return;
      }
      var extOk = ALLOWED_EXT.indexOf(file.name.split(".").pop().toLowerCase()) !== -1;
      var sizeOk = file.size <= MAX_SIZE;
      if (!extOk || !sizeOk) {
        showErr("file", !extOk ? t.form.errors.fileType : t.form.errors.fileSize);
        chosenFile = null; fileInput.value = "";
        dz.classList.remove("has-file"); dz.textContent = t.form.dropzone; return;
      }
      clearErr("file");
      dz.classList.add("has-file");
      dz.innerHTML = '<span class="file-meta">📎 <b>' + esc(file.name) + "</b> (" +
        (file.size / 1048576).toFixed(2) + " MB)<button type=\"button\" class=\"file-remove\" id=\"rm\">" +
        esc(t.form.removeFile) + "</button></span>";
      document.getElementById("rm").addEventListener("click", function (e) {
        e.stopPropagation(); setFile(null); fileInput.value = "";
      });
    }
    dz.addEventListener("click", function () { fileInput.click(); });
    dz.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
    ["dragover", "dragenter"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove("drag"); }); });
    dz.addEventListener("drop", function (e) { if (e.dataTransfer.files.length) setFile(e.dataTransfer.files[0]); });
    fileInput.addEventListener("change", function () { setFile(fileInput.files[0]); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var name = val("f-name"), phone = val("f-phone"), email = val("f-email");
      if (name.trim().length < 2) { showErr("name", t.form.errors.nameShort); ok = false; } else clearErr("name");
      if (!/^[+()\-\s\d]{7,20}$/.test(phone.trim())) { showErr("phone", t.form.errors.phoneInvalid); ok = false; } else clearErr("phone");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { showErr("email", t.form.errors.emailInvalid); ok = false; } else clearErr("email");
      if (!chosenFile) { showErr("file", t.form.errors.fileRequired || t.form.drawingHint); ok = false; } else clearErr("file");
      if (!ok) {
        var bad = form.querySelector(".invalid, .err-msg:not(:empty)");
        if (bad && typeof bad.scrollIntoView === "function") bad.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      var btn = document.getElementById("submit-btn");
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> ' + esc(t.form.submitting);

      var body = "Имя / Name: " + name + "\nТелефон / Phone: " + phone + "\nEmail: " + email +
        "\nКомпания / Company: " + val("f-company") + "\n\n" + val("f-comment");
      var subject = "[Заявка с сайта] " + name + (val("f-company") ? " — " + val("f-company") : "");
      var mailto = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      setTimeout(function () {
        btn.disabled = false; btn.textContent = t.form.submit;
        form.classList.add("hidden");
        var box = document.getElementById("success-box");
        box.classList.remove("hidden");
        document.getElementById("ok-title").textContent = t.form.mailNoteTitle;
        document.getElementById("ok-text").textContent = t.form.mailNote.replace("{file}", chosenFile ? chosenFile.name : "");
        document.getElementById("ok-mail").href = mailto;
        document.getElementById("ok-again").onclick = function () {
          box.classList.add("hidden"); form.classList.remove("hidden"); form.reset(); setFile(null);
        };
        window.location.href = mailto;
        if (typeof box.scrollIntoView === "function") box.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    });
  }

  function field(id, label, req, type, ph) {
    var k = id.slice(2); // name/phone/email/company
    return '<div class="field"><label class="' + (req ? "req" : "") + '" for="' + id + '">' + esc(label) + "</label>" +
      '<input id="' + id + '" name="' + k + '" type="' + type + '" placeholder="' + esc(ph) + '"' + (req ? ' required aria-required="true"' : "") + ">" +
      '<small class="err-msg" id="e-' + k + '"></small></div>';
  }
  function val(id) { var n = document.getElementById(id); return n ? n.value : ""; }
  function errMap(k) {
    return { name: "e-name", phone: "e-phone", email: "e-email", file: "e-file", comment: "e-comment" }[k];
  }
  function showErr(k, msg) {
    var e = document.getElementById(errMap(k)); if (e) e.textContent = msg;
    var input = document.getElementById("f-" + k); if (input) input.classList.add("invalid");
  }
  function clearErr(k) {
    var e = document.getElementById(errMap(k)); if (e) e.textContent = "";
    var input = document.getElementById("f-" + k); if (input) input.classList.remove("invalid");
  }

  /* ---------- Контакты и футер ---------- */
  function renderContacts(t) {
    var c = t.contacts;
    var icons = c.icons || {};
    document.getElementById("contacts").innerHTML =
      '<div class="container"><div class="section-head reveal"><p class="kicker">' + esc(c.heading) + "</p><h2>" + esc(c.heading) + "</h2></div>" +
      '<div class="form-wrap"><div class="contact-list reveal">' +
        ci(icons.address || "pin", c.addressLabel, esc(c.address)) +
        ci(icons.phone || "phone", c.phoneLabel, '<a href="tel:' + PHONE_TEL + '">' + esc(t.nav.phone) + "</a>") +
        ci(icons.email || "mail", c.emailLabel, '<a href="mailto:' + EMAIL + '">' + EMAIL + "</a>") +
        ci(icons.hours || "hours", c.hoursLabel, esc(c.hours)) +
      "</div>" +
      '<div class="map-frame reveal"><iframe title="' + esc(c.mapLabel) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
      'src="https://www.openstreetmap.org/export/embed.html?bbox=27.80%2C54.18%2C28.02%2C54.30&layer=mapnik&marker=54.2419%2C27.8466"></iframe></div>' +
      "</div></div>";
    function ci(icon, label, valueHtml) {
      return '<div class="contact-item"><span class="ci-icon">' + ICONS[icon] + "</span><div><b>" + esc(label) + "</b>" + valueHtml + "</div></div>";
    }
  }

  function renderFooterNav(t) {
    var ids = ["about", "services", "equipment", "advantages", "portfolio", "process", "contacts"];
    document.getElementById("footer-nav").innerHTML = ids.map(function (id) {
      return '<li><a href="#' + id + '">' + esc(t.nav[id === "contacts" ? "contact" : id] || id) + "</a></li>";
    }).join("");
    document.getElementById("footer-about").textContent = t.footer.about;
    document.getElementById("footer-requisites").textContent = t.footer.requisites;
    document.getElementById("footer-rights").textContent = "© 2024–2026 ООО «ГлобалМеталлХолд». " + t.footer.rights;
    document.getElementById("skip-link").textContent = t.skip;
    document.querySelectorAll("[data-i18n]").forEach(function (n) {
      var key = n.getAttribute("data-i18n").split(".");
      var v = t; for (var i = 0; i < key.length && v; i++) v = v[key[i]];
      if (typeof v === "string") n.textContent = v;
    });
  }

  /* ---------- Reveal-анимации ---------- */
  var observer;
  function observeReveals() {
    if (observer) observer.disconnect();
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("visible"); });
      return;
    }
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); observer.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal:not(.visible)").forEach(function (n) { observer.observe(n); });
  }

  /* ---------- Язык ---------- */
  function applyLang(lang) {
    var t = getTranslated(lang);
    document.documentElement.lang = lang;
    document.title = lang === "ru"
      ? "ГлобалМеталлХолд — металлообработка на заказ в Логойске | Токарные и фрезерные работы на ЧПУ"
      : "GlobalMetalHold — custom metalworking in Logoisk, Belarus | CNC turning and milling";
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    try { localStorage.setItem("gmh-lang", lang); } catch (e) {}
    chosenFile = null;
    render(t);
  }

  /* ---------- Инициализация ---------- */
  var started = false; // был ли уже выполнен первый рендер (фолбэком)
  function startSite(force) {
    if (started && !force) return;
    started = true;
    var saved = "ru";
    try { saved = localStorage.getItem("gmh-lang") || "ru"; } catch (e) {}
    if (!startSite.wired) {
      startSite.wired = true;
      document.querySelectorAll(".lang-switch button").forEach(function (b) {
        b.addEventListener("click", function () { applyLang(b.dataset.lang); });
      });
      var burger = document.getElementById("burger"), nav = document.getElementById("nav");
      if (!burger || !nav) return; // страница не является сайтом (например, editor.html) — инициализация не нужна
      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        burger.setAttribute("aria-expanded", String(open));
      });
      nav.addEventListener("click", function (e) { if (e.target.tagName === "A") nav.classList.remove("open"); });
    }
    applyLang(saved === "en" ? "en" : "ru");
  }
  window.__gmhStart = function () { startSite(started); }; // вызывается после попытки загрузки site-data.json (см. index.html)
  /* Фолбэк: стартуем сразу после DOMContentLoaded, не дожидаясь ответа по site-data.json */
  document.addEventListener("DOMContentLoaded", function () { startSite(false); });
  /* Если ответ по site-data.json пришёл уже после первого рендера — перерисовываем сайт */
  setInterval(function () {
    if (window.__gmhDataLoaded && !startSite.rebuilt && started) { startSite.rebuilt = true; startSite(true); }
  }, 300);
})();
