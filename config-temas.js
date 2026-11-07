/**
 * ============================================================================
 * CONFIGURACIÓN DE VISIBILIDAD — SEGUNDA PARTE (EXAMEN LPIC-1 102-500)
 * ============================================================================
 * Modifica la variable window.TEMAS_VISIBLES para indicar qué temas de la
 * segunda parte quieres que estén habilitados (clicables) en toda la web.
 * Los temas que NO estén en esta lista aparecerán bloqueados (no clicables).
 *
 * Equivalencia de temas de la 2ª parte (puedes usar T5..T10 o 105..110):
 *   - T5  (o 105) -> Tema 105: Interfaces y scripts
 *   - T6  (o 106) -> Tema 106: Interfaces de usuario y escritorios
 *   - T7  (o 107) -> Tema 107: Tareas administrativas
 *   - T8  (o 108) -> Tema 108: Servicios esenciales del sistema
 *   - T9  (o 109) -> Tema 109: Fundamentos de red
 *   - T10 (o 110) -> Tema 110: Seguridad
 *
 * Ejemplos:
 *   window.TEMAS_VISIBLES = "ALL";               // Solo visibles temas 5 y 6
 *   window.TEMAS_VISIBLES = "T5,T6,T7";            // Solo visibles temas 5, 6 y 7
 *   window.TEMAS_VISIBLES = "T5,T6,T7,T8,T9,T10";  // Todos visibles (o "ALL")
 *   window.TEMAS_VISIBLES = "";                    // Ninguno visible (o "NONE")
 * ============================================================================
 */

window.TEMAS_VISIBLES = "ALL";

