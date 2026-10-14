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

  // Ordem = numeração 01–04 no portfólio. CORES: uma por integrante, na mesma ordem.
  INTEGRANTES: [
    'Gabriel Martins Seabra',
    'Giovanna Ismael Alves de Souza',
    'Igor Farina',
    'Jorge Alberto Portiglioti'
  ],
  CORES: ['#1F5FD6', '#13A3AF', '#F08A1C', '#E4237A'],

  // Texto "Quem somos" (até ~350 caracteres para caber no PDF).
  MANIFESTO: 'Uma equipe multidisciplinar que combina experiências, conhecimentos e perspectivas complementares. A diversidade se traduz em soluções eficazes, colaboração e impacto responsável.',
  SLOGAN: 'Conectando talentos, conhecimento e propósito',
  MISSAO: 'Transformar desafios em oportunidades por meio da colaboração, diversidade de conhecimentos e inovação. Entregar soluções inteligentes, confiáveis e sustentáveis que gerem valor.',
  VISAO: 'Ser referência em inovação e transformação, antecipando tendências e aproveitando o potencial da tecnologia para superar expectativas e criar valor de forma consistente.',
  VALORES: ['Foco no cliente', 'Protagonismo', 'Excelência', 'Colaboração'],
  ONDE_ESTAMOS: 'Chapadão do Sul (MS) · Indaiatuba (SP) · Curitiba (PR) · Erechim (RS)',

  FRASE_FINAL: 'Diferentes por formação. Uma só assinatura',

  // Nome do integrante cujo caso real vai em destaque. Vazio = primeiro caso preenchido.
  CASO_DESTAQUE: '',

  // Áreas do mapa de complementaridade (o formulário pergunta o nível em cada uma)
  AREAS: [
    { id: 'est', area: 'Estratégia & negócios',   bu: 'Processos e análise de negócio' },
    { id: 'tec', area: 'Tecnologia & integração', bu: 'ERPs, sistemas, transformação digital' },
    { id: 'eng', area: 'Engenharia & projetos',   bu: 'Projetos industriais e automação' },
    { id: 'fin', area: 'Finanças & agronegócio',  bu: 'Planejamento, caixa e custos' },
    { id: 'col', area: 'Colaboração & liderança', bu: 'Resiliência e trabalho em equipe' }
  ],

  // Perfis do design v2 (deck da equipe). Completam quem ainda não respondeu o formulário;
  // o que vier pelo formulário tem prioridade. areas: 0 = sem atuação, 1 = apoio, 2 = especialista.
  // soft: ids das 4 competências (com, res, pla, sto) que o integrante declara.
  PERFIS: {
    'Gabriel Martins Seabra': {
      formacao: 'Engenheiro Mecânico - UFPR',
      resumo: 'Engenheiro mecânico de serviços industriais: traz a visão de chão de fábrica, a gestão de não conformidades e o uso de dados para manter a operação confiável e rastreável.',
      hard: ['Engenharia de produto', 'Gestão de NCRs', 'Gestão de dados'],
      soft: ['pla'],
      areas: { est: 0, tec: 1, eng: 2, fin: 0, col: 1 },
      foto: 'assets/fotos/gabriel.jpg', pos: '50% 20%'
    },
    'Giovanna Ismael Alves de Souza': {
      frase: 'Tecnologia conectada ao negócio',
      formacao: 'Sistemas de Informação · MBA Executivo em Gestão (Gerenciamento de Projetos)',
      resumo: 'Graduada em Sistemas de Informação, tem mais de 10 anos de experiência em tecnologia, processos de negócio, ERPs e transformação digital. Atua entre stakeholders e equipes técnicas para viabilizar integrações e soluções que gerem valor.',
      hard: ['Oracle EBS R12 e Epicor CMS', 'Análise de negócios e processos'],
      soft: ['com', 'res', 'pla'],
      areas: { est: 2, tec: 2, eng: 0, fin: 0, col: 2 },
      foto: 'assets/fotos/giovanna.jpg', pos: '50% 15%'
    },
    'Igor Farina': {
      frase: 'Engenharia que conecta estratégia, inovação e resultado',
      cargo: 'Projetista Master',
      formacao: 'Engenharia Civil · Especialização em Estruturas de Concreto e Fundações',
      resumo: 'Engenheiro Civil, com especialização em Estruturas de Concreto e Fundações, construiu sua trajetória profissional na área de projetos industriais. Como Projetista Master, atua no desenvolvimento de soluções e na gestão técnica de projetos, combinando visão sistêmica, inovação e integração multidisciplinar. Sua trajetória reúne conhecimento técnico, experiência prática e capacidade de solucionar problemas, desde a concepção até a fabricação, montagem e validação, buscando gerar valor, eficiência e melhoria contínua.',
      hard: ['Engenharia e desenvolvimento de projetos', 'Integração e automação industrial', 'Análise e solução de problemas técnicos'],
      soft: ['com', 'res'],
      areas: { est: 1, tec: 2, eng: 2, fin: 0, col: 2 },
      foto: 'assets/fotos/igor.jpg', pos: '50% 20%'
    },
    'Jorge Alberto Portiglioti': {
      frase: 'Gestão inteligente para resultados sustentáveis',
      formacao: 'Ciências Contábeis · Pós-graduação em Agronegócio',
      resumo: 'Carreira consolidada nas áreas administrativa e financeira do agronegócio, com experiência em operações ligadas ao produtor rural. Formado em Ciências Contábeis e pós-graduado em Agronegócio, transforma dados em informação para apoiar decisões e resultados.',
      hard: ['Planejamento financeiro', 'Fluxo de caixa e controle orçamentário', 'Comercialização de commodities'],
      soft: ['pla'],
      areas: { est: 2, tec: 0, eng: 0, fin: 2, col: 2 },
      foto: 'assets/fotos/jorge.jpg', pos: '50% 10%'
    }
  }
};
