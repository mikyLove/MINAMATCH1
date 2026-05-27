import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'minamatch.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
    seedIfEmpty();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS candidates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      institution TEXT NOT NULL,
      img TEXT,
      exp_years INTEGER DEFAULT 0,
      english TEXT DEFAULT '',
      languages TEXT DEFAULT '[]',
      match_rating REAL DEFAULT 0,
      skills TEXT DEFAULT '[]',
      altitude_fit REAL DEFAULT 0,
      social_fit REAL DEFAULT 0,
      certified INTEGER DEFAULT 0,
      warning TEXT,
      is_top5 INTEGER DEFAULT 0,
      has_osha INTEGER DEFAULT 0,
      regional_radar TEXT,
      bio TEXT
    );

    CREATE TABLE IF NOT EXISTS candidate_interviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      candidate_id TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      FOREIGN KEY (candidate_id) REFERENCES candidates(id)
    );

    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      badge TEXT,
      program TEXT,
      status TEXT DEFAULT 'EN_CURSO',
      verification_hash TEXT,
      matching_score REAL DEFAULT 0,
      retention_months INTEGER DEFAULT 0,
      signing_bonus REAL DEFAULT 0,
      timestamp TEXT,
      validator_node TEXT,
      avatar_url TEXT
    );

    CREATE TABLE IF NOT EXISTS student_syllabus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      course_name TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      FOREIGN KEY (student_id) REFERENCES students(id)
    );

    CREATE TABLE IF NOT EXISTS scenarios (
      id TEXT PRIMARY KEY,
      stage TEXT,
      stage_num INTEGER,
      category TEXT,
      title TEXT,
      description TEXT,
      image_url TEXT,
      alert_text TEXT
    );

    CREATE TABLE IF NOT EXISTS scenario_options (
      id TEXT PRIMARY KEY,
      scenario_id TEXT NOT NULL,
      text TEXT NOT NULL,
      description TEXT,
      calma REAL DEFAULT 0,
      seguridad REAL DEFAULT 0,
      tiempo TEXT,
      tolerancia_frio REAL DEFAULT 0,
      cultural_fit_seguridad REAL DEFAULT 0,
      cultural_fit_etica REAL DEFAULT 0,
      cultural_fit_innovacion REAL DEFAULT 0,
      FOREIGN KEY (scenario_id) REFERENCES scenarios(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      avatar TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      response_source TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

function seedIfEmpty() {
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const userCount = db.prepare('SELECT COUNT(*) as cnt FROM users').get() as { cnt: number };
  if (userCount.cnt === 0) {
    const hashed = bcrypt.hashSync('admin123', 10);
    insertUser.run('admin-1', 'Admin MinaMatch', 'admin@minamatch.pe', hashed, 'admin', null);
  }

  const count = db.prepare('SELECT COUNT(*) as cnt FROM candidates').get() as { cnt: number };
  if (count.cnt > 0) return;

  const insertCandidate = db.prepare(`
    INSERT INTO candidates (id, name, title, institution, img, exp_years, english, languages, match_rating, skills, altitude_fit, social_fit, certified, warning, is_top5, has_osha, regional_radar, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertInterview = db.prepare(`
    INSERT INTO candidate_interviews (candidate_id, question, answer) VALUES (?, ?, ?)
  `);

  const insertStudent = db.prepare(`
    INSERT INTO students (id, name, badge, program, status, verification_hash, matching_score, retention_months, signing_bonus, timestamp, validator_node, avatar_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSyllabus = db.prepare(`
    INSERT INTO student_syllabus (student_id, course_id, course_name, completed) VALUES (?, ?, ?, ?)
  `);

  const insertScenario = db.prepare(`
    INSERT INTO scenarios (id, stage, stage_num, category, title, description, image_url, alert_text)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOption = db.prepare(`
    INSERT INTO scenario_options (id, scenario_id, text, description, calma, seguridad, tiempo, tolerancia_frio, cultural_fit_seguridad, cultural_fit_etica, cultural_fit_innovacion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertChat = db.prepare(`
    INSERT INTO chat_messages (user_id, role, content, response_source) VALUES (?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    insertCandidate.run('1', 'Marco Quispe', 'Geólogo Senior', 'UNA Puno', '...', 8, 'INGLÉS C1', JSON.stringify(['Español', 'Inglés C1', 'Quechua básico']), 92, JSON.stringify(['Geomecánica', 'Planeamiento', 'Relaciones Comunitarias']), 4500, 88, 1, null, 1, 0, 'Geólogos en Carabaya', 'Experto en modelamiento estructural y estabilidad de taludes.');
    insertInterview.run('1', '¿Cómo procedería ante una alerta inesperada de vibración tectónica en el muro principal?', 'Priorizo la evacuación segura del personal antes de cualquier análisis técnico.');
    insertInterview.run('1', '¿Qué experiencia tiene coordinando operaciones a más de 4500 msnm?', 'Llevo 6 años viviendo y trabajando en la unidad San Rafael en Puno.');

    insertCandidate.run('2', 'Elena Mamani', 'Ingeniera de Minas', 'UNI', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvx-J5u4GJCu2Z-os7CGn1gPIF-2ib-I2mfv-P4gPGtkvU-b6gP12FjwfZCnMWNGpJbxjOb7EcvkCbjrLZ8gKUWLd_FBf23WqyRSJfv3XIrHuaAyh_zfOgvx4zhBV8Q7Y7QDZgVVqcaFEou_xfYBLbMncVDjSaG2PmNMNxSBE_mVg64QfRyMbF-4XAioqPZ-Pd7sDe3GPBXfhKF1uZbgl7kQoEjCMRVs1F0taJ5OXIatTGjOg191Gfgu3q9RZgGW93Cq1UZdDsJ1A', 5, 'QUECHUA', JSON.stringify(['Español', 'Quechua nativo', 'Inglés B2']), 78, JSON.stringify(['Ventilación', 'Software Mine', 'Seguridad']), 4200, 95, 0, null, 0, 0, 'Supervisores en San Gabán', 'Ingeniera de minas especializada en diseño de redes de ventilación.');
    insertInterview.run('2', '¿Cuál ha sido su mayor desafío diseñando redes de ventilación subterránea?', 'Optimizar el circuito secundario del nivel 380 con alto contenido de polvo.');

    insertCandidate.run('3', 'Jorge Flores', 'Seguridad Minera', 'UNA Puno', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2gu67w6nONxTov8nhG6kZVx2E1lZnUuH7Pnk8URP32Cddt_9vA_3FYea3hHeYCUzXqr6aXlPTiX-IH818ztmBN46e3KDwonaXO_gHOciHYzDCYOnjYUikh4xOqrc2ErkWosTu7m7Y-geS4N47QybIw8IiN44yHbBwvMWBSZZsUnfFWIVIlwc-X7OtAOBtmjcSW2LbwbDxmsV7GI8CNJ8t5BBmwbWIL0LweIOFwkB5AS2DGuZ-khed9JD8-GOeiUIx2vECx8_MWOo', 7, 'INGLÉS B2', JSON.stringify(['Español', 'Inglés B2']), 86, JSON.stringify(['Seguridad', 'Control de Pérdidas', 'Rescate']), 4700, 72, 1, null, 1, 1, 'Especialistas HSE en Ananea', 'Especialista en prevención de riesgos laborales con certificación OSHA.');
    insertInterview.run('3', '¿Cómo evalúa la cultura de seguridad en operaciones mineras de alta montaña?', 'La seguridad no es negociable por objetivos de producción.');

    insertCandidate.run('4', 'Carlos Mendoza P.', 'Geólogo de Operaciones', 'UNA Puno', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKDasJR9SojBYATAK7z5W06o9G4B0NnCjHtsFmKcIbicScMcRm5nPzNArzJTHc8fNFQIrIkJuC20XYvrDKvgdofb0aUnubO9kbI57wBTxGj9bK6MjKTW7ZB6xuk7wbRHwp568KSTQMqt6fRkRXggIL7TOpjfUAq2IgK_jYEl3GaQFE8emi1NvktPVSn-yDfAOQmzExxSpP-3CsLIPixwlhZdFvPsPQSphmOmMPkvh7UoBUgYHiN9Rleq0hVctq0i0rKoD4PudQzXU', 6, 'INGLÉS B1', JSON.stringify(['Español', 'Inglés B1']), 92, JSON.stringify(['Geomecánica', 'Planeamiento', 'LHD Op.']), 4500, 90, 1, null, 0, 0, 'Geólogos en Carabaya', 'Geólogo con certificación MinaMatch para alta montaña.');
    insertInterview.run('4', '¿Cómo maneja la fatiga física por hipoxia durante jornadas largas?', 'Sigo estrictamente los descansos programados e hidratación constante.');

    insertCandidate.run('5', 'Elena Ramos G.', 'Jefe de Ventilación', 'UNA Puno', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWa17sy1FXf9W9QwFqOpwB3vW0pbK0uzJHQBGdkDSaRWh3HioAC8D4jY7qn3udma4vCrXPaJxENxJpmvJB4Cfj2WF7q-gLtzoh69-Jiv5nUKE47yimLQ2mnt-w_8RrKhOiUlUaMdWYn-yOE4yyMNci3Ulabc7FQeMoCV66oZZ2Rb1AA6HPQda5BhRMDuZ7UYDsQDsY6Fpf0g_niz0sjTp-g8YVPK1cgZTLFgKjQy_yFlf33tAVuscjvfVz0Q1hyDTMHGZ0Ek77DQg', 9, 'INGLÉS C1', JSON.stringify(['Español', 'Inglés C1', 'Quechua avanzado']), 78, JSON.stringify(['Ventilación', 'Software Mine', 'Seguridad']), 4800, 85, 1, null, 0, 1, 'Jefes de Ventilación en Crucero', 'Experta en diseño de flujos térmicos en labores mineras subyacentes.');
    insertInterview.run('5', '¿Qué criterio usa para calcular caída de presión en ventiladores axiales a gran altitud?', 'Ajusto el factor de densidad del aire a la presión barométrica local de Puno.');

    insertCandidate.run('6', 'Mateo Quispe J.', 'Supervisor de Operaciones', 'UNI', 'https://lh3.googleusercontent.com/aida-public/AB6AXuChWuZWQZu89kwDHjsLfEDD5HP2VdZ6Xnl7TquMGgHb8x1keMc87aUd0JoQMZMd9O844PCsU8QVkIdHVgQZan59-N0dwkJcIYKWlG_5N6WRwjsUxRWKtq0wOtghJk6YTih27f0airjzGxvSFyLjALiB34u0NEhxhqERnZ1BrY5DU18GLiL9SpH4bNGEU86hiB7IDPKLqfjodx-HGuA4kNlbTf6yTfkLFee0mj4djZLQyEHXmROvm_z5gKpKklAg94a2XdCKlcbXBYs', 4, 'Español', JSON.stringify(['Español']), 45, JSON.stringify(['Costos', 'Operaciones']), 0, 50, 0, 'Altitud: No Evaluado', 0, 0, 'Supervisores en Juliaca', 'Profesional con foco en control de presupuesto unitario.');
    insertInterview.run('6', '¿Por qué aún no ha rendido el test de adaptación en cámara hiperbárica?', 'Tuve un retraso logístico en el centro médico ocupacional.');

    insertStudent.run('student-1', 'Juan Pérez', 'Beca Minsur', 'Semilleros Puno v4.2', 'FINALIZADO', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 98.4, 24, 4500, '2023-10-24T14:22:01.442Z', 'PUNO-MAIN-04', 'https://lh3.googleusercontent.com/aida-public/AB6AXuChTWi8ViaB82sqJauvh_WkV4g21m_kjV0GIqpGC10wGM6XsQ6O5vatCtaP_iaQrtdstWs7yn5zTRpBKRSY9HTy2jIwf2CT_GUWdk2E6OGxz1NLbg-XUBV6mf63U_mjAZn5_8Wq3OSOECyOABQfhZChIPycPeUhX_zketNm52XLHb-xJ1gocF9vuYFyd0nOzP2aFL2x_-V_-3au6IKXiEZ3h7rzif1AH3CgJTtM0ped7hn7R8RH0VZ02TSmYSZxbFna8RiMs2cNO8I');
    insertSyllabus.run('student-1', '1', 'Seguridad Subterránea', 1);
    insertSyllabus.run('student-1', '2', 'Gestión Ambiental', 1);
    insertSyllabus.run('student-1', '3', 'Operaciones de Tajo Abierto', 1);
    insertSyllabus.run('student-1', '4', 'Ética y Responsabilidad Social', 1);

    insertStudent.run('student-2', 'Yeny Cutipa', 'Beca Minsur', 'Semilleros Puno v4.2', 'EN_CURSO', '0x8F5342AE7CD78B098defB751B7401B5f6d8995E', 82.5, 18, 3800, '2023-11-12T09:15:33.109Z', 'PUNO-SEC-02', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWa17sy1FXf9W9QwFqOpwB3vW0pbK0uzJHQBGdkDSaRWh3HioAC8D4jY7qn3udma4vCrXPaJxENxJpmvJB4Cfj2WF7q-gLtzoh69-Jiv5nUKE47yimLQ2mnt-w_8RrKhOiUlUaMdWYn-yOE4yyMNci3Ulabc7FQeMoCV66oZZ2Rb1AA6HPQda5BhRMDuZ7UYDsQDsY6Fpf0g_niz0sjTp-g8YVPK1cgZTLFgKjQy_yFlf33tAVuscjvfVz0Q1hyDTMHGZ0Ek77DQg');
    insertSyllabus.run('student-2', '1', 'Seguridad Subterránea', 1);
    insertSyllabus.run('student-2', '2', 'Gestión Ambiental', 1);
    insertSyllabus.run('student-2', '3', 'Operaciones de Tajo Abierto', 0);
    insertSyllabus.run('student-2', '4', 'Ética y Responsabilidad Social', 1);

    const scenarios = [
      { id: 'scenario-1', stage: 'ETAPA 1/5', stageNum: 1, category: 'RECONOCIMIENTO', title: 'Desprendimiento Leve en Frente de Avance', description: 'Estás inspeccionando el bypass 420. Se observa una pequeña caída de fragmentos rocosos sueltos desde la corona de la labor.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrOEiUOE8c5n1-XzjDAEHpt9NINnxcNtQUJ5yhuvc3dBPDusN5PPFnbjAclBiJ2Xwx7grqU5iksq_cFf4Xvaqez0ysFN1_nIpPmZvn44yY14SHKQAiQLmq9KbuH9qcqEgmV9zVhVNWdrxOWrmotP_SMnZ_FLaRMYZoqzfsIw0shsUSIAzMm0B2u6GmJZZbTOfAWusCjHWlWmVPLiYeO3d2-G1Op-lwkQPt6syKmLk9RT6YdsyRl-CD8CTeCbxyjv4G6eojv5EGytI', alertText: 'Alerta Nivel 2: Preventivo' },
      { id: 'scenario-2', stage: 'ETAPA 2/5', stageNum: 2, category: 'ALERTA TÉRMICA', title: 'Infiltración Fuerte de Aguas Subterráneas Heladas', description: 'En el nivel de prospección 450, una voladura reciente cruza una falla geológica liberando un chorro de agua fría a 1°C.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrOEiUOE8c5n1-XzjDAEHpt9NINnxcNtQUJ5yhuvc3dBPDusN5PPFnbjAclBiJ2Xwx7grqU5iksq_cFf4Xvaqez0ysFN1_nIpPmZvn44yY14SHKQAiQLmq9KbuH9qcqEgmV9zVhVNWdrxOWrmotP_SMnZ_FLaRMYZoqzfsIw0shsUSIAzMm0B2u6GmJZZbTOfAWusCjHWlWmVPLiYeO3d2-G1Op-lwkQPt6syKmLk9RT6YdsyRl-CD8CTeCbxyjv4G6eojv5EGytI', alertText: 'Alerta Nivel 3: Severo' },
      { id: 'scenario-3', stage: 'ETAPA 3/5', stageNum: 3, category: 'ESCENARIO CRÍTICO', title: 'Falla Crítica en Ventilador Principal', description: 'Te encuentras en el nivel 400. La alarma de flujo de aire se activa. El sistema indica una falla mecánica en el aspa del ventilador primario.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrOEiUOE8c5n1-XzjDAEHpt9NINnxcNtQUJ5yhuvc3dBPDusN5PPFnbjAclBiJ2Xwx7grqU5iksq_cFf4Xvaqez0ysFN1_nIpPmZvn44yY14SHKQAiQLmq9KbuH9qcqEgmV9zVhVNWdrxOWrmotP_SMnZ_FLaRMYZoqzfsIw0shsUSIAzMm0B2u6GmJZZbTOfAWusCjHWlWmVPLiYeO3d2-G1Op-lwkQPt6syKmLk9RT6YdsyRl-CD8CTeCbxyjv4G6eojv5EGytI', alertText: 'Alerta Nivel 4: Crítico' },
      { id: 'scenario-4', stage: 'ETAPA 4/5', stageNum: 4, category: 'GASES TÓXICOS', title: 'Presencia Anómala de Gas Grisú (Metano)', description: 'Un sensor estacionario registra 1.9% de gas metano en la galería de exploración norte.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrOEiUOE8c5n1-XzjDAEHpt9NINnxcNtQUJ5yhuvc3dBPDusN5PPFnbjAclBiJ2Xwx7grqU5iksq_cFf4Xvaqez0ysFN1_nIpPmZvn44yY14SHKQAiQLmq9KbuH9qcqEgmV9zVhVNWdrxOWrmotP_SMnZ_FLaRMYZoqzfsIw0shsUSIAzMm0B2u6GmJZZbTOfAWusCjHWlWmVPLiYeO3d2-G1Op-lwkQPt6syKmLk9RT6YdsyRl-CD8CTeCbxyjv4G6eojv5EGytI', alertText: 'Alerta Nivel 4: Crítico' },
      { id: 'scenario-5', stage: 'ETAPA 5/5', stageNum: 5, category: 'DESAFÍO EXTREMO', title: 'Peligro de Alud por Sismo Reciente (4800 msnm)', description: 'Un temblor de 5.2 de magnitud sacude la ladera del tajo a mediodía.', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrOEiUOE8c5n1-XzjDAEHpt9NINnxcNtQUJ5yhuvc3dBPDusN5PPFnbjAclBiJ2Xwx7grqU5iksq_cFf4Xvaqez0ysFN1_nIpPmZvn44yY14SHKQAiQLmq9KbuH9qcqEgmV9zVhVNWdrxOWrmotP_SMnZ_FLaRMYZoqzfsIw0shsUSIAzMm0B2u6GmJZZbTOfAWusCjHWlWmVPLiYeO3d2-G1Op-lwkQPt6syKmLk9RT6YdsyRl-CD8CTeCbxyjv4G6eojv5EGytI', alertText: 'Alerta Nivel 5: Catastrófico' },
    ];

    for (const s of scenarios) {
      insertScenario.run(s.id, s.stage, s.stageNum, s.category, s.title, s.description, s.imageUrl, s.alertText);
    }

    const options = [
      { id: 'opt1_1', scenario_id: 'scenario-1', text: 'Suspender labor e informar a Geomecánica', description: 'Parar la maquinaria pesada en ese frente, señalizar el área y llamar al supervisor geomecánico.', calma: 8.5, seguridad: 10, tiempo: '0:25', tolerancia_frio: 90, cultural_fit_seguridad: 98, cultural_fit_etica: 90, cultural_fit_innovacion: 70 },
      { id: 'opt1_2', scenario_id: 'scenario-1', text: 'Continuar con precaución y purgar manualmente', description: 'Usar una barretilla desde una zona ya sostenida para desatar las rocas sueltas.', calma: 5.4, seguridad: 4.8, tiempo: '0:10', tolerancia_frio: 80, cultural_fit_seguridad: 50, cultural_fit_etica: 65, cultural_fit_innovacion: 80 },
      { id: 'opt2_1', scenario_id: 'scenario-2', text: 'Activar bombas auxiliares neumáticas y abrigar personal', description: 'Instalar bombas de rebose neumáticas y proveer trajes impermeables térmicos.', calma: 9.0, seguridad: 9.5, tiempo: '0:35', tolerancia_frio: 94, cultural_fit_seguridad: 95, cultural_fit_etica: 92, cultural_fit_innovacion: 85 },
      { id: 'opt2_2', scenario_id: 'scenario-2', text: 'Construir dique provisional con desmonte rápido', description: 'Utilizar el scoop para colocar fragmentos de roca y detener el rebose.', calma: 6.8, seguridad: 6.0, tiempo: '0:20', tolerancia_frio: 82, cultural_fit_seguridad: 70, cultural_fit_etica: 60, cultural_fit_innovacion: 75 },
      { id: 'opt3_1', scenario_id: 'scenario-3', text: 'Evacuar y alertar vía radio', description: 'Priorizar la vida humana, iniciando protocolo de salida inmediata.', calma: 9.4, seguridad: 10, tiempo: '0:42', tolerancia_frio: 88, cultural_fit_seguridad: 100, cultural_fit_etica: 95, cultural_fit_innovacion: 60 },
      { id: 'opt3_2', scenario_id: 'scenario-3', text: 'Intentar bypass manual', description: 'Evaluar si el ventilador puede operar a baja potencia.', calma: 6.0, seguridad: 4.0, tiempo: '1:15', tolerancia_frio: 80, cultural_fit_seguridad: 40, cultural_fit_etica: 55, cultural_fit_innovacion: 90 },
      { id: 'opt4_1', scenario_id: 'scenario-4', text: 'Corte de energía integral remota y repliegue', description: 'Desenergizar la subestación de galería inmediatamente.', calma: 9.7, seguridad: 10, tiempo: '0:31', tolerancia_frio: 85, cultural_fit_seguridad: 98, cultural_fit_etica: 96, cultural_fit_innovacion: 75 },
      { id: 'opt4_2', scenario_id: 'scenario-4', text: 'Aislar cableado in-situ y continuar monitoreo', description: 'Enviar electricista con multímetro intrínseco a encintar la zona de chispa.', calma: 4.1, seguridad: 1.5, tiempo: '2:10', tolerancia_frio: 71, cultural_fit_seguridad: 20, cultural_fit_etica: 50, cultural_fit_innovacion: 80 },
      { id: 'opt5_1', scenario_id: 'scenario-5', text: 'Bloqueo físico de rampa secundaria y refugio', description: 'Estacionar camiones CAT en bermas de seguridad y movilizar operarios a refugios.', calma: 9.5, seguridad: 10, tiempo: '1:02', tolerancia_frio: 92, cultural_fit_seguridad: 100, cultural_fit_etica: 98, cultural_fit_innovacion: 88 },
      { id: 'opt5_2', scenario_id: 'scenario-5', text: 'Despejar mineral acelerado antes del bloqueo', description: 'Acelerar la marcha de cargadores para descargar las tolvas llenas.', calma: 5.0, seguridad: 3.0, tiempo: '0:45', tolerancia_frio: 75, cultural_fit_seguridad: 30, cultural_fit_etica: 50, cultural_fit_innovacion: 82 },
    ];

    for (const o of options) {
      insertOption.run(o.id, o.scenario_id, o.text, o.description, o.calma, o.seguridad, o.tiempo, o.tolerancia_frio, o.cultural_fit_seguridad, o.cultural_fit_etica, o.cultural_fit_innovacion);
    }

    insertChat.run('admin-1', 'assistant', '¡Bienvenido a MinaMatch Puno! Soy tu asistente IA para selección minera. Puedo ayudarte con:\n\n• Análisis de candidatos mineros\n• Evaluación de escenarios de seguridad\n• Información sobre semilleros y becas\n• Matching de talento para alta montaña\n\n¿En qué puedo ayudarte hoy?', 'fallback');
  });

  tx();
}
