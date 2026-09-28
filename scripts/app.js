/* =========================================================
   APP — comportamento da página do Musas 21
   Você não precisa mexer aqui: as opções ficam no config.js.
   ========================================================= */

(function () {
  "use strict";

  var C = window.MUSAS_CONFIG || {};
  var ESTADOS = ["espera", "aberto", "encerrado"];

  // Parâmetros que o checkout da Kiwify aceita para rastreamento
  // (central de ajuda da Kiwify: src, sck, utm_* e s1, s2, s3).
  var PARAMETROS_KIWIFY = [
    "src", "sck",
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "s1", "s2", "s3"
  ];

  var CHAVE_COOKIES = "musas21-cookies";
  var CHAVE_UTMS = "musas21-utms";

  /* ---------- Utilitários ---------- */

  function pendente(valor) {
    return !valor || /^COLE_AQUI/.test(String(valor).trim());
  }

  function ler(chave, armazenamento) {
    try { return window[armazenamento].getItem(chave); } catch (e) { return null; }
  }

  function gravar(chave, valor, armazenamento) {
    try { window[armazenamento].setItem(chave, valor); } catch (e) { /* sem armazenamento: segue */ }
  }

  var parametrosDaUrl = new URLSearchParams(window.location.search);

  function mostrarAviso(texto) {
    var aviso = document.getElementById("aviso");
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.hidden = false;
    clearTimeout(mostrarAviso.t);
    mostrarAviso.t = setTimeout(function () { aviso.hidden = true; }, 2600);
  }

  /* ---------- Estado da página por data ---------- */

  var estadoForcado = parametrosDaUrl.get("estado");
  if (ESTADOS.indexOf(estadoForcado) === -1) estadoForcado = null;

  var abertura = new Date(C.aberturaInscricoes).getTime();
  var fechamento = new Date(C.fechamentoInscricoes).getTime();

  function calcularEstado() {
    if (estadoForcado) return estadoForcado;
    var agora = Date.now();
    if (agora < abertura) return "espera";
    if (agora <= fechamento) return "aberto";
    return "encerrado";
  }

  var estado = calcularEstado();

  /* ---------- UTMs: guarda e repassa para o checkout ---------- */

  function utmsGuardadas() {
    var atuais = {};
    PARAMETROS_KIWIFY.forEach(function (p) {
      var v = parametrosDaUrl.get(p);
      if (v) atuais[p] = v;
    });
    if (Object.keys(atuais).length) {
      gravar(CHAVE_UTMS, JSON.stringify(atuais), "sessionStorage");
      return atuais;
    }
    try { return JSON.parse(ler(CHAVE_UTMS, "sessionStorage")) || {}; } catch (e) { return {}; }
  }

  var utms = utmsGuardadas();

  function linkCheckout() {
    if (pendente(C.linkCheckout)) return null;
    try {
      var url = new URL(C.linkCheckout);
      Object.keys(utms).forEach(function (p) {
        if (!url.searchParams.has(p)) url.searchParams.set(p, utms[p]);
      });
      return url.toString();
    } catch (e) {
      return C.linkCheckout;
    }
  }

  function destinoDoEstado() {
    if (estado === "aberto") return linkCheckout();
    if (estado === "espera") return pendente(C.linkListaEspera) ? null : C.linkListaEspera;
    return pendente(C.linkProximaTurma) ? null : C.linkProximaTurma;
  }

  /* ---------- Faixa do topo e contagem regressiva ---------- */

  var faixaTexto = document.getElementById("faixa-texto");
  var faixaContagem = document.getElementById("faixa-contagem");

  function doisDigitos(n) { return (n < 10 ? "0" : "") + n; }

  function atualizarContagem() {
    if (estado !== "aberto") { faixaContagem.hidden = true; return; }
    var alvo = estadoForcado && Date.now() > fechamento ? Date.now() + 3 * 864e5 : fechamento;
    var resto = Math.max(0, Math.floor((alvo - Date.now()) / 1000));
    var d = Math.floor(resto / 86400);
    var h = Math.floor((resto % 86400) / 3600);
    var m = Math.floor((resto % 3600) / 60);
    var s = resto % 60;
    faixaContagem.innerHTML =
      "<b>" + d + "d</b><b>" + doisDigitos(h) + "h</b><b>" + doisDigitos(m) + "m</b><b>" + doisDigitos(s) + "s</b>";
    faixaContagem.hidden = false;
  }

  function aplicarFaixa() {
    var textos = { espera: C.faixaListaEspera, aberto: C.faixaAberto, encerrado: C.faixaEncerrado };
    faixaTexto.textContent = textos[estado] || "";
    atualizarContagem();
  }

  /* ---------- Botões ---------- */

  var botoes = Array.prototype.slice.call(document.querySelectorAll("[data-cta]"));

  function textoDoBotao(botao) {
    if (estado === "espera") return C.botaoListaEspera;
    if (estado === "encerrado") return C.botaoEncerrado;
    if (botao.getAttribute("data-cta") === "barra" && C.botaoBarraFixaAberto) return C.botaoBarraFixaAberto;
    return botao.getAttribute("data-texto-aberto");
  }

  function aplicarBotoes() {
    var destino = destinoDoEstado();
    botoes.forEach(function (botao) {
      botao.textContent = textoDoBotao(botao);
      botao.href = destino || "#link-pendente";
      botao.toggleAttribute("data-pendente", !destino);
    });

    // Textos que só fazem sentido com as inscrições abertas
    Array.prototype.forEach.call(document.querySelectorAll("[data-somente-aberto]"), function (el) {
      el.hidden = estado !== "aberto";
    });
  }

  document.addEventListener("click", function (evento) {
    var botao = evento.target.closest("[data-cta]");
    if (!botao) return;

    if (botao.hasAttribute("data-pendente")) {
      evento.preventDefault();
      mostrarAviso("Link ainda não preenchido no config.js");
      return;
    }

    if (estado === "aberto" && window.fbq) {
      // Dá tempo do pixel registrar antes de sair da página
      evento.preventDefault();
      window.fbq("track", "ViewContent");
      window.fbq("track", "InitiateCheckout");
      var destino = botao.href;
      setTimeout(function () { window.location.href = destino; }, 300);
    }
  });

  /* ---------- VSL ---------- */

  function montarVsl() {
    var vsl = document.getElementById("vsl");
    var hero = document.getElementById("hero");
    var formato = C.formatoVsl === "horizontal" ? "horizontal" : "vertical";
    vsl.setAttribute("data-formato", formato);
    hero.classList.add("hero--" + formato);

    var codigo = (C.embedVsl || "").trim();
    if (!codigo) return;

    var conteudo = document.createElement("div");
    conteudo.className = "vsl__conteudo";
    conteudo.innerHTML = codigo;

    // Scripts colados via innerHTML não rodam: recria cada um
    Array.prototype.forEach.call(conteudo.querySelectorAll("script"), function (antigo) {
      var novo = document.createElement("script");
      Array.prototype.forEach.call(antigo.attributes, function (a) { novo.setAttribute(a.name, a.value); });
      novo.text = antigo.text;
      antigo.parentNode.replaceChild(novo, antigo);
    });

    vsl.innerHTML = "";
    vsl.appendChild(conteudo);
  }

  function atrasarPrimeiroBotao() {
    var segundos = Number(C.atrasoPrimeiroBotao) || 0;
    if (segundos <= 0) return;
    var primeiro = document.querySelector('[data-cta="hero"]');
    if (!primeiro) return;
    primeiro.hidden = true;
    setTimeout(function () {
      primeiro.hidden = false;
      primeiro.classList.add("botao--aparecendo");
    }, segundos * 1000);
  }

  /* ---------- Garantia e link do acompanhamento ---------- */

  function aplicarGarantia() {
    if (C.mostrarGarantia !== true) return;
    document.getElementById("garantia-texto").textContent = C.textoGarantia || "";
    document.getElementById("garantia").hidden = false;
  }

  function aplicarLinkIndividual() {
    var link = document.getElementById("link-individual");
    if (pendente(C.linkAcompanhamentoIndividual)) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        mostrarAviso("Link ainda não preenchido no config.js");
      });
      return;
    }
    link.href = C.linkAcompanhamentoIndividual;
  }

  /* ---------- Barra fixa no celular ---------- */

  function ativarBarraFixa() {
    var barra = document.getElementById("barra-fixa");
    var hero = document.getElementById("hero");
    var botaoBarra = barra.querySelector("[data-cta]");
    if (!("IntersectionObserver" in window)) return;

    new IntersectionObserver(function (entradas) {
      var passou = !entradas[0].isIntersecting && entradas[0].boundingClientRect.top < 0;
      barra.classList.toggle("barra-fixa--visivel", passou);
      barra.setAttribute("aria-hidden", passou ? "false" : "true");
      botaoBarra.tabIndex = passou ? 0 : -1;
      document.body.classList.toggle("com-barra", passou);
    }).observe(hero);
  }

  /* ---------- Pixel da Meta e aviso de cookies ---------- */

  var pixelCarregado = false;

  function carregarPixel() {
    if (pixelCarregado || pendente(C.pixelId)) return;
    pixelCarregado = true;
    /* Código padrão do Pixel da Meta */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0";
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", String(C.pixelId).trim());
    window.fbq("track", "PageView");
  }

  function iniciarCookies() {
    var aviso = document.getElementById("cookies");
    var escolha = ler(CHAVE_COOKIES, "localStorage");
    var exigeConsentimento = C.pixelSomenteComConsentimento !== false;

    if (escolha === "aceito" || (!exigeConsentimento && escolha !== "recusado")) carregarPixel();
    if (!escolha) aviso.hidden = false;

    aviso.addEventListener("click", function (e) {
      var botao = e.target.closest("[data-cookies]");
      if (!botao) return;
      var valor = botao.getAttribute("data-cookies");
      gravar(CHAVE_COOKIES, valor, "localStorage");
      aviso.hidden = true;
      if (valor === "aceito") carregarPixel();
    });
  }

  /* ---------- Selo de teste (?estado=...) ---------- */

  function mostrarSeloTeste() {
    if (!estadoForcado) return;
    var selo = document.createElement("div");
    selo.className = "selo-teste";
    selo.textContent = "Teste: " + estadoForcado;
    document.body.appendChild(selo);
  }

  /* ---------- Início ---------- */

  function aplicarEstado() {
    aplicarFaixa();
    aplicarBotoes();
  }

  montarVsl();
  aplicarEstado();
  atrasarPrimeiroBotao();
  aplicarGarantia();
  aplicarLinkIndividual();
  ativarBarraFixa();
  iniciarCookies();
  mostrarSeloTeste();

  // A cada segundo: atualiza a contagem e troca de estado sozinha na hora certa
  setInterval(function () {
    var novo = calcularEstado();
    if (novo !== estado) { estado = novo; aplicarEstado(); }
    else atualizarContagem();
  }, 1000);
})();
