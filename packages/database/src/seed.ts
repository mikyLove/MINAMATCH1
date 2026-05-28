import 'dotenv/config';
import { getDb, closeDb } from './client';
import {
  candidates,
  candidateInterviews,
  students,
  studentSyllabus,
  scenarios,
  scenarioOptions,
  users,
  chatMessages,
} from './schema';

async function seed() {
  const db = getDb();

  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log('Database already seeded, skipping.');
    await closeDb();
    return;
  }

  await db.insert(users).values({
    id: 'admin-1',
    name: 'Admin MinaMatch',
    email: 'admin@minamatch.pe',
    password: '$2a$10$placeholder', // bcrypt hash of 'admin123'
    role: 'admin',
    avatar: null,
    createdAt: "datetime('now')",
  });

  await db.insert(candidates).values([
    {
      id: '1',
      name: 'Marco Quispe',
      title: 'Geólogo Senior',
      institution: 'UNA Puno',
      img: '...',
      expYears: 8,
      english: 'INGLÉS C1',
      languages: JSON.stringify(['Español', 'Inglés C1', 'Quechua básico']),
      matchRating: 92,
      skills: JSON.stringify(['Geomecánica', 'Planeamiento', 'Relaciones Comunitarias']),
      altitudeFit: 4500,
      socialFit: 88,
      certified: true,
      warning: null,
      isTop5: true,
      hasOsha: false,
      regionalRadar: 'Geólogos en Carabaya',
      bio: 'Experto en modelamiento estructural y estabilidad de taludes.',
    },
    {
      id: '2',
      name: 'Elena Mamani',
      title: 'Ingeniera de Minas',
      institution: 'UNI',
      img: 'https://lh3.googleusercontent.com/aida-public/...',
      expYears: 5,
      english: 'QUECHUA',
      languages: JSON.stringify(['Español', 'Quechua nativo', 'Inglés B2']),
      matchRating: 78,
      skills: JSON.stringify(['Ventilación', 'Software Mine', 'Seguridad']),
      altitudeFit: 4200,
      socialFit: 95,
      certified: false,
      warning: null,
      isTop5: false,
      hasOsha: false,
      regionalRadar: 'Supervisores en San Gabán',
      bio: 'Ingeniera de minas especializada en diseño de redes de ventilación.',
    },
    {
      id: '3',
      name: 'Jorge Flores',
      title: 'Seguridad Minera',
      institution: 'UNA Puno',
      img: 'https://lh3.googleusercontent.com/aida-public/...',
      expYears: 7,
      english: 'INGLÉS B2',
      languages: JSON.stringify(['Español', 'Inglés B2']),
      matchRating: 86,
      skills: JSON.stringify(['Seguridad', 'Control de Pérdidas', 'Rescate']),
      altitudeFit: 4700,
      socialFit: 72,
      certified: true,
      warning: null,
      isTop5: true,
      hasOsha: true,
      regionalRadar: 'Especialistas HSE en Ananea',
      bio: 'Especialista en prevención de riesgos laborales con certificación OSHA.',
    },
    {
      id: '4',
      name: 'Carlos Mendoza P.',
      title: 'Geólogo de Operaciones',
      institution: 'UNA Puno',
      img: 'https://lh3.googleusercontent.com/aida-public/...',
      expYears: 6,
      english: 'INGLÉS B1',
      languages: JSON.stringify(['Español', 'Inglés B1']),
      matchRating: 92,
      skills: JSON.stringify(['Geomecánica', 'Planeamiento', 'LHD Op.']),
      altitudeFit: 4500,
      socialFit: 90,
      certified: true,
      warning: null,
      isTop5: false,
      hasOsha: false,
      regionalRadar: 'Geólogos en Carabaya',
      bio: 'Geólogo con certificación MinaMatch para alta montaña.',
    },
    {
      id: '5',
      name: 'Elena Ramos G.',
      title: 'Jefe de Ventilación',
      institution: 'UNA Puno',
      img: 'https://lh3.googleusercontent.com/aida-public/...',
      expYears: 9,
      english: 'INGLÉS C1',
      languages: JSON.stringify(['Español', 'Inglés C1', 'Quechua avanzado']),
      matchRating: 78,
      skills: JSON.stringify(['Ventilación', 'Software Mine', 'Seguridad']),
      altitudeFit: 4800,
      socialFit: 85,
      certified: true,
      warning: null,
      isTop5: false,
      hasOsha: true,
      regionalRadar: 'Jefes de Ventilación en Crucero',
      bio: 'Experta en diseño de flujos térmicos en labores mineras subyacentes.',
    },
    {
      id: '6',
      name: 'Mateo Quispe J.',
      title: 'Supervisor de Operaciones',
      institution: 'UNI',
      img: 'https://lh3.googleusercontent.com/aida-public/...',
      expYears: 4,
      english: 'Español',
      languages: JSON.stringify(['Español']),
      matchRating: 45,
      skills: JSON.stringify(['Costos', 'Operaciones']),
      altitudeFit: 0,
      socialFit: 50,
      certified: false,
      warning: 'Altitud: No Evaluado',
      isTop5: false,
      hasOsha: false,
      regionalRadar: 'Supervisores en Juliaca',
      bio: 'Profesional con foco en control de presupuesto unitario.',
    },
  ]);

  await db.insert(candidateInterviews).values([
    { candidateId: '1', question: '¿Cómo procedería ante una alerta inesperada de vibración tectónica en el muro principal?', answer: 'Priorizo la evacuación segura del personal antes de cualquier análisis técnico.' },
    { candidateId: '1', question: '¿Qué experiencia tiene coordinando operaciones a más de 4500 msnm?', answer: 'Llevo 6 años viviendo y trabajando en la unidad San Rafael en Puno.' },
    { candidateId: '2', question: '¿Cuál ha sido su mayor desafío diseñando redes de ventilación subterránea?', answer: 'Optimizar el circuito secundario del nivel 380 con alto contenido de polvo.' },
    { candidateId: '3', question: '¿Cómo evalúa la cultura de seguridad en operaciones mineras de alta montaña?', answer: 'La seguridad no es negociable por objetivos de producción.' },
    { candidateId: '4', question: '¿Cómo maneja la fatiga física por hipoxia durante jornadas largas?', answer: 'Sigo estrictamente los descansos programados e hidratación constante.' },
    { candidateId: '5', question: '¿Qué criterio usa para calcular caída de presión en ventiladores axiales a gran altitud?', answer: 'Ajusto el factor de densidad del aire a la presión barométrica local de Puno.' },
    { candidateId: '6', question: '¿Por qué aún no ha rendido el test de adaptación en cámara hiperbárica?', answer: 'Tuve un retraso logístico en el centro médico ocupacional.' },
  ]);

  await db.insert(students).values({
    id: 'student-1',
    name: 'Juan Pérez',
    badge: 'Beca Minsur',
    program: 'Semilleros Puno v4.2',
    status: 'FINALIZADO',
    verificationHash: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    matchingScore: 98.4,
    retentionMonths: 24,
    signingBonus: 4500,
    timestamp: '2023-10-24T14:22:01.442Z',
    validatorNode: 'PUNO-MAIN-04',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/...',
  });

  await db.insert(studentSyllabus).values([
    { studentId: 'student-1', courseId: '1', courseName: 'Seguridad Subterránea', completed: true },
    { studentId: 'student-1', courseId: '2', courseName: 'Gestión Ambiental', completed: true },
    { studentId: 'student-1', courseId: '3', courseName: 'Operaciones de Tajo Abierto', completed: true },
    { studentId: 'student-1', courseId: '4', courseName: 'Ética y Responsabilidad Social', completed: true },
  ]);

  await db.insert(students).values({
    id: 'student-2',
    name: 'Yeny Cutipa',
    badge: 'Beca Minsur',
    program: 'Semilleros Puno v4.2',
    status: 'EN_CURSO',
    verificationHash: '0x8F5342AE7CD78B098defB751B7401B5f6d8995E',
    matchingScore: 82.5,
    retentionMonths: 18,
    signingBonus: 3800,
    timestamp: '2023-11-12T09:15:33.109Z',
    validatorNode: 'PUNO-SEC-02',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/...',
  });

  await db.insert(studentSyllabus).values([
    { studentId: 'student-2', courseId: '1', courseName: 'Seguridad Subterránea', completed: true },
    { studentId: 'student-2', courseId: '2', courseName: 'Gestión Ambiental', completed: true },
    { studentId: 'student-2', courseId: '3', courseName: 'Operaciones de Tajo Abierto', completed: false },
    { studentId: 'student-2', courseId: '4', courseName: 'Ética y Responsabilidad Social', completed: true },
  ]);

  const scenarioRows = [
    { id: 'scenario-1', stage: 'ETAPA 1/5', stageNum: 1, category: 'RECONOCIMIENTO', title: 'Desprendimiento Leve en Frente de Avance', description: 'Estás inspeccionando el bypass 420. Se observa una pequeña caída de fragmentos rocosos sueltos desde la corona de la labor.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/...', alertText: 'Alerta Nivel 2: Preventivo' },
    { id: 'scenario-2', stage: 'ETAPA 2/5', stageNum: 2, category: 'ALERTA TÉRMICA', title: 'Infiltración Fuerte de Aguas Subterráneas Heladas', description: 'En el nivel de prospección 450, una voladura reciente cruza una falla geológica liberando un chorro de agua fría a 1°C.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/...', alertText: 'Alerta Nivel 3: Severo' },
    { id: 'scenario-3', stage: 'ETAPA 3/5', stageNum: 3, category: 'ESCENARIO CRÍTICO', title: 'Falla Crítica en Ventilador Principal', description: 'Te encuentras en el nivel 400. La alarma de flujo de aire se activa. El sistema indica una falla mecánica en el aspa del ventilador primario.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/...', alertText: 'Alerta Nivel 4: Crítico' },
    { id: 'scenario-4', stage: 'ETAPA 4/5', stageNum: 4, category: 'GASES TÓXICOS', title: 'Presencia Anómala de Gas Grisú (Metano)', description: 'Un sensor estacionario registra 1.9% de gas metano en la galería de exploración norte.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/...', alertText: 'Alerta Nivel 4: Crítico' },
    { id: 'scenario-5', stage: 'ETAPA 5/5', stageNum: 5, category: 'DESAFÍO EXTREMO', title: 'Peligro de Alud por Sismo Reciente (4800 msnm)', description: 'Un temblor de 5.2 de magnitud sacude la ladera del tajo a mediodía.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/...', alertText: 'Alerta Nivel 5: Catastrófico' },
  ];

  await db.insert(scenarios).values(scenarioRows);

  const optionRows = [
    { id: 'opt1_1', scenarioId: 'scenario-1', text: 'Suspender labor e informar a Geomecánica', description: 'Parar la maquinaria pesada en ese frente, señalizar el área y llamar al supervisor geomecánico.', calma: 8.5, seguridad: 10, tiempo: '0:25', toleranciaFrio: 90, culturalFitSeguridad: 98, culturalFitEtica: 90, culturalFitInnovacion: 70 },
    { id: 'opt1_2', scenarioId: 'scenario-1', text: 'Continuar con precaución y purgar manualmente', description: 'Usar una barretilla desde una zona ya sostenida para desatar las rocas sueltas.', calma: 5.4, seguridad: 4.8, tiempo: '0:10', toleranciaFrio: 80, culturalFitSeguridad: 50, culturalFitEtica: 65, culturalFitInnovacion: 80 },
    { id: 'opt2_1', scenarioId: 'scenario-2', text: 'Activar bombas auxiliares neumáticas y abrigar personal', description: 'Instalar bombas de rebose neumáticas y proveer trajes impermeables térmicos.', calma: 9.0, seguridad: 9.5, tiempo: '0:35', toleranciaFrio: 94, culturalFitSeguridad: 95, culturalFitEtica: 92, culturalFitInnovacion: 85 },
    { id: 'opt2_2', scenarioId: 'scenario-2', text: 'Construir dique provisional con desmonte rápido', description: 'Utilizar el scoop para colocar fragmentos de roca y detener el rebose.', calma: 6.8, seguridad: 6.0, tiempo: '0:20', toleranciaFrio: 82, culturalFitSeguridad: 70, culturalFitEtica: 60, culturalFitInnovacion: 75 },
    { id: 'opt3_1', scenarioId: 'scenario-3', text: 'Evacuar y alertar vía radio', description: 'Priorizar la vida humana, iniciando protocolo de salida inmediata.', calma: 9.4, seguridad: 10, tiempo: '0:42', toleranciaFrio: 88, culturalFitSeguridad: 100, culturalFitEtica: 95, culturalFitInnovacion: 60 },
    { id: 'opt3_2', scenarioId: 'scenario-3', text: 'Intentar bypass manual', description: 'Evaluar si el ventilador puede operar a baja potencia.', calma: 6.0, seguridad: 4.0, tiempo: '1:15', toleranciaFrio: 80, culturalFitSeguridad: 40, culturalFitEtica: 55, culturalFitInnovacion: 90 },
    { id: 'opt4_1', scenarioId: 'scenario-4', text: 'Corte de energía integral remota y repliegue', description: 'Desenergizar la subestación de galería inmediatamente.', calma: 9.7, seguridad: 10, tiempo: '0:31', toleranciaFrio: 85, culturalFitSeguridad: 98, culturalFitEtica: 96, culturalFitInnovacion: 75 },
    { id: 'opt4_2', scenarioId: 'scenario-4', text: 'Aislar cableado in-situ y continuar monitoreo', description: 'Enviar electricista con multímetro intrínseco a encintar la zona de chispa.', calma: 4.1, seguridad: 1.5, tiempo: '2:10', toleranciaFrio: 71, culturalFitSeguridad: 20, culturalFitEtica: 50, culturalFitInnovacion: 80 },
    { id: 'opt5_1', scenarioId: 'scenario-5', text: 'Bloqueo físico de rampa secundaria y refugio', description: 'Estacionar camiones CAT en bermas de seguridad y movilizar operarios a refugios.', calma: 9.5, seguridad: 10, tiempo: '1:02', toleranciaFrio: 92, culturalFitSeguridad: 100, culturalFitEtica: 98, culturalFitInnovacion: 88 },
    { id: 'opt5_2', scenarioId: 'scenario-5', text: 'Despejar mineral acelerado antes del bloqueo', description: 'Acelerar la marcha de cargadores para descargar las tolvas llenas.', calma: 5.0, seguridad: 3.0, tiempo: '0:45', toleranciaFrio: 75, culturalFitSeguridad: 30, culturalFitEtica: 50, culturalFitInnovacion: 82 },
  ];

  await db.insert(scenarioOptions).values(optionRows);

  await db.insert(chatMessages).values({
    userId: 'admin-1',
    role: 'assistant',
    content: '¡Bienvenido a MinaMatch Puno! Soy tu asistente IA para selección minera. Puedo ayudarte con:\n\n• Análisis de candidatos mineros\n• Evaluación de escenarios de seguridad\n• Información sobre semilleros y becas\n• Matching de talento para alta montaña\n\n¿En qué puedo ayudarte hoy?',
    responseSource: 'fallback',
  });

  console.log('Seed completed successfully.');
  await closeDb();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
