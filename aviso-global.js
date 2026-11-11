/* Aviso global: web en desuso, migracion a lpic1.manuelcobos.dev. Aparece en cada carga; se cierra con la X.
   Solo ASCII (escapes \u) para evitar texto roto si el servidor no declara UTF-8. */
(function () {
  function init() {
    if (document.getElementById('aviso-global')) return;
    var css = document.createElement('style');
    css.textContent =
      '#aviso-global{position:fixed;top:0;left:0;right:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;gap:14px;box-sizing:border-box;padding:10px 64px 10px 24px;background:#fff4d6;color:#5c3b00;border-bottom:2px solid #e0a100;box-shadow:0 2px 8px rgba(0,0,0,.15);font-family:system-ui,"Segoe UI",Roboto,Arial,sans-serif;font-size:20px;font-weight:500;line-height:1.4;text-align:left;letter-spacing:normal;text-transform:none}' +
      '#aviso-global svg{flex:none;width:28px;height:28px}' +
      '#aviso-global a{color:#7a4a00;font-weight:700;text-decoration:underline}' +
      '#aviso-global .av-x{position:absolute;right:14px;top:50%;transform:translateY(-50%);width:40px;height:40px;border:0;border-radius:50%;background:transparent;color:#5c3b00;font:400 30px/1 Arial,sans-serif;cursor:pointer;padding:0}' +
      '#aviso-global .av-x:hover,#aviso-global .av-x:focus-visible{background:rgba(224,161,0,.3);outline:2px solid #e0a100}';
    document.head.appendChild(css);
    var b = document.createElement('div');
    b.id = 'aviso-global';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Aviso del sistema');
    b.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="#b37800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>' +
      '<span><strong>Aviso:</strong> esta p\u00e1gina est\u00e1 en desuso. Los contenidos se est\u00e1n migrando a la nueva web ' +
      '<a href="https://lpic1.manuelcobos.dev" target="_blank" rel="noopener">lpic1.manuelcobos.dev</a>. ' +
      'Seguir\u00e1n disponibles aqu\u00ed hasta completar la transferencia.</span>';
    var x = document.createElement('button');
    x.type = 'button';
    x.className = 'av-x';
    x.setAttribute('aria-label', 'Cerrar aviso');
    x.textContent = '\u00d7';
    x.onclick = function () { b.remove(); };
    b.appendChild(x);
    document.body.appendChild(b);
  }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();