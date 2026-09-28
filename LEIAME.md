# Projeto Musas 21: página de vendas

Página de vendas do desafio Musas 21. É um site simples (HTML, CSS e JavaScript), sem instalação e sem etapa de build.

## O que tem em cada arquivo

| Arquivo | Para que serve | Você mexe? |
|---|---|---|
| `config.js` | Links, datas, ID do pixel, VSL, garantia | **Sim, é o principal** |
| `index.html` | Todos os textos da página de vendas | Sim, para trocar textos e fotos |
| `politica-de-privacidade.html` | Política de privacidade | Sim, para preencher seus dados |
| `tokens.css` | Cores, fontes e raios da identidade visual | Só se quiser mudar a identidade |
| `estilos/` | Layout da página | Não precisa |
| `scripts/app.js` | Funcionamento (datas, botões, pixel, contagem) | Não precisa |
| `imagens/` | Fotos e ícone da aba | Sim, para colocar as fotos |

Para editar direto no GitHub: abra o arquivo, clique no ícone de lápis, faça a mudança e clique em **Commit changes**. Depois de um ou dois minutos, a Cloudflare publica a nova versão sozinha.

---

## 1. Como trocar links, datas e opções (`config.js`)

Abra o `config.js`. Tudo que começa com `COLE_AQUI` ainda precisa ser preenchido. Troque **só o que está entre aspas** e não apague vírgulas nem chaves.

```js
linkCheckout: "https://pay.kiwify.com.br/SEU_CODIGO",
```

**Datas:** use o formato `2026-10-18T20:00:00-03:00` (ano-mês-dia, a letra T, hora, e `-03:00` no final, que é o fuso de São Paulo). Não apague o `-03:00`.