(function () {
  'use strict';

  var MAP_T_TO_TOPIC = {
    'T5': '105', '5': '105', 'T105': '105', '105': '105',
    'T6': '106', '6': '106', 'T106': '106', '106': '106',
    'T7': '107', '7': '107', 'T107': '107', '107': '107',
    'T8': '108', '8': '108', 'T108': '108', '108': '108',
    'T9': '109', '9': '109', 'T109': '109', '109': '109',
    'T10': '110', '10': '110', 'T110': '110', '110': '110'
  };

  var ALL_PART2_TOPICS = ['105', '106', '107', '108', '109', '110'];

  function parseVisibleTopics102(flagStr) {
    var raw = String(flagStr == null ? '' : flagStr).trim().toUpperCase();
    var set = new Set();
    if (raw === 'ALL' || raw === 'TODOS' || raw === '*') {
      ALL_PART2_TOPICS.forEach(function (t) { set.add(t); });
      return set;
    }
    if (raw === '' || raw === 'NONE' || raw === 'NINGUNO') {
      return set;
    }
    var tokens = raw.split(/[,;\s]+/);
    for (var i = 0; i < tokens.length; i++) {
      var tok = tokens[i].trim();
      if (MAP_T_TO_TOPIC[tok]) {
        set.add(MAP_T_TO_TOPIC[tok]);
      }
    }
    return set;
  }

  var visibleSet102 = parseVisibleTopics102(window.TEMAS_VISIBLES);
  window.LPIC_VISIBLE_TOPICS_102 = visibleSet102;
  window.LPIC_ALL_PART2_TOPICS = ALL_PART2_TOPICS;

  window.isTopicVisible = function (temaId) {
    if (temaId == null) return true;
    var norm = String(temaId).trim().toUpperCase();
    var mapped = MAP_T_TO_TOPIC[norm] || norm;
    if (ALL_PART2_TOPICS.indexOf(mapped) === -1) {
      return true; // Temas 101-104 (Parte 1) siempre visibles
    }
    return visibleSet102.has(mapped);
  };

  window.extractTopicFromHref = function (href) {
    if (!href) return null;
    var s = String(href);
    var m;
    // t105/..., /t107/...
    m = s.match(/(?:^|[\/\\])t(10[5-9]|110)(?:[\/\\]|$)/i);
    if (m) return m[1];
    // 105-1..., 107-2...
    m = s.match(/(?:^|[\/\\])(10[5-9]|110)-\d/i);
    if (m) return m[1];
    // p-105-1.html, p-tema-105-global.html, p-tema-105.html
    m = s.match(/p-(?:tema-)?(10[5-9]|110)(?:-[a-z0-9]+|\.html)/i);
    if (m) return m[1];
    // ?tema=105 o &tema=107
    m = s.match(/[?&]tema=(10[5-9]|110)\b/i);
    if (m) return m[1];
    // #t105
    m = s.match(/#t(10[5-9]|110)\b/i);
    if (m) return m[1];
    return null;
  };

  // Filtrado temprano de datos si ya están cargados en window (Grafo / Simulador)
  function filterGlobalDataBanks() {
    // 1. Grafo de Conocimiento (window.LPIC_GRAPH_DATA)
    if (window.LPIC_GRAPH_DATA && Array.isArray(window.LPIC_GRAPH_DATA.nodes) && !window.LPIC_GRAPH_DATA._filteredByConfig) {
      window.LPIC_GRAPH_DATA._filteredByConfig = true;
      var allowedNodeIds = new Set();
      window.LPIC_GRAPH_DATA.nodes = window.LPIC_GRAPH_DATA.nodes.filter(function (n) {
        var keep = window.isTopicVisible(n.tema);
        if (keep) allowedNodeIds.add(n.id);
        return keep;
      });
      if (Array.isArray(window.LPIC_GRAPH_DATA.edges)) {
        window.LPIC_GRAPH_DATA.edges = window.LPIC_GRAPH_DATA.edges.filter(function (e) {
          var srcId = e.from != null ? e.from : (typeof e.source === 'object' ? e.source.id : e.source);
          var tgtId = e.to != null ? e.to : (typeof e.target === 'object' ? e.target.id : e.target);
          return allowedNodeIds.has(srcId) && allowedNodeIds.has(tgtId);
        });
      }
    }

    // 2. Banco de preguntas del Simulador (window.ALL_QUESTIONS_BANK)
    if (Array.isArray(window.ALL_QUESTIONS_BANK) && !window.ALL_QUESTIONS_BANK._filteredByConfig) {
      var filtered = window.ALL_QUESTIONS_BANK.filter(function (q) {
        var t = q.tema != null ? q.tema : q.topic;
        return window.isTopicVisible(t);
      });
      filtered._filteredByConfig = true;
      window.ALL_QUESTIONS_BANK = filtered;
    }
  }

  filterGlobalDataBanks();

  function injectLockStyles() {
    if (document.getElementById('lpic-topic-lock-styles')) return;
    var style = document.createElement('style');
    style.id = 'lpic-topic-lock-styles';
    style.textContent = [
      '.topic-locked {',
      '  opacity: 0.46 !important;',
      '  filter: grayscale(0.85) !important;',
      '  pointer-events: none !important;',
      '  user-select: none !important;',
      '  cursor: not-allowed !important;',
      '  position: relative !important;',
      '  transition: none !important;',
      '  transform: none !important;',
      '  box-shadow: none !important;',
      '}',
      '.topic-locked * {',
      '  pointer-events: none !important;',
      '  cursor: not-allowed !important;',
      '}',
      '.topic-locked-section {',
      '  opacity: 0.46 !important;',
      '  filter: grayscale(0.85) !important;',
      '  pointer-events: none !important;',
      '  user-select: none !important;',
      '  cursor: not-allowed !important;',
      '  position: relative !important;',
      '}',
      '.topic-locked-section * {',
      '  pointer-events: none !important;',
      '  cursor: not-allowed !important;',
      '}',
      '.topic-locked-section .subtopic-block,',
      '.topic-locked-section .cards-grid,',
      '.topic-locked-section .grid-practices {',
      '  max-height: 220px !important;',
      '  overflow: hidden !important;',
      '  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85) 30%, transparent 100%) !important;',
      '  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85) 30%, transparent 100%) !important;',
      '}',
      '.sim-pill-locked, .nav-locked-item {',
      '  opacity: 0.42 !important;',
      '  filter: grayscale(0.9) !important;',
      '  pointer-events: none !important;',
      '  cursor: not-allowed !important;',
      '  user-select: none !important;',
      '  text-decoration: none !important;',
      '}',
      '.locked-pill-badge {',
      '  display: inline-flex !important;',
      '  align-items: center !important;',
      '  gap: 4px !important;',
      '  margin-left: 8px !important;',
      '  padding: 2px 8px !important;',
      '  border-radius: 999px !important;',
      '  font-size: 11px !important;',
      '  font-weight: 700 !important;',
      '  letter-spacing: 0.03em !important;',
      '  text-transform: uppercase !important;',
      '  background: rgba(100, 116, 139, 0.16) !important;',
      '  color: #475569 !important;',
      '  border: 1px solid rgba(100, 116, 139, 0.32) !important;',
      '  vertical-align: middle !important;',
      '}',
      '[data-theme="dark"] .locked-pill-badge {',
      '  background: rgba(148, 163, 184, 0.15) !important;',
      '  color: #94a3b8 !important;',
      '  border-color: rgba(148, 163, 184, 0.3) !important;',
      '}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(style);
  }

  function blockEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') {
      e.stopImmediatePropagation();
    }
    return false;
  }

  function disableElement(el, addLockPrefix) {
    if (!el || el.dataset.lpicLocked === '1') return;
    el.dataset.lpicLocked = '1';
    el.classList.add('nav-locked-item');
    if (el.hasAttribute('href')) {
      el.setAttribute('data-locked-href', el.getAttribute('href'));
      el.removeAttribute('href');
    }
    if (el.hasAttribute('onclick')) {
      el.removeAttribute('onclick');
    }
    if ('disabled' in el) {
      el.disabled = true;
    }
    el.setAttribute('aria-disabled', 'true');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('title', 'Tema no disponible actualmente');
    if (addLockPrefix && el.textContent && el.textContent.indexOf('🔒') === -1) {
      el.textContent = '🔒 ' + el.textContent.trim();
    }
    el.addEventListener('click', blockEvent, true);
    el.addEventListener('keydown', blockEvent, true);
  }

  function disableAllInside(container) {
    if (!container) return;
    var interactive = container.querySelectorAll('a, button, input, select, textarea, [onclick], [tabindex]');
    for (var i = 0; i < interactive.length; i++) {
      disableElement(interactive[i], false);
    }
    container.addEventListener('click', blockEvent, true);
  }

  function appendLockedBadge(headerEl) {
    if (!headerEl || headerEl.querySelector('.locked-pill-badge')) return;
    var badge = document.createElement('span');
    badge.className = 'locked-pill-badge';
    badge.textContent = '🔒 No disponible';
    headerEl.appendChild(badge);
  }

  function applyDomLocks() {
    injectLockStyles();
    filterGlobalDataBanks();

    // ------------------------------------------------------------------------
    // 1. PORTADA PRINCIPAL (app/index.html)
    // ------------------------------------------------------------------------
    var topicCards = document.querySelectorAll('.topic-card');
    for (var i = 0; i < topicCards.length; i++) {
      var card = topicCards[i];
      var tid = card.getAttribute('data-topic');
      if (!tid) {
        var tagEl = card.querySelector('.topic-num-tag');
        if (tagEl) {
          var mTag = tagEl.textContent.match(/\b(10[1-9]|110)\b/);
          if (mTag) tid = mTag[1];
        }
      }
      if (tid && !window.isTopicVisible(tid)) {
        card.classList.add('topic-locked');
        card.setAttribute('aria-disabled', 'true');
        var numTag = card.querySelector('.topic-num-tag');
        appendLockedBadge(numTag);
        disableAllInside(card);
      }
    }

    // Banner Simulador 102 en index.html
    var simBanner102 = document.getElementById('examen-simulador-102');
    if (simBanner102) {
      var simPills = simBanner102.querySelectorAll('.sim-topic-pill');
      for (var j = 0; j < simPills.length; j++) {
        var pill = simPills[j];
        var pillTopic = pill.getAttribute('data-topic') || window.extractTopicFromHref(pill.getAttribute('href'));
        if (!pillTopic) {
          var mPill = pill.textContent.match(/\b(10[5-9]|110)\b/);
          if (mPill) pillTopic = mPill[1];
        }
        if (pillTopic && !window.isTopicVisible(pillTopic)) {
          pill.classList.add('sim-pill-locked');
          disableElement(pill, true);
        }
      }
      if (visibleSet102.size === 0) {
        var mainSimBtns = simBanner102.querySelectorAll('.btn-sim-gold, .btn-sim-ghost, .btn-sim-primary, .btn-sim-secondary');
        for (var k = 0; k < mainSimBtns.length; k++) {
          mainSimBtns[k].classList.add('sim-pill-locked');
          disableElement(mainSimBtns[k], true);
        }
      }
    }

    // Si hay 0 temas visibles en la Parte 2, deshabilitar accesos directos a simulador-102.html
    if (visibleSet102.size === 0) {
      var sim102Links = document.querySelectorAll('a[href*="simulador-102.html"]');
      for (var s = 0; s < sim102Links.length; s++) {
        sim102Links[s].classList.add('sim-pill-locked');
        disableElement(sim102Links[s], true);
      }
    }

    // ------------------------------------------------------------------------
    // 2. SECCIÓN PRÁCTICAS (app/practicas/index.html y p-*.html)
    // ------------------------------------------------------------------------
    var filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    for (var fb = 0; fb < filterBtns.length; fb++) {
      var fbtn = filterBtns[fb];
      var fTopic = fbtn.getAttribute('data-filter');
      if (fTopic && !window.isTopicVisible(fTopic)) {
        fbtn.classList.add('sim-pill-locked');
        disableElement(fbtn, true);
      }
    }

    var practiceCards = document.querySelectorAll('.practice-card[data-topic]');
    for (var pc = 0; pc < practiceCards.length; pc++) {
      var pcard = practiceCards[pc];
      var pTopic = pcard.getAttribute('data-topic');
      if (pTopic && !window.isTopicVisible(pTopic)) {
        pcard.classList.add('topic-locked');
        disableAllInside(pcard);
      }
    }

    // ------------------------------------------------------------------------
    // 3. SECCIONES POR TEMA EN PRÁCTICAS, COMANDOS, GLOSARIO Y ERRATAS
    //    (<section class="topic-section" id="t105..t110">)
    // ------------------------------------------------------------------------
    var topicSections = document.querySelectorAll('section.topic-section[id^="t"]');
    for (var ts = 0; ts < topicSections.length; ts++) {
      var sec = topicSections[ts];
      var secTopic = sec.id.replace(/^t/i, '');
      if (secTopic && !window.isTopicVisible(secTopic)) {
        sec.classList.add('topic-locked-section');
        sec.setAttribute('aria-disabled', 'true');
        var headerTarget = sec.querySelector('.topic-title') || sec.querySelector('.topic-header h2') || sec.querySelector('h2');
        appendLockedBadge(headerTarget);
        disableAllInside(sec);
      }
    }

    // Botones de navegación superior (#t105..#t110) en comandos.html, glosario.html, erratas.html
    var anchorTopicBtns = document.querySelectorAll('a.nav-btn[href^="#t"]');
    for (var ab = 0; ab < anchorTopicBtns.length; ab++) {
      var abtn = anchorTopicBtns[ab];
      var aTopic = (abtn.getAttribute('href') || '').replace(/^#t/i, '');
      if (aTopic && !window.isTopicVisible(aTopic)) {
        abtn.classList.add('sim-pill-locked');
        disableElement(abtn, true);
      }
    }

    // ------------------------------------------------------------------------
    // 4. SIMULADOR 102 (app/simulador/simulador-102.html)
    // ------------------------------------------------------------------------
    var simFilterPills = document.querySelectorAll('.filter-pills .filter-pill-btn, #topicFilterPills .filter-pill-btn');
    if (simFilterPills.length > 0) {
      for (var sp = 0; sp < simFilterPills.length; sp++) {
        var spill = simFilterPills[sp];
        var spTopic = spill.getAttribute('data-topic');
        if (!spTopic) {
          var oc = spill.getAttribute('onclick') || '';
          var mOc = oc.match(/(?:setTopicFilter|selectTopicFilter)\(\s*['"]?([^'",\s)]+)['"]?/);
          if (mOc) spTopic = mOc[1];
        }
        if (spTopic === 'all' && Array.isArray(window.ALL_QUESTIONS_BANK)) {
          spill.textContent = 'Todos los Temas (' + window.ALL_QUESTIONS_BANK.length + ' Preguntas)';
        } else if (spTopic && spTopic !== 'all' && !window.isTopicVisible(spTopic)) {
          spill.classList.add('sim-pill-locked');
          disableElement(spill, true);
        }
      }

      // Ocultar o bloquear filas de temas no visibles en el desglose de resultados
      var resultRows = document.querySelectorAll('.topic-rows .topic-row, #resultsTopicBreakdown .topic-row');
      for (var rr = 0; rr < resultRows.length; rr++) {
        var row = resultRows[rr];
        var rTopic = row.getAttribute('data-topic');
        if (!rTopic) {
          var infoEl = row.querySelector('.topic-row-info, .topic-row-name');
          if (infoEl) {
            var mRow = infoEl.textContent.match(/\b(10[5-9]|110)\b/);
            if (mRow) rTopic = mRow[1];
          }
        }
        if (rTopic && !window.isTopicVisible(rTopic)) {
          row.classList.add('topic-locked');
        }
      }

      if (visibleSet102.size === 0 && window.location.pathname.indexOf('simulador-102') !== -1) {
        var startBtns = document.querySelectorAll('#startBtn, .btn-start-exam, button[onclick*="startSession"]');
        for (var sb = 0; sb < startBtns.length; sb++) {
          startBtns[sb].classList.add('sim-pill-locked');
          disableElement(startBtns[sb], true);
        }
      }
    }

    // ------------------------------------------------------------------------
    // 5. GRAFO DE CONOCIMIENTO (app/grafo.html)
    // ------------------------------------------------------------------------
    var grafoPills = document.querySelectorAll('#tema-pills [data-tema]');
    for (var gp = 0; gp < grafoPills.length; gp++) {
      var gpill = grafoPills[gp];
      var gTema = gpill.getAttribute('data-tema');
      if (gTema && gTema !== 'all' && !window.isTopicVisible(gTema)) {
        gpill.classList.add('sim-pill-locked');
        disableElement(gpill, true);
      }
    }

    var selectTema = document.getElementById('select-tema');
    if (selectTema) {
      var opts = selectTema.querySelectorAll('option');
      for (var op = 0; op < opts.length; op++) {
        var opt = opts[op];
        if (opt.value && opt.value !== 'all' && !window.isTopicVisible(opt.value)) {
          opt.disabled = true;
          if (opt.textContent.indexOf('🔒') === -1) {
            opt.textContent = '🔒 ' + opt.textContent.trim() + ' (No disponible)';
          }
        }
      }
    }

    // ------------------------------------------------------------------------
    // 6. ENLACES GENÉRICOS EN CUALQUIER PÁGINA (Decks, Prácticas prev/next, etc.)
    // ------------------------------------------------------------------------
    var allLinks = document.querySelectorAll('a[href]');
    for (var al = 0; al < allLinks.length; al++) {
      var link = allLinks[al];
      if (link.dataset.lpicLocked === '1') continue;
      var targetTopic = window.extractTopicFromHref(link.getAttribute('href'));
      if (targetTopic && !window.isTopicVisible(targetTopic)) {
        link.classList.add('sim-pill-locked');
        disableElement(link, true);
      }
    }

    // Si alguien entra directamente por URL a un deck o práctica de un tema bloqueado
    var currentTopic = window.extractTopicFromHref(window.location.pathname);
    if (currentTopic && !window.isTopicVisible(currentTopic)) {
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,0.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:24px;font-family:Inter,system-ui,sans-serif;';
      overlay.innerHTML = '<div style="background:#ffffff;color:#0f172a;max-width:460px;width:100%;padding:32px;border-radius:16px;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.3);">' +
        '<div style="font-size:42px;margin-bottom:12px;">🔒</div>' +
        '<h2 style="margin:0 0 8px;font-size:22px;font-weight:800;">Tema ' + currentTopic + ' no disponible</h2>' +
        '<p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.5;">Este tema de la Segunda Parte (LPIC-1 102-500) aún no está habilitado en la configuración actual.</p>' +
        '<a href="../index.html" style="display:inline-block;padding:12px 24px;border-radius:10px;background:#2563eb;color:#ffffff;font-weight:700;text-decoration:none;font-size:14px;">Volver al inicio</a>' +
        '</div>';
      document.body.appendChild(overlay);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDomLocks);
  } else {
    applyDomLocks();
  }
})();
