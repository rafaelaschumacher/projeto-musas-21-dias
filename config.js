/* =========================================================
   CONFIG — Musas 21
   Aqui ficam todos os links, datas, IDs e opções da página.
   Troque só o que está entre aspas. Não apague vírgulas nem chaves.
   Tudo que começa com "COLE_AQUI" ainda precisa ser preenchido.
   ========================================================= */

window.MUSAS_CONFIG = {

  /* ---------- DATAS (fuso America/Sao_Paulo = -03:00) ----------
     Formato: ANO-MÊS-DIAThora:minuto:segundo-03:00
     Não apague o "-03:00" do final. */
  aberturaInscricoes: "2026-10-18T20:00:00-03:00",
  fechamentoInscricoes: "2026-10-22T23:59:59-03:00",

  /* ---------- LINKS ---------- */
  linkCheckout: "COLE_AQUI_O_LINK_DO_CHECKOUT_KIWIFY",
  linkListaEspera: "COLE_AQUI_O_LINK_DA_LISTA_DE_ESPERA_NO_WHATSAPP",
  linkProximaTurma: "COLE_AQUI_O_LINK_DA_LISTA_DA_PROXIMA_TURMA",
  linkAcompanhamentoIndividual: "COLE_AQUI_O_LINK_DO_ACOMPANHAMENTO_INDIVIDUAL",

  /* ---------- TEXTOS QUE MUDAM CONFORME O ESTADO ---------- */
  faixaListaEspera: "As inscrições abrem em 18/10, às 20h",
  faixaAberto: "Inscrições abertas até 22/10, às 23h59. O desafio começa em 26/10.",
  faixaEncerrado: "Inscrições encerradas",
  botaoListaEspera: "Entrar na lista de espera",
  botaoEncerrado: "Entrar na lista da próxima turma",
  botaoBarraFixaAberto: "Quero entrar",

  /* ---------- VSL (vídeo) ----------
     embedVsl: cole entre as crases (`) o código de incorporação do player.
     formatoVsl: "vertical" (9:16) ou "horizontal" (16:9).
     atrasoPrimeiroBotao: segundos até o primeiro botão aparecer (0 = na hora).
     A contagem começa quando a página abre. */
  embedVsl: ``,
  formatoVsl: "vertical",
  atrasoPrimeiroBotao: 0,

  /* ---------- PIXEL DA META ----------
     pixelSomenteComConsentimento: true = o pixel só liga depois que a pessoa
     clica em "Aceitar" no aviso de cookies. false = liga ao abrir a página. */
  pixelId: "COLE_AQUI_O_ID_DO_PIXEL",
  pixelSomenteComConsentimento: true,

  /* ---------- GARANTIA ---------- */
  mostrarGarantia: false,
  textoGarantia: "COLE_AQUI_O_TEXTO_DA_GARANTIA"
};