**VSL:** cole o código de incorporação que o player te dá **entre as crases** (`` ` ``), assim:

```js
embedVsl: `<iframe src="https://..."></iframe>`,
formatoVsl: "vertical",       // ou "horizontal"
atrasoPrimeiroBotao: 0,       // em segundos; 0 = o botão aparece na hora
```

O atraso começa a contar quando a página abre. Não depende de quanto do vídeo a pessoa assistiu.

**Pixel:** cole só o número do ID em `pixelId`. Com `pixelSomenteComConsentimento: true`, o pixel só liga depois que a pessoa clica em "Aceitar" no aviso de cookies.

## 2. Como trocar os textos (`index.html`)

Abra o `index.html` e use a busca do navegador (Ctrl+F, ou Cmd+F no Mac) para achar a frase que quer mudar. Troque só o texto, sem mexer no que está entre `<` e `>`.

- Os trechos que ainda faltam preencher estão dentro de `<mark class="ph">[...]</mark>`. Quando for preencher, apague também o `<mark class="ph">` e o `</mark>`, para o destaque sumir.
- Palavras dentro de `<em>...</em>` aparecem na fonte itálica de destaque.

Os textos que **mudam conforme a data** (faixa do topo e textos dos botões na lista de espera e no encerramento) ficam no `config.js`.

## 3. Como colocar as fotos

1. Deixe a foto em formato retrato (4:5), com **800 × 1000 px**.
2. Converta para **WebP** no site [squoosh.app](https://squoosh.app): arraste a foto, escolha "WebP" à direita, qualidade por volta de 75, e baixe.
3. Salve na pasta `imagens/`, com um nome simples e sem acento, por exemplo `rafaela.webp`.
4. No `index.html`, procure `[Foto: Rafaela Schumacher]` e troque a linha inteira da `<div class="foto ...">...</div>` por:

```html
<img class="foto-real" src="imagens/rafaela.webp" alt="Rafaela Schumacher" width="800" height="1000" loading="lazy">
```

Faça o mesmo com a foto da Fran.

## 4. Como testar os três estados

A página muda sozinha conforme a data:

| Estado | Quando | Faixa do topo | Botões levam para |
|---|---|---|---|
| Lista de espera | antes de 18/10 às 20h | "As inscrições abrem em 18/10, às 20h" | Lista de espera (WhatsApp) |
| Inscrições abertas | 18/10 às 20h até 22/10 às 23h59 | Texto + contagem regressiva | Checkout da Kiwify |
| Encerrado | depois de 22/10 às 23h59 | "Inscrições encerradas" | Lista da próxima turma |

Para ver cada estado sem esperar a data, acrescente no fim do endereço:

- `?estado=espera`
- `?estado=aberto`
- `?estado=encerrado`

Exemplo: `https://seudominio.com.br/?estado=aberto`. Um selo "Teste" aparece no canto enquanto você testa. Sem o `?estado=`, a página volta a seguir as datas.

Enquanto um link não estiver preenchido no `config.js`, o botão mostra o aviso "Link ainda não preenchido no config.js".

## 5. Como ligar a garantia

No `config.js`:

```js
mostrarGarantia: true,
textoGarantia: "Seu texto da garantia aqui.",
```

Para esconder de novo, volte para `false`.

## 6. Rastreamento: o que você precisa saber

- **Na página:** o Pixel da Meta registra `PageView` ao abrir e `ViewContent` + `InitiateCheckout` ao clicar em qualquer botão que leva ao checkout (só no estado "inscrições abertas").
- **A compra (Purchase) NÃO é registrada por esta página.** Ela é registrada pelo pixel que você configura **dentro da Kiwify**, nas configurações do produto. **Não esqueça de configurar o pixel lá.**
- **UTMs:** os parâmetros do link do anúncio são repassados para o checkout. A página repassa só os que a central de ajuda da Kiwify diz que o checkout aceita: `src`, `sck`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `s1`, `s2` e `s3`. Vale conferir esse artigo da Kiwify de vez em quando, porque essa lista pode mudar.
- Se o pixel da Kiwify também enviar `InitiateCheckout` quando o checkout abre, esse evento pode contar duas vezes no Gerenciador de Eventos. Confira lá depois do primeiro teste.

## 7. Como publicar na Cloudflare Pages (conectando o GitHub)

> As telas da Cloudflare mudam com frequência. Se algum nome abaixo estiver diferente, procure a opção mais parecida.

1. Crie uma conta gratuita em [dash.cloudflare.com](https://dash.cloudflare.com).
2. No menu lateral, abra **Workers & Pages** e clique em **Create** (Criar).
3. Escolha a aba **Pages** e depois **Connect to Git** (Conectar ao Git).
4. Autorize a Cloudflare a acessar o seu GitHub. Pode dar acesso só a este repositório (`projeto-musas-21-dias`); funciona com repositório privado.
5. Selecione o repositório e clique em **Begin setup**.
6. Na configuração:
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** deixe **vazio**
   - **Build output directory:** `/`
7. Clique em **Save and Deploy**. Em um ou dois minutos, a página fica no ar num endereço do tipo `projeto-musas-21-dias.pages.dev`.

A partir daí, toda alteração salva na branch `main` do GitHub é publicada sozinha.

## 8. Como ligar o seu domínio

1. No projeto da Cloudflare Pages, abra a aba **Custom domains** e clique em **Set up a custom domain**.
2. Digite o domínio (por exemplo, `musas21.com.br`) e siga os passos.
3. **Se o domínio já está na Cloudflare:** ela configura tudo sozinha.
4. **Se o domínio está em outro lugar (Registro.br, Hostinger, GoDaddy...):** a Cloudflare vai mostrar um registro **CNAME** apontando para `seu-projeto.pages.dev`. Entre no painel onde comprou o domínio, na parte de DNS, e crie esse registro exatamente como a Cloudflare mostrar.
5. A ativação pode levar de alguns minutos a algumas horas. O cadeado de segurança (https) é criado sozinho.

## 9. Checklist antes de lançar

- [ ] Todos os `COLE_AQUI` do `config.js` preenchidos
- [ ] Nenhum `[...]` com destaque sobrando no `index.html` e na política de privacidade
- [ ] Fotos trocadas
- [ ] Testados `?estado=espera`, `?estado=aberto` e `?estado=encerrado` no celular, clicando em cada botão
- [ ] Pixel da Meta testado (extensão "Meta Pixel Helper" ou "Testar eventos" no Gerenciador de Eventos)
- [ ] Pixel configurado **dentro da Kiwify** para registrar a compra
- [ ] Texto da política de privacidade revisado (idealmente por alguém da área jurídica)
