import type { Case, Evidence, EvidenceType, Priority, Summary } from '../types';

const CASES_KEY = 'reporta-ya:demo-cases';

const evidenceTypes: EvidenceType[] = [
  { id: 'screenshot', name: 'Captura de pantalla', description: 'Imagen de una conversación o publicación', icon: '🖼️' },
  { id: 'whatsapp', name: 'Mensaje WhatsApp', description: 'Mensaje o conversación', icon: '💬' },
  { id: 'email', name: 'Correo electrónico', description: 'Correo recibido o enviado', icon: '✉️' },
  { id: 'photo', name: 'Fotografía', description: 'Fotografía relacionada con el hecho', icon: '📷' },
  { id: 'sms', name: 'SMS', description: 'Mensaje de texto', icon: '📱' },
  { id: 'document', name: 'Documento', description: 'Documento relacionado con el hecho', icon: '📄' },
  { id: 'other', name: 'Otro', description: 'Otro tipo de evidencia', icon: '📌' },
];

type DemoCase = Case & { evidences: Evidence[] };

function readCases(): DemoCase[] {
  try {
    const stored = localStorage.getItem(CASES_KEY);
    return stored ? (JSON.parse(stored) as DemoCase[]) : [];
  } catch {
    return [];
  }
}

function writeCases(cases: DemoCase[]) {
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function findCase(id: string) {
  const cases = readCases();
  const found = cases.find((item) => item.id === id);
  if (!found) throw new Error('No se encontró el registro de demostración.');
  return { cases, found };
}

function ordered(evidences: Evidence[]) {
  return [...evidences].sort((a, b) => a.incidentDate.localeCompare(b.incidentDate));
}

const recommendations = [
  'Conserva los archivos originales y evita editar las evidencias.',
  'Anota fechas y contexto mientras los recuerdes.',
  'Si hay peligro inmediato, contacta a los servicios de emergencia de tu localidad.',
];

export const mockApi = {
  async types(): Promise<EvidenceType[]> {
    return evidenceTypes;
  },

  async createCase(title: string): Promise<Case> {
    const cases = readCases();
    const id = createId();
    const now = new Date();
    const caseNumber = `RY-${now.getFullYear()}-${id.slice(0, 5).toUpperCase()}`;
    const created: DemoCase = {
      id,
      caseNumber,
      title: title.trim() || 'Registro de hechos',
      createdAt: now.toISOString(),
      evidences: [],
    };
    writeCases([...cases, created]);
    return created;
  },

  async addEvidence(id: string, form: FormData): Promise<Evidence> {
    const { cases, found } = findCase(id);
    const value = (key: string) => {
      const entry = form.get(key);
      return typeof entry === 'string' ? entry : '';
    };
    const typeId = value('typeId');
    const type = evidenceTypes.find((item) => item.id === typeId);
    const incidentDate = value('incidentDate');
    const description = value('description').trim();
    if (!type || !incidentDate || description.length < 3) {
      throw new Error('Completa los datos requeridos de la evidencia.');
    }

    const priorityValue = value('priority');
    const priority: Priority = ['Bajo', 'Medio', 'Alto'].includes(priorityValue)
      ? (priorityValue as Priority)
      : 'Medio';
    const file = form.get('file');
    const evidence: Evidence = {
      id: createId(),
      typeId,
      typeName: type.name,
      incidentDate,
      description,
      personInvolved: value('personInvolved').trim() || null,
      priority,
      fileName: file instanceof File && file.size > 0 ? file.name : null,
    };

    found.evidences.push(evidence);
    writeCases(cases);
    return evidence;
  },

  async getCase(id: string): Promise<Case> {
    return findCase(id).found;
  },

  async timeline(id: string): Promise<Evidence[]> {
    return ordered(findCase(id).found.evidences);
  },

  async summary(id: string): Promise<Summary> {
    const { found } = findCase(id);
    const timeline = ordered(found.evidences);
    return {
      caseNumber: found.caseNumber,
      count: timeline.length,
      timeline: timeline.map((item) => ({
        date: new Date(`${item.incidentDate}T12:00:00`).toLocaleDateString('es-PE', {
          day: 'numeric', month: 'long', year: 'numeric',
        }),
        description: item.description,
        priority: item.priority,
        typeName: item.typeName,
      })),
      recommendations,
    };
  },
};
