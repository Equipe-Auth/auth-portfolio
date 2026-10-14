# Portfólio da Equipe AUTH

Site estático (GitHub Pages) com três páginas:

| Página | Para quê |
|---|---|
| `formulario.html` | Cada integrante preenche o seu perfil. Os dados vão para uma planilha Google. |
| `index.html` | Portfólio web. Monta tudo sozinho a partir da planilha. |
| `pdf.html` | Versão A4 (capa + 5 laudas, Arial 12 pt, espaçamento 1,5) para exportar o PDF da entrega por escrito. |

Enquanto `API_URL` estiver vazio em `config.js`, o site roda em **modo demonstração**, com dados de exemplo.

## 1. Planilha + Apps Script (≈10 min)

1. Crie uma planilha nova no Google Sheets (ex.: "AUTH · Portfólio").
2. Menu **Extensões → Apps Script**. Apague o conteúdo de `Code.gs` e cole o arquivo `apps-script/Code.gs` deste projeto. Salve.
3. **Implantar → Nova implantação →** engrenagem → **App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
4. Clique em Implantar e autorize (o Google vai avisar que o app não é verificado: *Avançado → Acessar*). O script precisa da planilha e do Drive (para salvar as fotos).
5. Copie a **URL do app da Web** (termina em `/exec`).
6. Abra `config.js` e cole essa URL em `API_URL: '...'`.

A aba "Respostas" é criada sozinha no primeiro envio. As fotos ficam na pasta "AUTH · Fotos do portfólio" no seu Drive, compartilhadas como "qualquer pessoa com o link" para aparecerem no site.

> Se alterar o `Code.gs` depois: **Implantar → Gerenciar implantações → lápis → Versão: Nova versão → Implantar**. A URL continua a mesma.

## 2. GitHub Pages (≈5 min)

1. Crie um repositório público no GitHub (ex.: `auth-portfolio`).
2. Envie todos os arquivos desta pasta (pode arrastar no navegador: *Add file → Upload files*). A pasta `apps-script/` pode ir junto, não atrapalha.
3. **Settings → Pages → Source: Deploy from a branch → main / (root) → Save.**
4. Em 1–2 minutos o site fica em `https://SEU-USUARIO.github.io/auth-portfolio/`.

Link para mandar ao grupo: `https://SEU-USUARIO.github.io/auth-portfolio/formulario.html`

Dica: dá para mandar um link já com o nome selecionado, ex.: `formulario.html?nome=Igor%20Farina`.

## 3. Gerar o PDF

1. Abra `pdf.html`. A barra no topo avisa se alguma página estourou o espaço (contorno terracota). Se estourar, encurte o texto dessa parte na planilha ou peça para a pessoa reenviar o formulário.
2. Clique em **Exportar PDF** → Destino **Salvar como PDF** → Margens **Nenhuma** → marque **Gráficos de fundo**. Use o Chrome ou o Edge.

## Ajustes em `config.js`

- `MANIFESTO`: texto "Quem somos". Reescreva depois que todos preencherem (até ~350 caracteres).
- `CASO_DESTAQUE`: nome de quem terá o caso real em destaque (vazio = o primeiro preenchido).
- `AREAS`: as 7 áreas do mapa de complementaridade.
- `DATA`, `DISCIPLINA`, `FRASE_FINAL`.

## Regras e observações

- Reenviar o formulário substitui a resposta anterior da mesma pessoa (o histórico fica na planilha). Ao escolher o nome, o formulário recarrega as respostas anteriores.
- Os limites de caracteres foram calibrados para o pior caso (todos os campos no máximo) caber em capa + 5 laudas em Arial 12 pt.
- Regra da entrega por escrito: 2 a 5 laudas (sem capa e referências), PDF, Times New Roman ou Arial 12, espaçamento 1,5. Se a entrega for a página web, a fonte passa a ser 16. Inclua a declaração de participação (já está no fim do portfólio).
- O formulário é público para quem tiver o link, mas o script só aceita os 4 nomes da equipe.
