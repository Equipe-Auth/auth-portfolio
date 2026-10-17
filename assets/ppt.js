/* Gera a apresentação do portfólio (PowerPoint) no navegador, com os dados atuais da planilha.
   Regra da entrega em PowerPoint: 2 a 5 slides sem contar a capa, Arial ou Times 16–18 pt.
   Por isso todo o texto usa Arial com no mínimo 16 pt (títulos maiores). */
(function () {
  const PPTX_JS = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
  const NAVY = '121C3A', NAVY2 = '1C2850', AZUL = '1F5FD6', CINZA = 'F1F2F4', TXT2 = '5A5E66', LINHA = 'D5D8DE', CEU = '6FC3FF', LARANJA = 'F08A1C';
  const F = 'Arial', MIN = 16;
  // O desenho usa unidades de um slide 10 × 5,625; tudo é ampliado (S) para o formato widescreen 13,33 × 7,5.
  // A fonte não é ampliada: o espaço extra é o que permite manter o texto em 16 pt.
  const W = 10, H = 5.625, S = 13.333 / 10;

  const loadScript = src => new Promise((ok, fail) => {
    const s = document.createElement('script'); s.src = src; s.onload = ok;
    s.onerror = () => fail(new Error('Não foi possível carregar ' + src)); document.head.appendChild(s);
  });
  const blobToData = b => new Promise(ok => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(b); });
  const dims = data => new Promise(ok => { const im = new Image(); im.onload = () => ok({ w: im.naturalWidth, h: im.naturalHeight }); im.onerror = () => ok(null); im.src = data; });

  // Imagem → { data: 'image/...;base64,...', w, h } (fotos do Drive vêm pelo backend)
  async function carregar(url, C) {
    if (!url) return null;
    try {
      let data;
      if (/drive\.google\.com\/thumbnail/.test(url)) {
        const id = new URL(url).searchParams.get('id');
        const r = await (await fetch(C.API_URL + '?action=foto&id=' + encodeURIComponent(id))).json();
        if (!r.ok) return null;
        data = r.data;
      } else {
        data = await blobToData(await (await fetch(url)).blob());
      }
      const d = await dims(data);
      return d ? { data: data.replace(/^data:/, ''), ...d } : null;
    } catch (e) { return null; }
  }
  function gradiente(vertical) {
    const cv = document.createElement('canvas'); cv.width = vertical ? 8 : 800; cv.height = vertical ? 600 : 8;
    const ctx = cv.getContext('2d');
    const g = vertical ? ctx.createLinearGradient(0, 0, 0, 600) : ctx.createLinearGradient(0, 0, 800, 0);
    ['#1F5FD6', '#13A3AF', '#6CC24A', '#F08A1C', '#E4237A'].forEach((c, i) => g.addColorStop(i / 4, c));
    ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height);
    return cv.toDataURL('image/png').replace(/^data:/, '');
  }
  // Estimativa de linhas de texto Arial (largura média ≈ 0,5 em)
  const linhas = (txt, w, pt) => Math.max(1, Math.ceil((String(txt).length * pt * 0.5 / 72) / (w * S * 0.93)));
  const alt = (txt, w, pt) => linhas(txt, w, pt) * pt * 1.2 / 72 / S;
  // Slide com coordenadas em unidades do desenho, convertidas para o formato widescreen
  const esc = o => { const r = { ...o }; ['x', 'y', 'w', 'h'].forEach(k => { if (typeof r[k] === 'number') r[k] *= S; }); if (r.sizing) r.sizing = { ...r.sizing, w: r.sizing.w * S, h: r.sizing.h * S }; return r; };
  const wrap = sl => ({
    addText: (t, o) => sl.addText(t, esc(o)), addShape: (sh, o) => sl.addShape(sh, esc(o)), addImage: o => sl.addImage(esc(o)),
    addNotes: n => sl.addNotes(n), set background(b) { sl.background = b; }
  });

  async function gerar(btn) {
    const { C, SOFT, loadTeam, derive } = window.AUTH;
    const rotulo = btn ? btn.textContent : '';
    if (btn) { btn.textContent = 'Gerando…'; btn.style.pointerEvents = 'none'; }
    try {
      if (!window.PptxGenJS) await loadScript(PPTX_JS);
      const { membros } = await loadTeam();
      const D = derive(membros);
      const short = n => { const w = String(n).split(' '); return w.length > 2 ? w[0] + ' ' + w[w.length - 1] : n; };
      const hex = c => String(c || AZUL).replace('#', '').toUpperCase();

      const logo = await carregar('assets/logo-auth.png', C);
      const fotos = await Promise.all(membros.map(m => carregar(m.foto, C)));
      const faixaH = gradiente(false), faixaV = gradiente(true);

      const pres = new window.PptxGenJS();
      pres.layout = 'LAYOUT_WIDE';
      pres.title = 'Portfólio da Equipe AUTH – Processo Seletivo Argo Menthor';
      pres.author = 'Equipe AUTH';
      pres.theme = { headFontFace: F, bodyFontFace: F };

      const T = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, fontFace: F, fontSize: MIN, color: NAVY, valign: 'top', ...o });
      const foto = (s, k, x, y, w, h, circulo) => {
        const f = fotos[k];
        if (!f) { s.addShape(pres.shapes[circulo ? 'OVAL' : 'RECTANGLE'], { x, y, w, h, fill: { color: CINZA }, line: { color: LINHA } }); return; }
        const r = f.w / f.h, bw = w, bh = h; // cobre a caixa (cover), recortando o excesso
        const iw = r > bw / bh ? bh * r : bw, ih = r > bw / bh ? bh : bw / r;
        s.addImage({ data: f.data, x, y, w: iw, h: ih, sizing: { type: 'cover', w: bw, h: bh }, rounding: !!circulo, altText: membros[k].nome });
      };
      const logoImg = (s, x, y, w) => logo && s.addImage({ data: logo.data, x, y, w, h: w * logo.h / logo.w, altText: 'AUTH' });
      const cabecalho = (s, titulo) => {
        s.background = { color: CINZA };
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.78, fill: { color: 'FFFFFF' }, line: { color: 'FFFFFF' } });
        T(s, titulo.toUpperCase(), { x: 0.5, y: 0.2, w: 7.5, h: 0.4, bold: true, color: AZUL, charSpacing: 1, valign: 'middle' });
        logoImg(s, 9.0, 0.1, 0.62);
        s.addImage({ data: faixaH, x: 0, y: 0.78, w: W, h: 0.06, altText: '' });
      };

      // ---------- Capa ----------
      let s = wrap(pres.addSlide());
      s.background = { color: 'FFFFFF' };
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.45, h: H, fill: { color: NAVY }, line: { color: NAVY } });
      s.addImage({ data: faixaV, x: 0, y: H * 0.55, w: 0.45, h: H * 0.45, altText: '' });
      s.addShape(pres.shapes.RECTANGLE, { x: 6.75, y: 0, w: W - 6.75, h: H, fill: { color: CINZA }, line: { color: CINZA } });
      logoImg(s, 7.25, 1.1, 2.25);
      T(s, C.SLOGAN || '', { x: 6.95, y: 3.25, w: 2.85, h: 0.6, align: 'center', color: '3A3E46' });
      T(s, 'MBA ONLINE FGV · ' + String(C.DATA || '').toUpperCase(), { x: 0.85, y: 0.45, w: 5.6, h: 0.35, bold: true, color: AZUL, charSpacing: 1 });
      T(s, [{ text: 'Portfólio da Equipe ', options: {} }, { text: 'AUTH', options: { color: AZUL } }, { text: ' – Processo Seletivo Argo Menthor', options: {} }],
        { x: 0.85, y: 0.95, w: 5.6, h: 1.55, fontSize: 32, bold: true });
      s.addImage({ data: faixaH, x: 0.85, y: 2.6, w: 1.5, h: 0.08, altText: '' });
      membros.forEach((m, k) => {
        const d = membros.length > 4 ? 0.6 : 0.75, passo = membros.length > 4 ? 0.82 : 1.0;
        const x = 0.85 + (k % 2) * 2.85, y = (membros.length > 4 ? 2.9 : 3.05) + Math.floor(k / 2) * passo;
        s.addShape(pres.shapes.OVAL, { x: x - 0.04, y: y - 0.04, w: d + 0.08, h: d + 0.08, fill: { color: hex(m.cor) }, line: { color: hex(m.cor) } });
        foto(s, k, x, y, d, d, true);
        T(s, [{ text: m.n, options: { bold: true, color: hex(m.cor), breakLine: true } }, { text: m.nome, options: { bold: true } }], { x: x + d + 0.15, y: y + d / 2 - 0.42, w: 2.7 - d, h: 0.85, valign: 'middle' });
      });
      s.addNotes('Capa: equipe AUTH e integrantes.');

      // ---------- 1 · Quem somos ----------
      s = wrap(pres.addSlide()); cabecalho(s, '01 · Quem somos');
      T(s, C.MANIFESTO, { x: 0.5, y: 1.1, w: 9.0, h: alt(C.MANIFESTO, 9.0, 20) + 0.1, fontSize: 20 });
      const mvY = 2.45;
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: mvY, w: W, h: H - mvY, fill: { color: NAVY }, line: { color: NAVY } });
      [['Missão', C.MISSAO], ['Visão', C.VISAO]].forEach(([t, txt], k) => {
        const x = 0.5 + k * 3.15;
        T(s, t, { x, y: mvY + 0.3, w: 2.95, h: 0.35, fontSize: 18, bold: true, color: CEU });
        T(s, txt || '', { x, y: mvY + 0.7, w: 2.95, h: 2.3, color: 'D5DAE6' });
      });
      T(s, 'Valores', { x: 6.8, y: mvY + 0.3, w: 2.7, h: 0.35, fontSize: 18, bold: true, color: CEU });
      T(s, (C.VALORES || []).map((v, i, a) => ({ text: v, options: { bullet: true, breakLine: i < a.length - 1 } })), { x: 6.8, y: mvY + 0.7, w: 2.7, h: 2.0, color: 'FFFFFF', paraSpaceAfter: 6 });
      s.addNotes('Quem somos, missão, visão e valores.');

      // ---------- 2 e 3 · Integrantes (larguras proporcionais ao texto) ----------
      const card = (s, m, k, x, w) => {
        const y0 = 0.98, foto_w = 0.85, foto_h = 1.05;
        s.addShape(pres.shapes.RECTANGLE, { x, y: y0, w, h: H - y0 - 0.12, fill: { color: 'FFFFFF' }, line: { color: LINHA, width: 0.75 } });
        s.addShape(pres.shapes.RECTANGLE, { x, y: y0, w, h: 0.07, fill: { color: hex(m.cor) }, line: { color: hex(m.cor) } });
        const ix = x + 0.2, iw = w - 0.4;
        foto(s, k, ix, y0 + 0.25, foto_w, foto_h, false);
        const tx = ix + foto_w + 0.2, tw = iw - foto_w - 0.2;
        const l1 = m.frase || [m.cargo, m.empresa].filter(Boolean).join(' · ');
        const hh = alt(m.n, tw, MIN) + alt(m.nome, tw, 18) + (l1 ? alt(l1, tw, MIN) : 0) + 0.05;
        T(s, [
          { text: m.n, options: { bold: true, color: hex(m.cor), breakLine: true } },
          { text: m.nome, options: { bold: true, fontSize: 18, breakLine: !!l1 } },
          ...(l1 ? [{ text: l1, options: { italic: !!m.frase, bold: !m.frase } }] : [])
        ], { x: tx, y: y0 + 0.2, w: tw, h: Math.max(foto_h + 0.1, hh), valign: 'bottom' });
        let y = y0 + 0.2 + Math.max(foto_h + 0.1, hh) + 0.1;
        if (m.pendente) { T(s, 'Aguardando preenchimento do formulário.', { x: ix, y, w: iw, h: 0.4, color: TXT2 }); return; }
        const l2 = (m.frase ? [m.cargo, m.empresa, m.formacao] : [m.formacao]).filter(Boolean).join(' · ');
        if (l2) { const h = alt(l2, iw, MIN); T(s, l2, { x: ix, y, w: iw, h, color: TXT2 }); y += h + 0.06; }
        if (m.skills.length) { const sk = m.skills.join(' · '); const h = alt(sk, iw, MIN); T(s, sk, { x: ix, y, w: iw, h, bold: true, color: AZUL }); y += h + 0.08; }
        s.addShape(pres.shapes.LINE, { x: ix, y, w: iw, h: 0, line: { color: 'E6E8EC', width: 1 } });
        T(s, m.contrib || '', { x: ix, y: y + 0.08, w: iw, h: H - 0.18 - (y + 0.08) });
      };
      // Altura estimada de um card na largura w
      const altura = (m, w) => {
        const iw = w - 0.4, tw = iw - 1.05, l1 = m.frase || [m.cargo, m.empresa].filter(Boolean).join(' · ');
        const topo = Math.max(1.25, alt(m.nome, tw, 18) + (l1 ? alt(l1, tw, MIN) : 0) + 0.45);
        if (m.pendente) return topo + 0.8;
        const l2 = (m.frase ? [m.cargo, m.empresa, m.formacao] : [m.formacao]).filter(Boolean).join(' · ');
        return topo + (l2 ? alt(l2, iw, MIN) : 0) + (m.skills.length ? alt(m.skills.join(' · '), iw, MIN) : 0) + alt(m.contrib || '', iw, MIN) + 0.4;
      };
      // Escolhe as larguras das colunas que deixam a coluna mais alta com a menor altura
      const GAP = 0.25, MINW = 2.3;
      const larguras = idx => {
        const total = 9.0 - GAP * (idx.length - 1);
        if (idx.length === 1) return { ws: [9.0], h: altura(membros[idx[0]], 9.0) };
        let melhor = { ws: null, h: Infinity };
        const busca = (k, resto, ws) => {
          if (k === idx.length - 1) {
            if (resto < MINW - 1e-9) return;
            const todas = [...ws, resto], h = Math.max(...todas.map((w, j) => altura(membros[idx[j]], w)));
            if (h < melhor.h) melhor = { ws: todas, h };
            return;
          }
          for (let w = MINW; w <= resto - MINW * (idx.length - 1 - k) + 1e-9; w += 0.05) busca(k + 1, resto - w, [...ws, w]);
        };
        busca(0, total, []);
        return melhor;
      };
      const grupo = (titulo, idx, L) => {
        const s = wrap(pres.addSlide()); cabecalho(s, titulo);
        let x = 0.5;
        idx.forEach((k, j) => { card(s, membros[k], k, x, L.ws[j]); x += L.ws[j] + GAP; });
        s.addNotes('Integrantes: formação, hard skills e contribuição de cada um.');
      };
      // Até 4 integrantes: 2 por slide. Com 5: divide em 2 + 3 (ou 3 + 2), o que couber melhor.
      const ids = membros.map((_, i) => i), cortes = ids.length > 4 ? [2, 3] : [Math.min(2, ids.length)];
      let plano = null;
      cortes.forEach(c => {
        const g = [ids.slice(0, c), ids.slice(c)].filter(x => x.length), Ls = g.map(larguras), h = Math.max(...Ls.map(l => l.h));
        if (!plano || h < plano.h) plano = { g, Ls, h };
      });
      plano.g.forEach((g, i) => grupo(`0${i + 2} · Integrantes`, g, plano.Ls[i]));
      window.AUTH_PPT_DEBUG = { grupos: plano.g, alturas: plano.Ls.map(l => +l.h.toFixed(2)), limite: +(H - 0.98 - 0.12).toFixed(2) };

      // ---------- 4 · Complementaridade + 4 competências ----------
      s = wrap(pres.addSlide()); cabecalho(s, '04 · Mapa de complementaridade');
      const mx = 0.5, mw = 5.75, colW = 0.72, nomeW = mw - colW * membros.length;
      T(s, 'Nenhuma frente descoberta', { x: mx, y: 1.0, w: mw, h: 0.45, fontSize: 22, bold: true });
      membros.forEach((m, k) => {
        const x = mx + nomeW + k * colW + (colW - 0.42) / 2;
        s.addShape(pres.shapes.OVAL, { x: x - 0.03, y: 1.5, w: 0.48, h: 0.48, fill: { color: hex(m.cor) }, line: { color: hex(m.cor) } });
        foto(s, k, x, 1.53, 0.42, 0.42, true);
      });
      s.addShape(pres.shapes.LINE, { x: mx, y: 2.08, w: mw, h: 0, line: { color: NAVY, width: 1.5 } });
      const rowH = 0.56;
      D.matrix.forEach((r, i) => {
        const y = 2.15 + i * rowH;
        T(s, r.area, { x: mx, y, w: nomeW - 0.1, h: rowH - 0.05, bold: true, valign: 'middle' });
        r.cells.forEach((c, k) => {
          const cx = mx + nomeW + k * colW + colW / 2;
          if (c === 2) s.addShape(pres.shapes.OVAL, { x: cx - 0.13, y: y + rowH / 2 - 0.16, w: 0.26, h: 0.26, fill: { color: AZUL }, line: { color: AZUL } });
          else if (c === 1) s.addShape(pres.shapes.OVAL, { x: cx - 0.13, y: y + rowH / 2 - 0.16, w: 0.26, h: 0.26, fill: { color: 'FFFFFF' }, line: { color: AZUL, width: 2.5 } });
          else s.addShape(pres.shapes.OVAL, { x: cx - 0.04, y: y + rowH / 2 - 0.07, w: 0.08, h: 0.08, fill: { color: LINHA }, line: { color: LINHA } });
        });
        s.addShape(pres.shapes.LINE, { x: mx, y: y + rowH, w: mw, h: 0, line: { color: 'E6E8EC', width: 1 } });
      });
      T(s, '● especialista   ○ apoio', { x: mx, y: 2.2 + D.matrix.length * rowH, w: mw, h: 0.35, color: TXT2 });
      const px = 6.55;
      s.addShape(pres.shapes.RECTANGLE, { x: px, y: 0.84, w: W - px, h: H - 0.84, fill: { color: NAVY }, line: { color: NAVY } });
      T(s, 'As 4 competências', { x: px + 0.3, y: 1.0, w: W - px - 0.5, h: 0.4, fontSize: 20, bold: true, color: 'FFFFFF' });
      let ky = 1.5;
      D.skills.forEach(k => {
        const tw = W - px - 0.8, quem = k.quem.length ? k.quem.join(' · ') : '[sem integrante ainda]';
        const h = alt(k.label, tw, MIN) + alt(quem, tw, MIN) + 0.16;
        s.addShape(pres.shapes.RECTANGLE, { x: px + 0.3, y: ky, w: W - px - 0.5, h, fill: { color: NAVY2 }, line: { color: NAVY2 } });
        s.addShape(pres.shapes.RECTANGLE, { x: px + 0.3, y: ky, w: 0.07, h, fill: { color: hex(k.cor) }, line: { color: hex(k.cor) } });
        T(s, [{ text: k.label, options: { bold: true, color: 'FFFFFF', breakLine: true } }, { text: quem, options: { color: k.quem.length ? 'C9D2E6' : 'F8B26A' } }], { x: px + 0.5, y: ky + 0.06, w: tw, h: h - 0.1 });
        ky += h + 0.1;
      });
      s.addNotes('Mapa de complementaridade e quem cobre cada uma das 4 competências.');

      // ---------- 5 · Vivência, evidência, caso e fechamento ----------
      s = wrap(pres.addSlide()); cabecalho(s, '05 · Vivência, evidência e fechamento');
      const topY = 1.0, colH = 2.66, VW = 3.6;
      // Vivência
      T(s, 'Vivência multicultural', { x: 0.5, y: topY, w: VW, h: 0.35, bold: true, fontSize: 18 });
      let vy = topY + 0.42; const comTrip = new Set(D.trips.map(t => t.nome)); let restantes = 0;
      D.trips.forEach(t => {
        const cab = `${t.periodo} · ${t.local}`, sub = `${t.intl ? 'Internacional' : 'Nacional'} · ${short(t.nome)}`;
        const h = alt(cab, VW, MIN) + alt(sub, VW, MIN) + alt(t.texto, VW, MIN);
        if (vy + h > topY + colH) { restantes++; return; }
        T(s, [{ text: cab, options: { bold: true, breakLine: true } }, { text: sub, options: { color: AZUL, breakLine: true } }, { text: t.texto }], { x: 0.5, y: vy, w: VW, h });
        vy += h + 0.06;
      });
      const faltam = membros.filter(m => !comTrip.has(m.nome)).map(m => m.nome.split(' ')[0]);
      const extra = [restantes ? `+ ${restantes} no portfólio web` : '', faltam.length ? `Aguardando: ${faltam.join(', ')}` : ''].filter(Boolean).join(' · ');
      if (extra && vy + alt(extra, VW, MIN) <= topY + colH + 0.05) T(s, extra, { x: 0.5, y: vy, w: VW, h: alt(extra, VW, MIN), color: TXT2 });
      // Evidência
      const ev = D.skills.flatMap(k => k.ev.map(v => ({ ...v, k })));
      const ex = 4.3, ew = 3.2;
      s.addShape(pres.shapes.RECTANGLE, { x: ex, y: topY, w: ew, h: colH, fill: { color: 'FFFFFF' }, line: { color: LINHA, width: 0.75 } });
      if (ev.length) {
        const v = ev[0];
        T(s, v.k.label, { x: ex + 0.2, y: topY + 0.15, w: ew - 0.4, h: alt(v.k.label, ew - 0.4, MIN), bold: true, color: hex(v.k.cor) });
        T(s, [{ text: '“' + v.txt + '”', options: { breakLine: true } }, { text: short(v.quem), options: { bold: true } }], { x: ex + 0.2, y: topY + 0.55, w: ew - 0.4, h: colH - 0.65 });
      } else T(s, '[Evidências das competências a preencher no formulário]', { x: ex + 0.2, y: topY + 0.2, w: ew - 0.4, h: 1, color: TXT2 });
      // Caso real
      const cx = 7.75, cw = 1.85, c = D.caso;
      T(s, 'Caso real em destaque', { x: cx, y: topY, w: cw, h: 0.6, bold: true, fontSize: 18 });
      if (c) {
        const res = c.passos.find(p => p[0] === 'Resultado');
        T(s, [{ text: c.titulo, options: { bold: true, breakLine: true } }, { text: short(c.quem), options: { color: TXT2, breakLine: !!res } }, ...(res ? [{ text: res[1] }] : [])], { x: cx, y: topY + 0.65, w: cw, h: colH - 0.65 });
      } else T(s, '[Aguardando um caso real: contexto → desafio → ação → resultado]', { x: cx, y: topY + 0.65, w: cw, h: 1.3, color: 'D41F6F' });
      // Fechamento
      const fy = 3.72;
      s.addShape(pres.shapes.RECTANGLE, { x: 0, y: fy, w: W, h: H - fy, fill: { color: NAVY }, line: { color: NAVY } });
      T(s, [{ text: C.FRASE_FINAL || '', options: {} }, { text: '.', options: { color: LARANJA } }], { x: 0.5, y: fy + 0.18, w: 9, h: 0.45, fontSize: 22, bold: true, color: 'FFFFFF' });
      T(s, 'A equipe AUTH informa que os integrantes a seguir colaboraram efetivamente na realização do desafio:', { x: 0.5, y: fy + 0.68, w: 9, h: 0.5, color: 'D5DAE6' });
      T(s, C.INTEGRANTES.join(' · '), { x: 0.5, y: fy + 1.2, w: 9, h: 0.5, bold: true, color: 'FFFFFF' });
      s.addNotes('Vivência multicultural, evidência de competência, caso real e declaração de participação.');

      await pres.writeFile({ fileName: 'Portfolio_Equipe_AUTH.pptx' });
    } catch (err) {
      alert('Erro ao gerar a apresentação: ' + (err.message || err));
    } finally {
      if (btn) { btn.textContent = rotulo; btn.style.pointerEvents = ''; }
    }
  }

  window.AUTH_PPT = { gerar };
})();
