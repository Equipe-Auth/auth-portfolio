/* Código compartilhado: dados, API e utilitários. */
(function () {
  const C = window.AUTH_CONFIG;

  const SOFT = [
    { id: 'com', label: 'Relacionamento interpessoal e comunicação', cor: '#3C67A3', tint: '#E4EAF3', def: 'Construir confiança e alinhar públicos diferentes, das filiais à diretoria.' },
    { id: 'res', label: 'Resiliência', cor: '#B65A3C', tint: '#F5E5DE', def: 'Manter qualidade e ritmo quando o cenário muda no meio do caminho.' },
    { id: 'pla', label: 'Planejamento e organização', cor: '#2F7A5F', tint: '#E3EFE9', def: 'Transformar objetivos em etapas, responsáveis e prazos realistas.' },
    { id: 'sto', label: 'Storytelling', cor: '#1D2026', tint: '#ECE9E2', def: 'Contar dados e decisões de forma que as pessoas lembrem e ajam.' }
  ];

  // Limites calibrados para o PDF caber em capa + 5 laudas (Arial 12, espaçamento 1,5).
  const LIMITS = {
    cargo: 40, empresa: 40, formacao: 60, skill: 25, contrib: 200,
    cult_local: 35, cult_periodo: 12, cultural: 120, exemplo: 200,
    caso_titulo: 70, caso_empresa: 40, caso_ano: 12,
    caso_contexto: 150, caso_desafio: 150, caso_acao: 150, caso_resultado: 150
  };

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = i => String(i + 1).padStart(2, '0');
  const fotoUrl = id => (id ? 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w800' : '');
  const softById = id => SOFT.find(s => s.id === id);
  const logo = (cls = '') => `<span class="logo ${cls}">AUTH<span class="logo-dot"></span></span>`;
  const isDemo = () => !C.API_URL || new URLSearchParams(location.search).has('demo');

  function normalize(r, i) {
    let areas = r.areas || {};
    if (typeof areas === 'string') { try { areas = JSON.parse(areas || '{}'); } catch (e) { areas = {}; } }
    const s = k => String(r[k] == null ? '' : r[k]).trim();
    return {
      n: num(i), nome: C.INTEGRANTES[i], pendente: false,
      cargo: s('cargo'), empresa: s('empresa'), formacao: s('formacao'),
      skills: [s('skill1'), s('skill2'), s('skill3')].filter(Boolean),
      contrib: s('contrib'),
      cult: { tipo: s('cult_tipo'), local: s('cult_local'), periodo: s('cult_periodo'), texto: s('cultural') },
      soft: s('soft'), exemplo: s('exemplo'),
      caso: { titulo: s('caso_titulo'), empresa: s('caso_empresa'), ano: s('caso_ano'), contexto: s('caso_contexto'), desafio: s('caso_desafio'), acao: s('caso_acao'), resultado: s('caso_resultado') },
      areas, fotoId: s('foto_id'), foto: s('foto_url') || fotoUrl(s('foto_id')), raw: r
    };
  }

  const pending = i => ({ n: num(i), nome: C.INTEGRANTES[i], pendente: true, skills: [], cult: {}, caso: {}, areas: {}, foto: '' });

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
      const membros = DEMO.slice(0, C.INTEGRANTES.length).map((r, i) => Object.assign(normalize(r, i), { nome: 'Nome do Integrante ' + (i + 1) }));
      return { membros, demo: true };
    }
    try {
      const res = await fetch(C.API_URL + (C.API_URL.includes('?') ? '&' : '?') + 'action=list&t=' + Date.now());
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Resposta inválida');
      const byName = {};
      (data.membros || []).forEach(r => { byName[String(r.nome).trim()] = r; });
      const membros = C.INTEGRANTES.map((nome, i) => (byName[nome] ? normalize(byName[nome], i) : pending(i)));
      return { membros, demo: false };
    } catch (err) {
      return { membros: C.INTEGRANTES.map((_, i) => pending(i)), demo: false, error: String(err.message || err) };
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
      return { ...a, cells, score, pct: Math.min(100, (score / 4) * 100) };
    });
    const year = p => { const m = String(p || '').match(/\d{4}/); return m ? +m[0] : 9999; };
    const trips = filled.filter(m => m.cult.texto).map(m => ({ ...m.cult, nome: m.nome, n: m.n, intl: /intern/i.test(m.cult.tipo) }))
      .sort((a, b) => year(a.periodo) - year(b.periodo));
    const skills = SOFT.map((k, i) => ({ ...k, n: num(i), ev: filled.filter(m => m.soft === k.id && m.exemplo).map(m => ({ quem: m.nome, txt: m.exemplo })) }));
    const hasCaso = m => !m.pendente && m.caso.contexto && m.caso.acao && m.caso.resultado;
    const casoM = membros.find(m => m.nome === C.CASO_DESTAQUE && hasCaso(m)) || membros.find(hasCaso) || null;
    const caso = casoM ? {
      titulo: casoM.caso.titulo || 'Caso real', quem: casoM.nome, soft: softById(casoM.soft),
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

  window.AUTH = { C, SOFT, LIMITS, esc, num, fotoUrl, softById, logo, isDemo, loadTeam, submit, resizeImage, derive };
})();
