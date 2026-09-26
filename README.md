# Convite de Casamento — Milena & Maikon

Convite digital interativo, pensado primeiro para celulares. A experiência começa com um envelope animado e apresenta os detalhes do casamento, galeria, contagem regressiva, mapa, confirmação por WhatsApp e música de fundo opcional.

**Site publicado:** [itsmemaikon.github.io/convite-casamento-maikon-milena](https://itsmemaikon.github.io/convite-casamento-maikon-milena/)

## Recursos

- Layout mobile-first e responsivo;
- Abertura de envelope com animações leves e suporte a `prefers-reduced-motion`;
- Saudação personalizada por parâmetro na URL;
- Música iniciada somente após interação do visitante;
- Contagem regressiva para o casamento;
- Galeria com carrossel, legendas, controles e avanço automático;
- Botão para adicionar o evento à agenda;
- Localização no Google Maps;
- Confirmação de presença por WhatsApp;
- Publicação automática com GitHub Pages a cada envio para a branch `main`.

## Tecnologias

- React 19
- Next.js 16 com exportação estática
- TypeScript
- CSS tradicional, sem dependências de animação pesadas
- GitHub Actions + GitHub Pages

## Executar localmente

### Pré-requisitos

- Node.js 22 ou superior
- npm

### Instalação

```bash
git clone https://github.com/itsmemaikon/convite-casamento-maikon-milena.git
cd convite-casamento-maikon-milena
npm install
npm run dev
```

Em seguida, abra o endereço informado no terminal — normalmente `http://localhost:5173`.

Para disponibilizar o teste no celular usando a mesma rede Wi‑Fi, inicie o servidor expondo a rede local conforme a configuração suportada pelo seu ambiente e acesse o IP exibido pelo terminal.

## Personalização do convite

O conteúdo principal está centralizado em:

[`data/wedding-data.ts`](data/wedding-data.ts)

Edite esse arquivo para alterar:

- nomes dos noivos, data, horário, local e endereço;
- número e mensagem do WhatsApp;
- link do Google Maps;
- textos de todas as seções;
- data da contagem regressiva;
- informações dos cartões em “Alguns detalhes”;
- imagens, textos alternativos e legendas da galeria;
- intervalo de troca automática do carrossel, em `copy.gallery.autoAdvanceMs` (milissegundos);
- caminho da música, em `music`.

### Convite personalizado por convidado

Use o parâmetro configurado em `guestQueryParam` (atualmente `convidado`) na URL:

```text
https://itsmemaikon.github.io/convite-casamento-maikon-milena/?convidado=Maria
```

Para mais de uma pessoa, separe os nomes por `e` ou vírgula:

```text
...?convidado=Maria%20e%20João
```

O convite mostrará “Olá” em uma linha, os nomes na seguinte e adaptará a frase para “Vocês receberam um convite”.

## Imagens, música e fontes

Os arquivos públicos ficam em `public/`:

```text
public/
├── foto-casal.jpg             # imagem de fundo da abertura principal
├── foto-local.jpg             # imagem da seção Onde será
├── musica-casamento.mp3       # música opcional
├── casamento-milena-maikon.ics # arquivo para adicionar à agenda
├── gallery/                   # imagens do carrossel
└── *.woff2                    # fontes personalizadas
```

Para adicionar uma foto à galeria:

1. Coloque o arquivo em `public/gallery/`;
2. Acrescente um item em `galleryImages`, no arquivo de configuração;
3. Informe `src`, `alt` e, se desejar, `caption`.

Exemplo:

```ts
{
  src: "/gallery/foto-23.jpg",
  alt: "Milena e Maikon em um passeio",
  caption: "Uma lembrança especial.",
}
```

Para trocar a música, substitua `public/musica-casamento.mp3` e mantenha o mesmo nome, ou atualize a propriedade `music` no arquivo de configuração. Em celulares, a reprodução começa apenas depois do toque que abre o envelope, seguindo as regras dos navegadores.

## Cores e tipografia

As variáveis de cor estão no topo de [`app/globals.css`](app/globals.css), dentro de `:root`:

```css
:root {
  --ink: #173b39;
  --ink-deep: #0c2a29;
  --paper: #f4efe5;
  --paper-light: #fbf8f0;
  --gold: #b38b49;
  --gold-light: #d8bd83;
}
```

As fontes personalizadas também são declaradas nesse arquivo. A fonte da saudação é **Brother Signature**; os nomes na seção inicial usam **Tempting**.

## Publicação no GitHub Pages

O workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) publica automaticamente o site quando há um novo envio para `main`.

Depois de alterar o convite:

```bash
git add .
git commit -m "Atualiza convite"
git push
```

O GitHub Actions gera a versão estática e a publica em poucos minutos. O status pode ser acompanhado na aba **Actions** do repositório.

> A primeira configuração do GitHub Pages deve usar a fonte **GitHub Actions**, em **Settings → Pages**.

## Build de produção

Para validar a versão que será hospedada:

```bash
npm run build
```

O site estático é criado na pasta `out/`, que não é versionada.

## Estrutura relevante

```text
app/
├── globals.css                # identidade visual, layout e animações
├── layout.tsx                 # metadados da página
└── page.tsx                   # componentes e interações do convite
data/
└── wedding-data.ts            # todos os dados e textos configuráveis
public/
└── ...                        # fotos, música, fontes e calendário
.github/workflows/
└── deploy-pages.yml           # publicação automática
```

## Licença

Projeto pessoal criado para o casamento de Milena e Maikon.
