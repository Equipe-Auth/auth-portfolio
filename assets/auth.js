/* Código compartilhado: dados, API e utilitários. */
(function () {
  const C = window.AUTH_CONFIG;

  const SOFT = [
    { id: 'com', label: 'Relacionamento interpessoal e comunicação', cor: '#1F5FD6', tint: '#E3ECFB', def: 'Construir confiança e alinhar públicos diferentes, das filiais à diretoria.' },
    { id: 'res', label: 'Resiliência', cor: '#E4237A', tint: '#FBE3EE', def: 'Manter qualidade e ritmo quando o cenário muda no meio do caminho.' },
    { id: 'pla', label: 'Planejamento e organização', cor: '#13A3AF', tint: '#DDF3F4', def: 'Transformar objetivos em etapas, responsáveis e prazos realistas.' },
    { id: 'sto', label: 'Storytelling', cor: '#F08A1C', tint: '#FDEBD7', def: 'Contar dados e decisões de forma que as pessoas lembrem e ajam.' }
  ];

  // Limites calibrados para o PDF caber em capa + 5 laudas (Arial 12, espaçamento 1,5).
  const LIMITS = {
    cargo: 40, empresa: 40, formacao: 60, skill: 25, contrib: 200,
    cult_local: 35, cult_periodo: 12, cultural: 120, exemplo: 400,
    caso_titulo: 70, caso_empresa: 40, caso_ano: 12,
    caso_contexto: 150, caso_desafio: 150, caso_acao: 150, caso_resultado: 150
  };

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = i => String(i + 1).padStart(2, '0');
  const fotoUrl = id => (id ? 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w800' : '');
  const softById = id => SOFT.find(s => s.id === id);
  const logo = (cls = '') => `<img class="logo ${cls}" src="assets/logo-auth.png" alt="AUTH">`;
  const cor = i => (C.CORES || [])[i % (C.CORES || ['#1F5FD6']).length] || '#1F5FD6';
  const isDemo = () => !C.API_URL || new URLSearchParams(location.search).has('demo');

  function normalize(r, i) {
    let areas = r.areas || {};
    if (typeof areas === 'string') { try { areas = JSON.parse(areas || '{}'); } catch (e) { areas = {}; } }
    const s = k => String(r[k] == null ? '' : r[k]).trim();
    return {
      n: num(i), nome: C.INTEGRANTES[i], pendente: false, cor: cor(i),
      cargo: s('cargo'), empresa: s('empresa'), formacao: s('formacao'),
      skills: [s('skill1'), s('skill2'), s('skill3')].filter(Boolean),
      contrib: s('contrib'),
      cult: { tipo: s('cult_tipo'), local: s('cult_local'), periodo: s('cult_periodo'), texto: s('cultural') },
      soft: s('soft'), exemplo: s('exemplo'),
      caso: { titulo: s('caso_titulo'), empresa: s('caso_empresa'), ano: s('caso_ano'), contexto: s('caso_contexto'), desafio: s('caso_desafio'), acao: s('caso_acao'), resultado: s('caso_resultado') },
      areas, fotoId: s('foto_id'), foto: s('foto_url') || fotoUrl(s('foto_id')), raw: r
    };
  }

  const pending = i => ({ n: num(i), nome: C.INTEGRANTES[i], pendente: true, cor: cor(i), skills: [], cult: {}, caso: {}, areas: {}, foto: '' });

  // Completa o integrante com o perfil do design v2 (config.js → PERFIS). O formulário tem prioridade.
  function withPerfil(m) {
    const p = (C.PERFIS || {})[m.nome];
    m.fonte = m.pendente ? '' : 'form';
    m.frase = ''; m.softIds = m.soft ? [m.soft] : []; m.pos = '50% 20%';
    if (!p) return m;
    if (m.pendente) Object.assign(m, { pendente: false, fonte: 'perfil', cargo: '', empresa: '', formacao: '', contrib: '' });
    // Áreas do formulário só valem se marcarem alguma das áreas atuais do mapa
    const formAreas = C.AREAS.some(a => Number((m.areas || {})[a.id]) > 0);
    return Object.assign(m, {
      frase: p.frase || '',
      cargo: m.cargo || p.cargo || '',
      formacao: m.formacao || p.formacao || '',
      skills: m.skills.length ? m.skills : (p.hard || []),
      contrib: m.contrib || p.resumo || '',
      softIds: [...new Set([...m.softIds, ...(p.soft || [])])],
      caso: (m.caso && m.caso.contexto) || !p.caso ? m.caso : { ...p.caso },
      areas: formAreas ? m.areas : (p.areas || {}),
      foto: m.foto || p.foto || '',
      pos: p.pos || m.pos
    });
  }

  // Dados de exemplo (modo demonstração). Nomes genéricos para não atribuir nada a pessoas reais.
  const DEMO = [
    { cargo: 'Cargo atual', empresa: 'Empresa atual', formacao: '[Engenharia Química]', skill1: 'Processos industriais', skill2: 'Gestão da qualidade', skill3: 'Bioquímica aplicada', contrib: '[Exemplo] Traz leitura técnica de processos e qualidade para avaliar a operação das unidades de bioquímica e alimentos.', cult_tipo: 'Nacional', cult_local: '[Cidade, UF]', cult_periodo: '2018', cultural: '[Exemplo] Período em uma planta no interior. Aprendeu a ouvir a operação antes de propor mudanças.', soft: 'pla', exemplo: '[Exemplo] Organizou a auditoria de qualidade de três linhas de produção em paralelo.', areas: { proc: 2, ops: 1, esg: 2, ino: 1 } },
    { cargo: 'Cargo atual', empresa: 'Empresa atual', formacao: '[Administração / Finanças]', skill1: 'Modelagem financeira', skill2: 'Valuation', skill3: 'Gestão de riscos', contrib: '[Exemplo] Traduz cada proposta em números: custo, retorno e risco, na linguagem de um comitê de holding.', cult_tipo: 'Internacional', cult_local: '[Cidade, País]', cult_periodo: '2019', cultural: '[Exemplo] Intercâmbio acadêmico. Passou a documentar acordos por escrito ao negociar com outras culturas.', soft: 'res', exemplo: '[Exemplo] Refez a projeção financeira de um projeto em 48 horas após uma mudança regulatória, sem atrasar a entrega.', areas: { fin: 2, dad: 1, mkt: 1 } },
    { cargo: 'Cargo atual', empresa: 'Empresa atual', formacao: '[Engenharia de Produção]', skill1: 'Supply chain', skill2: 'Logística', skill3: 'Lean', contrib: '[Exemplo] Conecta estratégia e chão de fábrica, com foco em fluxos logísticos entre filiais.', cult_tipo: 'Internacional', cult_local: '[Cidade, País]', cult_periodo: '2021', cultural: '[Exemplo] Projeto com fornecedores estrangeiros. Ganhou flexibilidade com fusos e estilos de decisão.', soft: 'pla', exemplo: '[Exemplo] Estruturou o cronograma de implantação de um novo centro de distribuição com marcos quinzenais.', areas: { proc: 1, ops: 2, dad: 1, esg: 1 }, caso_titulo: '[Título do caso — ex.: A filial que precisava abastecer em metade do prazo]', caso_empresa: '[Empresa]', caso_ano: '[Ano]', caso_contexto: '[Exemplo] Onde e quando aconteceu, qual era a empresa, a área e o papel do integrante.', caso_desafio: '[Exemplo] O problema, o que estava em risco e a restrição principal (prazo, custo, pessoas).', caso_acao: '[Exemplo] O que foi feito, em que ordem, e como a competência de planejamento apareceu.', caso_resultado: '[Exemplo] O efeito mensurável: [indicador] passou de [valor] para [valor] em [período].' },
    { cargo: 'Cargo atual', empresa: 'Empresa atual', formacao: '[Ciência de Dados]', skill1: 'Análise de dados', skill2: 'Python / BI', skill3: 'Automação', contrib: '[Exemplo] Transforma dados dispersos em painéis e modelos que sustentam as decisões do grupo.', cult_tipo: 'Nacional', cult_local: '[Cidade, UF]', cult_periodo: '2022', cultural: '[Exemplo] Mudança de região a trabalho. Adaptou a comunicação de dados para equipes com outras referências.', soft: 'sto', exemplo: '[Exemplo] Transformou um painel de indicadores em uma narrativa de cinco slides que aprovou o orçamento do projeto.', areas: { fin: 1, dad: 2, ino: 2 } },
    { cargo: 'Cargo atual', empresa: 'Empresa atual', formacao: '[Comunicação / Marketing]', skill1: 'Comunicação corporativa', skill2: 'Pesquisa de mercado', skill3: 'Relatórios ESG', contrib: '[Exemplo] Dá forma e voz às entregas: garante que a recomendação seja entendida por públicos diferentes.', cult_tipo: 'Internacional', cult_local: '[Cidade, País]', cult_periodo: '2023', cultural: '[Exemplo] Trabalho remoto com time multinacional. Aprendeu a escrever para quem lê em segunda língua.', soft: 'com', exemplo: '[Exemplo] Mediou um conflito entre duas áreas criando um rito semanal de alinhamento com pauta compartilhada.', areas: { esg: 1, mkt: 2, ino: 1 } }
  ];

  async function loadTeam() {
    if (isDemo()) {
      const membros = DEMO.slice(0, C.INTEGRANTES.length).map((r, i) => Object.assign(normalize(r, i), { nome: 'Nome do Integrante ' + (i + 1), frase: '', softIds: [r.soft], pos: '50% 20%' }));
      return { membros, demo: true };
    }
    try {
      const res = await fetch(C.API_URL + (C.API_URL.includes('?') ? '&' : '?') + 'action=list&t=' + Date.now());
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Resposta inválida');
      const byName = {};
      (data.membros || []).forEach(r => { byName[String(r.nome).trim()] = r; });
      const membros = C.INTEGRANTES.map((nome, i) => withPerfil(byName[nome] ? normalize(byName[nome], i) : pending(i)));
      return { membros, demo: false };
    } catch (err) {
      return { membros: C.INTEGRANTES.map((_, i) => withPerfil(pending(i))), demo: false, error: String(err.message || err) };
    }
  }

  async function submit(payload) {
    if (isDemo()) { await new Promise(r => setTimeout(r, 600)); return { ok: true, demo: true }; }
    const res = await fetch(C.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // evita preflight CORS no Apps Script
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  // Reduz a foto no navegador (máx. 900 px, JPEG) antes de enviar.
  function resizeImage(file, max = 900) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement('canvas');
        cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
        const ctx = cv.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url);
        resolve(cv.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Imagem inválida')); };
      img.src = url;
    });
  }

  // Derivados usados no portfólio web e no PDF
  function derive(membros) {
    const filled = membros.filter(m => !m.pendente);
    const matrix = C.AREAS.map(a => {
      const cells = membros.map(m => Number((m.areas || {})[a.id]) || 0);
      const score = cells.reduce((x, y) => x + y, 0);
      return { ...a, cells, score, pct: Math.min(100, (score / (2 * membros.length)) * 100) };
    });
    const year = p => { const m = String(p || '').match(/\d{4}/); return m ? +m[0] : 9999; };
    const trips = filled.filter(m => m.cult.texto).map(m => ({ ...m.cult, nome: m.nome, n: m.n, intl: /intern/i.test(m.cult.tipo) }))
      .sort((a, b) => year(a.periodo) - year(b.periodo));
    const skills = SOFT.map((k, i) => ({
      ...k, n: num(i),
      ev: filled.filter(m => m.soft === k.id && m.exemplo).map(m => ({ quem: m.nome, txt: m.exemplo })),
      quem: filled.filter(m => (m.softIds || []).includes(k.id)).map(m => m.nome.split(' ')[0])
    }));
    const hasCaso = m => !m.pendente && m.caso.contexto && m.caso.acao && m.caso.resultado;
    const casoM = membros.find(m => m.nome === C.CASO_DESTAQUE && hasCaso(m)) || membros.find(hasCaso) || null;
    const caso = casoM ? {
      titulo: casoM.caso.titulo || 'Caso real', quem: casoM.nome, soft: softById(casoM.caso.soft || casoM.soft),
      meta: [casoM.caso.empresa, casoM.caso.ano].filter(Boolean).join(' · '),
      passos: [['Contexto', casoM.caso.contexto], ['Desafio', casoM.caso.desafio], ['Ação', casoM.caso.acao], ['Resultado', casoM.caso.resultado]].filter(p => p[1])
    } : null;
    const lugares = new Set(trips.map(t => t.local.toLowerCase()).filter(Boolean));
    return {
      filled, matrix, trips, skills, caso,
      stats: {
        preenchidos: filled.length,
        areasCobertas: matrix.filter(r => r.cells.some(c => c === 2)).length,
        intl: trips.filter(t => t.intl).length, nac: trips.filter(t => !t.intl).length, lugares: lugares.size,
        softCobertas: skills.filter(k => k.ev.length).length
      }
    };
  }

  // Roda de competências (radar) do mapa de complementaridade, em SVG.
  // o.font: tamanho do rótulo das áreas, em unidades do desenho (o círculo tem raio 200).
  const AREA_CORES = ['#3B4FB8', '#13939E', '#7A4FA8', '#B5791C', '#B83A6B'];
  function radar(D, membros, o = {}) {
    const f = o.font || 16, R = 200, cx = 0, cy = 0, n = D.matrix.length;
    const ang = i => (-90 + i * 360 / n) * Math.PI / 180;
    const pt = (i, v) => [cx + Math.cos(ang(i)) * R * v / 2, cy + Math.sin(ang(i)) * R * v / 2];
    const fx = x => x.toFixed(1);
    const anel = [0.5, 1, 1.5, 2].map(v => `<circle cx="0" cy="0" r="${R * v / 2}" fill="none" stroke="#DCDFE6" stroke-width="1.2"/>`).join('');
    const eixos = D.matrix.map((_, i) => { const [x, y] = pt(i, 2.12); return `<line x1="0" y1="0" x2="${fx(x)}" y2="${fx(y)}" stroke="#DCDFE6" stroke-width="1.2"/>`; }).join('');
    const ticks = [0.5, 1, 1.5, 2].map(v => `<text x="8" y="${fx(-R * v / 2 - 5)}" font-size="${f * 0.72}" fill="#7A8090">${String(v).replace('.', ',')}</text>`).join('');
    const formas = membros.map((m, j) => {
      const ps = D.matrix.map((r, i) => pt(i, Number(r.cells[j]) || 0));
      return `<g><polygon points="${ps.map(p => p.map(fx).join(',')).join(' ')}" fill="${m.cor}" fill-opacity="0.05" stroke="${m.cor}" stroke-width="3" stroke-linejoin="round"><title>${esc(m.nome)}</title></polygon>` +
        ps.map(p => `<circle cx="${fx(p[0])}" cy="${fx(p[1])}" r="5" fill="#fff" stroke="${m.cor}" stroke-width="2.5"/>`).join('') + '</g>';
    }).join('');
    const rotulos = D.matrix.map((r, i) => {
      const [x, y] = pt(i, 2.36), c = Math.cos(ang(i));
      const anchor = Math.abs(c) < 0.2 ? 'middle' : c > 0 ? 'start' : 'end';
      const linhas = String(r.area).split(' & ');
      const ls = linhas.length > 1 ? [linhas[0] + ' &', linhas.slice(1).join(' & ')] : linhas;
      const y0 = y - (ls.length - 1) * f * 0.6 + (Math.sin(ang(i)) > 0.5 ? f * 0.5 : Math.sin(ang(i)) < -0.5 ? -f * 0.2 : f * 0.35);
      return `<text x="${fx(x)}" y="${fx(y0)}" text-anchor="${anchor}" font-size="${f}" font-weight="700" fill="${AREA_CORES[i % AREA_CORES.length]}">${ls.map((l, k) => `<tspan x="${fx(x)}" dy="${k ? f * 1.2 : 0}">${esc(l)}</tspan>`).join('')}</text>`;
    }).join('');
    const maxSin = Math.max(...D.matrix.map((_, i) => Math.sin(ang(i))));
    const pad = f * 8.6, top = R * 1.18 + f * 1.9, bot = R * 1.18 * maxSin + f * 1.6;
    return `<svg class="radar" viewBox="${fx(-R - pad)} ${fx(-top)} ${fx(2 * (R + pad))} ${fx(top + bot)}" role="img" aria-label="Roda de competências: nível de cada integrante nas áreas do mapa (0 sem atuação, 1 apoio, 2 especialista)" font-family="Arial, Helvetica, sans-serif">
      <circle cx="0" cy="0" r="${R * 1.06}" fill="#fff"/>${anel}${eixos}${o.ticks === false ? '' : ticks}${formas}
      ${o.centro === false ? '' : `<circle cx="0" cy="0" r="18" fill="#EEF0F4"/><text x="0" y="${f * 0.25}" text-anchor="middle" font-size="${f * 0.62}" font-weight="700" fill="#5A6070">AUTH</text>`}${rotulos}</svg>`;
  }

  window.AUTH = { C, SOFT, LIMITS, esc, num, fotoUrl, softById, logo, isDemo, loadTeam, submit, resizeImage, derive, radar, AREA_CORES };
})();
