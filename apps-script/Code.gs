/**
 * AUTH · Backend do portfólio (Google Apps Script)
 *
 * Como usar:
 * 1. Crie uma planilha Google. Menu Extensões → Apps Script.
 * 2. Apague o conteúdo de Code.gs e cole este arquivo inteiro. Salve.
 * 3. Implantar → Nova implantação → tipo "App da Web".
 *    Executar como: Eu · Quem pode acessar: Qualquer pessoa.
 * 4. Autorize o acesso (planilha + Drive). Copie a URL que termina em /exec
 *    e cole em API_URL no arquivo config.js do site.
 *
 * Se mudar este código depois: Implantar → Gerenciar implantações →
 * editar (lápis) → Versão: "Nova versão" → Implantar. A URL continua a mesma.
 */

const SHEET_NAME = 'Respostas';
const FOLDER_NAME = 'AUTH · Fotos do portfólio';
const INTEGRANTES = [
  'Gabriel Martins Seabra',
  'Giovanna Ismael Alves de Souza',
  'Igor Farina',
  'Jorge Alberto Portiglioti',
  'Lucas Nelson Atallah'
];
const FIELDS = [
  'timestamp', 'nome', 'cargo', 'empresa', 'formacao', 'skill1', 'skill2', 'skill3', 'contrib',
  'areas', 'cult_tipo', 'cult_local', 'cult_periodo', 'cultural', 'soft', 'exemplo',
  'caso_titulo', 'caso_empresa', 'caso_ano', 'caso_contexto', 'caso_desafio', 'caso_acao', 'caso_resultado',
  'foto_id', 'aceite'
];
const MAX_LEN = 1000; // limite de segurança por campo

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const nome = String(data.nome || '').trim();
    if (INTEGRANTES.indexOf(nome) === -1) throw new Error('Nome não reconhecido');
    if (data.aceite !== true) throw new Error('É preciso confirmar a veracidade das informações');

    const sheet = getSheet_();
    let fotoId = '';
    if (data.fotoData) fotoId = saveFoto_(nome, data.fotoData);
    else fotoId = String(data.fotoId || '') || lastFotoId_(sheet, nome);

    const row = FIELDS.map(function (f) {
      if (f === 'timestamp') return new Date();
      if (f === 'nome') return nome;
      if (f === 'foto_id') return fotoId;
      if (f === 'aceite') return 'sim';
      if (f === 'areas') return JSON.stringify(cleanAreas_(data.areas));
      return safe_(data[f]);
    });
    // Grava como texto puro para o Sheets não converter "03/2023" ou "2019" em data/número.
    const range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length);
    range.offset(0, 1, 1, row.length - 1).setNumberFormat('@');
    range.setValues([row]);
    return json_({ ok: true, fotoId: fotoId });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

// Devolve a resposta mais recente de cada integrante.
// ?action=foto&id=... devolve a foto em base64 (usado pelo botão "Baixar PDF").
function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'foto') return foto_(String(e.parameter.id || ''));
  try {
    const dataRange = getSheet_().getDataRange();
    const values = dataRange.getValues();
    const shown = dataRange.getDisplayValues(); // texto como aparece na planilha
    const header = values.shift();
    shown.shift();
    const latest = {};
    values.forEach(function (r, ri) {
      const o = {};
      header.forEach(function (h, i) {
        o[h] = h === 'timestamp' && Object.prototype.toString.call(r[i]) === '[object Date]' ? r[i].toISOString() : shown[ri][i];
      });
      if (o.nome) latest[o.nome] = o; // linhas mais novas sobrescrevem as antigas
    });
    const membros = Object.keys(latest).map(function (k) {
      const m = latest[k];
      try { m.areas = JSON.parse(m.areas || '{}'); } catch (e) { m.areas = {}; }
      return m;
    });
    return json_({ ok: true, membros: membros });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

// Só entrega arquivos que estão registrados como foto na planilha.
function foto_(id) {
  try {
    const iFoto = FIELDS.indexOf('foto_id');
    const ids = getSheet_().getDataRange().getValues().slice(1).map(function (r) { return String(r[iFoto]); });
    if (!id || ids.indexOf(id) === -1) throw new Error('Foto não encontrada');
    const blob = DriveApp.getFileById(id).getBlob();
    return json_({ ok: true, data: 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes()) });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(FIELDS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function saveFoto_(nome, dataUrl) {
  const m = String(dataUrl).match(/^data:(image\/(?:jpeg|png));base64,(.+)$/);
  if (!m) throw new Error('Formato de foto inválido');
  const bytes = Utilities.base64Decode(m[2]);
  if (bytes.length > 5 * 1024 * 1024) throw new Error('Foto muito grande');
  const blob = Utilities.newBlob(bytes, m[1], nome + ' - ' + new Date().toISOString() + (m[1] === 'image/png' ? '.png' : '.jpg'));
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  const folder = it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); // necessário para a foto aparecer no site
  return file.getId();
}

function lastFotoId_(sheet, nome) {
  const values = sheet.getDataRange().getValues();
  const iNome = FIELDS.indexOf('nome'), iFoto = FIELDS.indexOf('foto_id');
  for (let r = values.length - 1; r >= 1; r--) {
    if (values[r][iNome] === nome && values[r][iFoto]) return values[r][iFoto];
  }
  return '';
}

function cleanAreas_(a) {
  const out = {};
  if (a && typeof a === 'object') Object.keys(a).forEach(function (k) {
    const v = Number(a[k]);
    if (/^[a-z]{2,6}$/.test(k) && (v === 0 || v === 1 || v === 2)) out[k] = v;
  });
  return out;
}

// Evita que um texto começando com = + - @ vire fórmula na planilha.
function safe_(v) {
  let s = String(v == null ? '' : v).slice(0, MAX_LEN);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function autorizar() { getSheet_(); DriveApp.getRootFolder(); return 'ok'; }
