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

  // Texto "Quem somos" (do deck da equipe). Até ~350 caracteres para caber no PDF.
  MANIFESTO: 'Uma equipe multidisciplinar que combina experiências, conhecimentos e perspectivas complementares. A diversidade se traduz em soluções eficazes, colaboração e impacto responsável.',
  SLOGAN: 'Conectando talentos, conhecimento e propósito',

  // ---------- Conteúdo do deck Portfolio_ArgoMenthor_Equipe6_v1 ----------
  PRINCIPIOS: [
    { titulo: 'Diversidade que soma', texto: 'Competências distintas, uma mesma direção.' },
    { titulo: 'Inovação aplicada', texto: 'Estratégia, tecnologia e execução conectadas.' },
    { titulo: 'Impacto com ética', texto: 'Qualidade, responsabilidade e resultados consistentes.' }
  ],
  MISSAO: 'Transformar desafios em oportunidades por meio da colaboração, diversidade de conhecimentos e inovação. Entregar soluções inteligentes, confiáveis e sustentáveis que gerem valor.',
  VISAO: 'Ser referência em inovação e transformação, antecipando tendências e aproveitando o potencial da tecnologia para superar expectativas e criar valor de forma consistente.',
  VALORES: ['Foco no cliente', 'Protagonismo', 'Excelência', 'Colaboração'],
  COMPETENCIAS_EQUIPE: [
    { titulo: 'Estratégia & negócios', texto: 'Processos, análise de negócio e decisões orientadas a valor.' },
    { titulo: 'Tecnologia & integração', texto: 'ERPs, sistemas e transformação digital.' },
    { titulo: 'Engenharia & projetos', texto: 'Projetos industriais, automação e soluções técnicas.' },
    { titulo: 'Finanças & agronegócio', texto: 'Planejamento, fluxo de caixa, custos e rentabilidade.' },
    { titulo: 'Colaboração & liderança', texto: 'Resiliência, adaptação e trabalho em equipe.' }
  ],
  ONDE_ESTAMOS: { texto: 'Uma rede que conecta Sul, Sudeste e Centro-Oeste.', cidades: ['Chapadão do Sul · MS', 'Indaiatuba · SP', 'Curitiba · PR', 'Erechim · RS'] },

  // Perfis do deck. Completam quem ainda não respondeu o formulário;
  // o que vier pelo formulário tem prioridade.
  PERFIS: {
    'Gabriel Martins Seabra': {
      resumo: 'Engenheiro mecânico de serviços industriais. Traz a visão de chão de fábrica, a gestão de não conformidades e o uso de dados para manter a operação confiável e rastreável.',
      soft: ['Planejamento e organização'],
      foto: 'assets/fotos/gabriel.jpg'
    },
    'Giovanna Ismael Alves de Souza': {
      frase: 'Tecnologia conectada ao negócio',
      formacao: 'Sistemas de Informação · MBA Executivo em Gestão (Gerenciamento de Projetos)',
      resumo: 'Graduada em Sistemas de Informação, tem mais de 10 anos de experiência em tecnologia, processos de negócio, ERPs e transformação digital. Atua entre stakeholders e equipes técnicas para viabilizar integrações e soluções que gerem valor.',
      hard: ['Oracle EBS R12 e Epicor CMS', 'Análise de negócios e processos'],
      soft: ['Proatividade', 'Trabalho em equipe', 'Resiliência e organização'],
      foto: 'assets/fotos/giovanna.jpg'
    },
    'Igor Farina': {
      frase: 'Engenharia que conecta estratégia, inovação e resultado',
      cargo: 'Projetista Master',
      formacao: 'Engenharia Civil · Especialização em Estruturas de Concreto e Fundações',
      resumo: 'Engenheiro Civil, com especialização em Estruturas de Concreto e Fundações, construiu sua trajetória profissional na área de projetos industriais. Como Projetista Master, atua no desenvolvimento de soluções e na gestão técnica de projetos, combinando visão sistêmica, inovação e integração multidisciplinar. Sua trajetória reúne conhecimento técnico, experiência prática e capacidade de solucionar problemas, desde a concepção até a fabricação, montagem e validação, buscando gerar valor, eficiência e melhoria contínua.',
      hard: ['Engenharia e desenvolvimento de projetos', 'Integração e automação industrial', 'Análise e solução de problemas técnicos'],
      soft: ['Pensamento analítico', 'Resiliência e adaptabilidade', 'Comunicação e trabalho em equipe'],
      foto: 'assets/fotos/igor.jpg'
    },
    'Jorge Alberto Portiglioti': {
      frase: 'Gestão inteligente para resultados sustentáveis',
      formacao: 'Ciências Contábeis · Pós-graduação em Agronegócio',
      resumo: 'Carreira consolidada nas áreas administrativa e financeira do agronegócio, com experiência em operações ligadas ao produtor rural. Formado em Ciências Contábeis e pós-graduado em Agronegócio, transforma dados em informação para apoiar decisões e resultados.',
      hard: ['Planejamento financeiro', 'Fluxo de caixa e controle orçamentário', 'Comercialização de commodities'],
      soft: ['Liderança', 'Organização e planejamento', 'Proatividade'],
      foto: 'assets/fotos/jorge.jpg'
    }
  },

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
