(function () {
  'use strict';
  var C = window.SITE || {};
  var $ = function (id) { return document.getElementById(id); };

  function waLink(text) { return 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(text); }
  window.waLink = waLink;
  var WA_MSG = 'Bonjour Naomie, je vous contacte depuis votre site à propos de votre accompagnement comptable.';

  // Coordonnées : on n'affiche que ce qui est renseigné
  if (C.whatsapp) {
    ['fab-wa', 'c-wa', 'm-wa'].forEach(function (id) { var a = $(id); a.href = waLink(WA_MSG); a.hidden = false; });
  }
  if (C.phone) {
    ['c-tel', 'm-tel'].forEach(function (id) { var a = $(id); a.href = 'tel:' + C.phone; a.hidden = false; });
    $('c-tel-t').innerHTML = C.phone + '<small>Appeler directement</small>';
  }
  if (C.email) {
    var m = $('c-mail'); m.href = 'mailto:' + C.email; m.hidden = false;
    $('c-mail-t').innerHTML = C.email + '<small>Écrire un message</small>';
  }
  if (C.linkedin) $('c-in').href = C.linkedin; else $('c-in').hidden = true;

  // En-tête
  var header = $('header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  var burger = $('burger'), nav = $('nav');
  function closeNav() { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });

  // Apparitions
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add('is-visible'); });

  // Lien actif
  var links = nav.querySelectorAll('a[href^="#"]:not(.btn)');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var s = document.querySelector(l.getAttribute('href')); if (s) spy.observe(s); });
  }

  // Onglets services
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (b) { b.classList.toggle('is-active', b === t); });
      $('tab-pro').classList.toggle('is-hidden', t.dataset.tab !== 'pro');
      $('tab-part').classList.toggle('is-hidden', t.dataset.tab !== 'part');
    });
  });

  // Formulaire : ouvre la messagerie, sinon WhatsApp
  var form = $('contact-form'), note = $('form-note');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      var v = f.value.trim() !== '' && (f.type !== 'email' || /\S+@\S+\.\S+/.test(f.value));
      f.classList.toggle('is-invalid', !v); if (!v) ok = false;
    });
    if (!ok) { note.textContent = 'Merci de compléter les champs obligatoires.'; return; }
    var d = new FormData(form);
    var body = 'Nom : ' + d.get('nom') + '\nTéléphone : ' + d.get('tel') + '\nE-mail : ' + d.get('email') + '\nProfil : ' + d.get('profil') + '\n\n' + d.get('message');
    if (C.email) {
      window.location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent('Demande de contact — ' + d.get('profil')) + '&body=' + encodeURIComponent(body);
      note.textContent = "Merci ! Votre messagerie va s'ouvrir pour finaliser l'envoi.";
    } else if (C.whatsapp) {
      window.open(waLink(body), '_blank', 'noopener');
      note.textContent = 'Merci ! WhatsApp va s\'ouvrir avec votre message.';
    } else {
      note.textContent = 'Merci ! (Démonstration : les coordonnées de réception ne sont pas encore configurées.)';
    }
  });

  $('year').textContent = new Date().getFullYear();
})();
