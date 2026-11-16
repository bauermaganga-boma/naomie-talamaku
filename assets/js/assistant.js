(function () {
  'use strict';
  var C = window.SITE || {};
  var chat = document.getElementById('chat'), toggle = document.getElementById('chat-toggle'),
      body = document.getElementById('chat-body'), chipsBox = document.getElementById('chat-chips'),
      form = document.getElementById('chat-form'), input = document.getElementById('chat-input'),
      fab = document.getElementById('fab'), started = false;

  function cta(text, label) {
    if (C.whatsapp) return '<a class="chat__cta" href="' + window.waLink(text) + '" target="_blank" rel="noopener">' + (label || 'Continuer sur WhatsApp') + '</a>';
    return '<a class="chat__link" href="#contact" data-close>Me laisser un message via le formulaire</a>';
  }

  var KB = [
    { id: 'bonjour', keys: ['bonjour', 'bonsoir', 'salut', 'hello', 'coucou', 'bjr'],
      answer: "Bonjour et bienvenue ! Je peux vous renseigner sur les services de <strong>Naomie Talamaku</strong>, sa méthode, ou vous aider à la contacter. Que souhaitez-vous savoir ?" },
    { id: 'services', keys: ['service', 'prestation', 'que faites', 'propose', 'offre', 'competence', 'metier', 'activite'],
      answer: "Naomie intervient sur :<ul><li>Tenue de comptabilité</li><li>Mise en ordre des documents</li><li>Facturation &amp; relances</li><li>Suivi de trésorerie</li><li>Préparation des échéances</li><li>Gestion administrative externalisée</li></ul>Pour les entreprises <em>et</em> les particuliers.",
      chips: ['Entreprises', 'Particuliers', 'Tarifs'] },
    { id: 'compta', keys: ['comptabilit', 'compta', 'ecriture', 'saisie', 'bilan', 'banque', 'rapprochement', 'tenue'],
      answer: "La <strong>tenue de comptabilité</strong> comprend la saisie régulière de vos pièces (achats, ventes, banque, caisse), le rapprochement bancaire et des tableaux de suivi. Les missions réglementées (certification, signature du bilan) restent du ressort d'un expert-comptable inscrit à l'Ordre : Naomie travaille en lien avec le vôtre.",
      chips: ['Tarifs', 'Contact'] },
    { id: 'documents', keys: ['document', 'facture', 'justificatif', 'classement', 'classer', 'piece', 'papier', 'ordre', 'organis', 'archiv'],
      answer: "Naomie <strong>met de l'ordre dans vos documents</strong> : tri, classement, relance des pièces manquantes, et préparation d'un dossier propre à transmettre à votre expert-comptable.",
      chips: ['Particuliers', 'Contact'] },
    { id: 'tresorerie', keys: ['tresorerie', 'relance', 'impaye', 'encaissement', 'facturation', 'previsionnel', 'tableau de bord'],
      answer: "Pour la <strong>trésorerie</strong> : facturation, suivi des règlements, relances courtoises et tableaux de bord simples pour anticiper vos entrées et sorties.",
      chips: ['Tarifs', 'Contact'] },
    { id: 'echeances', keys: ['echeance', 'declaration', 'tva', 'impot', 'fiscal', 'urssaf', 'cotisation', 'liasse'],
      answer: "Naomie <strong>prépare les éléments</strong> nécessaires à vos déclarations et à vos échéances (calendrier, données TVA, etc.). Les déclarations qui exigent un expert-comptable lui sont confiées.",
      chips: ['Contact'] },
    { id: 'admin', keys: ['administratif', 'administration', 'courrier', 'demarche', 'assistance', 'secretariat', 'externalis'],
      answer: "La <strong>gestion administrative externalisée</strong> couvre courriers, dossiers, saisies et démarches courantes — à distance, pour vous libérer du temps.",
      chips: ['Tarifs', 'Contact'] },
    { id: 'entreprises', keys: ['entreprise', 'societe', 'tpe', 'pme', 'independant', 'auto entrepreneur', 'micro', 'association', 'commerce', 'professionnel'],
      answer: "Pour les <strong>entreprises</strong> (indépendants, TPE, PME, associations) : comptabilité à jour, documents en ordre, trésorerie suivie, échéances préparées.",
      chips: ['Nos services', 'Tarifs', 'Contact'] },
    { id: 'particuliers', keys: ['particulier', 'famille', 'foyer', 'budget', 'personnel', 'perso', 'menage'],
      answer: "Pour les <strong>particuliers</strong> : organisation des papiers, budget et suivi des dépenses, aide à la préparation de dossiers administratifs.",
      chips: ['Nos services', 'Contact'] },
    { id: 'expert', keys: ['expert', 'ordre', 'diplome', 'titre', 'inscrit', 'certif', 'difference'],
      answer: "Naomie exerce en tant que <strong>comptable</strong>. L'expert-comptable est un professionnel inscrit à l'Ordre, seul habilité à présenter et certifier les comptes. Naomie intervient en amont et en complément, pour que votre dossier soit propre et à jour.",
      chips: ['Nos services', 'Contact'] },
    { id: 'tarifs', keys: ['tarif', 'prix', 'cout', 'combien', 'devis', 'budget de', 'honoraire', 'cher', 'gratuit', 'montant'],
      answer: "Le tarif dépend du <strong>volume de pièces</strong> et de la <strong>fréquence</strong> souhaitée. Un premier échange est sans engagement, puis un devis personnalisé vous est proposé.<br>" + cta('Bonjour Naomie, je souhaite un devis pour un accompagnement comptable.', 'Demander un devis') + '<a class="chat__link" href="#contact" data-close>ou utiliser le formulaire</a>' },
    { id: 'distance', keys: ['distance', 'telephone', 'visio', 'en ligne', 'deplace', 'ou etes', 'adresse', 'situe', 'localisation', 'region', 'ville'],
      answer: "L'essentiel du travail se fait <strong>à distance</strong>, avec des documents partagés de façon sécurisée. Pour un échange en personne, contactez Naomie pour convenir d'une solution.",
      chips: ['Contact'] },
    { id: 'delai', keys: ['delai', 'combien de temps', 'duree', 'quand', 'rapide', 'urgent', 'reactiv'],
      answer: "Naomie s'engage sur la <strong>réactivité</strong> : les délais sont précisés dès le premier échange, selon l'urgence et le volume à traiter.",
      chips: ['Contact'] },
    { id: 'confidentialite', keys: ['confidenti', 'securi', 'donnee', 'protege', 'prive', 'discretion', 'rgpd'],
      answer: "Vos informations sont traitées de manière <strong>strictement confidentielle</strong> et ne servent qu'à la mission convenue.",
      chips: ['Contact'] },
    { id: 'contact', keys: ['contact', 'numero', 'appeler', 'joindre', 'mail', 'email', 'courriel', 'whatsapp', 'parler', 'humain', 'rappeler', 'rendez vous', 'rdv', 'echange'],
      answer: "Vous pouvez contacter Naomie via le formulaire de la page" + (C.email ? ", par e-mail (<a href=\"mailto:" + C.email + "\">" + C.email + "</a>)" : '') + (C.phone ? ' ou par téléphone (<a href="tel:' + C.phone + '">' + C.phone + '</a>)' : '') + ". Le premier échange est sans engagement.<br>" + cta('Bonjour Naomie, je souhaite être recontacté(e).', 'Écrire sur WhatsApp') + '<a class="chat__link" href="#contact" data-close>Aller au formulaire</a>' },
    { id: 'merci', keys: ['merci', 'au revoir', 'bye', 'a bientot', 'parfait', 'super'],
      answer: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions." }
  ];

  var CHIP_MAP = { 'Nos services': 'services', 'Entreprises': 'entreprises', 'Particuliers': 'particuliers', 'Tarifs': 'tarifs', 'Contact': 'contact', 'Expert-comptable ?': 'expert' };
  var DEFAULT_CHIPS = ['Nos services', 'Entreprises', 'Particuliers', 'Tarifs', 'Expert-comptable ?', 'Contact'];

  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9+ ]/g, ' ').replace(/\s+/g, ' '); }
  function findAnswer(q) {
    var t = ' ' + norm(q) + ' ', best = null, bs = 0;
    KB.forEach(function (e) {
      var s = 0;
      e.keys.forEach(function (k) { if (t.indexOf(' ' + k) !== -1) s += k.length > 5 ? 2 : 1; });
      if (e.id === 'bonjour' && s) s = 0.5;
      if (s > bs) { bs = s; best = e; }
    });
    return best;
  }
  function addMsg(html, who) {
    var m = document.createElement('div'); m.className = 'chat__msg chat__msg--' + who; m.innerHTML = html;
    body.appendChild(m); body.scrollTop = body.scrollHeight; return m;
  }
  function setChips(list) {
    chipsBox.innerHTML = '';
    (list || DEFAULT_CHIPS).forEach(function (c) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'chat__chip'; b.textContent = c;
      b.addEventListener('click', function () { ask(c, CHIP_MAP[c]); }); chipsBox.appendChild(b);
    });
  }
  function botReply(html, chips) {
    var typing = addMsg('<span class="chat__typing"><i></i><i></i><i></i></span>', 'bot');
    setTimeout(function () { typing.innerHTML = html; body.scrollTop = body.scrollHeight; setChips(chips); }, 450 + Math.min(html.length, 350));
  }
  function ask(text, forcedId) {
    addMsg(text.replace(/</g, '&lt;'), 'user');
    var entry = null;
    if (forcedId) KB.forEach(function (e) { if (e.id === forcedId) entry = e; });
    if (!entry) entry = findAnswer(text);
    if (entry) botReply(entry.answer, entry.chips);
    else botReply("Je n'ai pas la réponse précise à cette question, mais Naomie peut vous répondre directement :<br>" + cta("Bonjour Naomie, j'ai une question : " + text, 'Poser ma question sur WhatsApp') + '<a class="chat__link" href="#contact" data-close>ou via le formulaire</a>');
  }
  function open() {
    chat.classList.add('is-open'); fab.classList.add('is-chat-open');
    chat.setAttribute('aria-hidden', 'false'); toggle.setAttribute('aria-expanded', 'true');
    if (!started) { started = true; botReply("Bonjour. Je réponds aux questions courantes sur les services de <strong>Naomie Talamaku</strong>, comptable. Pour tout le reste, vous pouvez lui écrire directement."); }
    setTimeout(function () { input.focus(); }, 300);
  }
  function close() {
    chat.classList.remove('is-open'); fab.classList.remove('is-chat-open');
    chat.setAttribute('aria-hidden', 'true'); toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () { chat.classList.contains('is-open') ? close() : open(); });
  document.getElementById('m-chat').addEventListener('click', open);
  document.getElementById('chat-close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && chat.classList.contains('is-open')) close(); });
  body.addEventListener('click', function (e) { if (e.target.closest('a[data-close]')) close(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); var q = input.value.trim(); if (!q) return; input.value = ''; ask(q); });
  setTimeout(function () {
    try { if (sessionStorage.getItem('ntChatHint')) return; sessionStorage.setItem('ntChatHint', '1'); } catch (e) {}
    if (!chat.classList.contains('is-open')) fab.classList.add('is-hint');
    setTimeout(function () { fab.classList.remove('is-hint'); }, 6000);
  }, 5000);
})();
