/* =========================================================
   CONFIGURAÇÃO DO PORTFÓLIO AUTH
   Edite só este arquivo. Depois de publicar o Apps Script,
   cole a URL dele (termina em /exec) em API_URL.
   Enquanto API_URL estiver vazio, o site roda em modo
   demonstração, com dados de exemplo.
   ========================================================= */
window.AUTH_CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbxZKFZLSta6eFB-SabnsbRPEE2gsASjP_XWhNTsc8gQezy7VZdV98sA_6uyo-q1xg5i/exec',

  EQUIPE: 'AUTH',
  DISCIPLINA: 'ARGo – Alternate Reality Goal',
  DATA: 'Outubro/2026',

  // Ordem = numeração 01–04 no portfólio
  INTEGRANTES: [
    'Gabriel Martins Seabra',
    'Giovanna Ismael Alves de Souza',
    'Igor Farina',
    'Jorge Alberto Portiglioti'
  ],

  // Texto "Quem somos". Ajuste depois que todos preencherem (até ~350 caracteres para caber no PDF).
  MANIFESTO: 'Somos quatro profissionais de formações e trajetórias diferentes. Cada um é autor da parte que domina, e todos assinam o resultado. É assim que transformamos diversidade em decisões melhores, no ritmo que uma holding com mais de 20 filiais exige.',

  FRASE_FINAL: 'Diferentes por formação. Uma só assinatura',

  // Nome do integrante cujo caso real vai em destaque. Vazio = primeiro caso preenchido.
  CASO_DESTAQUE: '',

  // Áreas do mapa de complementaridade e a unidade da Argo Menthor onde pesam mais
  AREAS: [
    { id: 'proc', area: 'Processos & Bioquímica', bu: 'Bioquímica · Alimentos' },
    { id: 'fin',  area: 'Finanças & Riscos',      bu: 'Holding' },
    { id: 'ops',  area: 'Operações & Logística',  bu: 'Logística · Energia' },
    { id: 'dad',  area: 'Dados & Tecnologia',     bu: 'Todas as unidades' },
    { id: 'esg',  area: 'Sustentabilidade & ESG', bu: 'Energia · Holding' },
    { id: 'mkt',  area: 'Mercado & Comunicação',  bu: 'Alimentos · Holding' },
    { id: 'ino',  area: 'Inovação & Produto',     bu: 'Bioquímica · Alimentos' }
  ]
};
