import { Candidate, Student, Scenario, VocQuestion, VocProfile } from '@minamatch/shared';

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Marco Quispe',
    title: 'Geólogo Senior',
    institution: 'UNA Puno',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDthZZXHgFD3hyR_0TUOCwsIcx9wnKAU0Zt51v-_KSl1LLR-BOeeamZzdTOO2tMwAkD4r7-p_yOfgP7KsAbqPbb_5Pv58rbvfVGul0UiASAR5HS_VPEFNAgeImO0pufHzh3PCqXfwGcjhMpVwj9Iw5-aKr21RfzhVFqfLwV2cq9uPsJT_UZu4WjsWPFARRQsxuTb-Ey6dbnXphreIW97J7RwGwrMVtB5A54YifgXh3Pa_5hIZV02NxJxZknNo7wPEu787uLLLWpVpg',
    expYears: 8,
    english: 'INGLÉS C1',
    languages: ['Español', 'Inglés C1', 'Quechua básico'],
    matchRating: 92,
    skills: ['Geomecánica', 'Planeamiento', 'Relaciones Comunitarias'],
    socialFit: 88,
    altitudeFit: 4500,
    certified: true,
    isTop5: true,
    hasOsha: false,
    regionalRadar: 'Geólogos en Carabaya',
    bio: 'Experto en modelamiento estructural y estabilidad de taludes en minas subterráneas. Ha liderado campañas de exploración en Carabaya y cuenta con certificación internacional en seguridad de excavaciones.',
    aiInterviewTranscript: [
      {
        question: '¿Cómo procedería ante una alerta inesperada de vibración tectónica en el muro principal?',
        answer: 'Priorizo la evacuación segura del personal antes de cualquier análisis técnico. Posteriormente, uso sensores geofísicos remotos para evaluar la subsidencia.'
      },
      {
        question: '¿Qué experiencia tiene coordinando operaciones a más de 4500 msnm?',
        answer: 'Llevo 6 años viviendo y trabajando en la unidad San Rafael en Puno. Mi cuerpo está plenamente adaptado y entiendo los protocolos de prevención de hipoxia.'
      }
    ]
  },
  {
    id: '2',
    name: 'Elena Mamani',
    title: 'Ingeniera de Minas',
    institution: 'UNI',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvx-J5u4GJCu2Z-os7CGn1gPIF-2ib-I2mfv-P4gPGtkvU-b6gP12FjwfZCnMWNGpJbxjOb7EcvkCbjrLZ8gKUWLd_FBf23WqyRSJfv3XIrHuaAyh_zfOgvx4zhBV8Q7Y7QDZgVVqcaFEou_xfYBLbMncVDjSaG2PmNMNxSBE_mVg64QfRyMbF-4XAioqPZ-Pd7sDe3GPBXfhKF1uZbgl7kQoEjCMRVs1F0taJ5OXIatTGjOg191Gfgu3q9RZgGW93Cq1UZdDsJ1A',
    expYears: 5,
    english: 'QUECHUA',
    languages: ['Español', 'Quechua nativo', 'Inglés B2'],
    matchRating: 78,
    skills: ['Ventilación', 'Software Mine', 'Seguridad'],
    socialFit: 95,
    altitudeFit: 4200,
    certified: false,
    isTop5: false,
    hasOsha: false,
    regionalRadar: 'Supervisores en San Gabán',
    bio: 'Ingeniera de minas especializada en diseño de redes de ventilación y simulación con Ventsim. Capacidad comprobada de liderazgo de cuadrillas técnicas y bilingüe en Quechua y Español.',
    aiInterviewTranscript: [
      {
        question: '¿Cuál ha sido su mayor desafío diseñando redes de ventilación subterránea?',
        answer: 'Optimizar el circuito secundario del nivel 380 con alto contenido de polvo en suspensión. Redujimos el factor de obstrucción en un 35%.'
      }
    ]
  },
  {
    id: '3',
    name: 'Jorge Flores',
    title: 'Seguridad Minera',
    institution: 'UNA Puno',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2gu67w6nONxTov8nhG6kZVx2E1lZnUuH7Pnk8URP32Cddt_9vA_3FYea3hHeYCUzXqr6aXlPTiX-IH818ztmBN46e3KDwonaXO_gHOciHYzDCYOnjYUikh4xOqrc2ErkWosTu7m7Y-geS4N47QybIw8IiN44yHbBwvMWBSZZsUnfFWIVIlwc-X7OtAOBtmjcSW2LbwbDxmsV7GI8CNJ8t5BBmwbWIL0LweIOFwkB5AS2DGuZ-khed9JD8-GOeiUIx2vECx8_MWOo',
    expYears: 7,
    english: 'INGLÉS B2',
    languages: ['Español', 'Inglés B2'],
    matchRating: 86,
    skills: ['Seguridad', 'Control de Pérdidas', 'Rescate'],
    socialFit: 72,
    altitudeFit: 4700,
    certified: true,
    isTop5: true,
    hasOsha: true,
    regionalRadar: 'Especialistas HSE en Ananea',
    bio: 'Especialista en prevención de riesgos laborales con certificación OSHA de 30 horas. Instructor certificado de rescate minero con amplia experiencia en Puno y Huancavelica.',
    aiInterviewTranscript: [
      {
        question: '¿Cómo evalúa la cultura de seguridad en operaciones mineras de alta montaña?',
        answer: 'La seguridad no es negociable por objetivos de producción. Implemento caminatas conductuales de liderazgo visible diariamente.'
      }
    ]
  },
  {
    id: '4',
    name: 'Carlos Mendoza P.',
    title: 'Geólogo de Operaciones',
    institution: 'UNA Puno',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKDasJR9SojBYATAK7z5W06o9G4B0NnCjHtsFmKcIbicScMcRm5nPzNArzJTHc8fNFQIrIkJuC20XYvrDKvgdofb0aUnubO9kbI57wBTxGj9bK6MjKTW7ZB6xuk7wbRHwp568KSTQMqt6fRkRXggIL7TOpjfUAq2IgK_jYEl3GaQFE8emi1NvktPVSn-yDfAOQmzExxSpP-3CsLIPixwlhZdFvPsPQSphmOmMPkvh7UoBUgYHiN9Rleq0hVctq0i0rKoD4PudQzXU',
    expYears: 6,
    english: 'INGLÉS B1',
    languages: ['Español', 'Inglés B1'],
    matchRating: 92,
    skills: ['Geomecánica', 'Planeamiento', 'LHD Op.'],
    altitudeFit: 4500,
    certified: true,
    isTop5: false,
    hasOsha: false,
    regionalRadar: 'Geólogos en Carabaya',
    bio: 'Geólogo con certificación expedida por MinaMatch para alta montaña. Desempeño óptimo en mapeo geomecánico de labores y control de bypass estructural.',
    aiInterviewTranscript: [
      {
        question: '¿Cómo maneja la fatiga física por hipoxia durante jornadas largas en interior mina?',
        answer: 'Sigo estrictamente los descansos programados, asimilando suficiente hidratación. Si los síntomas de soroche persisten, hago uso monitorizado de los tanques de oxígeno regulados.'
      }
    ]
  },
  {
    id: '5',
    name: 'Elena Ramos G.',
    title: 'Jefe de Ventilación',
    institution: 'UNA Puno',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWa17sy1FXf9W9QwFqOpwB3vW0pbK0uzJHQBGdkDSaRWh3HioAC8D4jY7qn3udma4vCrXPaJxENxJpmvJB4Cfj2WF7q-gLtzoh69-Jiv5nUKE47yimLQ2mnt-w_8RrKhOiUlUaMdWYn-yOE4yyMNci3Ulabc7FQeMoCV66oZZ2Rb1AA6HPQda5BhRMDuZ7UYDsQDsY6Fpf0g_niz0sjTp-g8YVPK1cgZTLFgKjQy_yFlf33tAVuscjvfVz0Q1hyDTMHGZ0Ek77DQg',
    expYears: 9,
    english: 'INGLÉS C1',
    languages: ['Español', 'Inglés C1', 'Quechua avanzado'],
    matchRating: 78,
    skills: ['Ventilación', 'Software Mine', 'Seguridad'],
    altitudeFit: 4800,
    certified: true,
    isTop5: false,
    hasOsha: true,
    regionalRadar: 'Jefes de Ventilación en Crucero',
    bio: 'Experta en diseño y balance de flujos térmicos en labores mineras subyacentes con temperaturas extremas. Certificación apta para labores a más de 4800 msnm.',
    aiInterviewTranscript: [
      {
        question: '¿Qué criterio usa para calcular la caída de presión en ventiladores primarios axiales a gran altitud?',
        answer: 'Ajusto el factor de densidad del aire proporcionalmente a la presión barométrica local de Puno. A 4800 msnm la densidad disminuye más del 40%, por lo que la velocidad r.p.m. debe optimizarse para compensar el volumen real requerido.'
      }
    ]
  },
  {
    id: '6',
    name: 'Mateo Quispe J.',
    title: 'Supervisor de Operaciones',
    institution: 'UNI',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChWuZWQZu89kwDHjsLfEDD5HP2VdZ6Xnl7TquMGgHb8x1keMc87aUd0JoQMZMd9O844PCsU8QVkIdHVgQZan59-N0dwkJcIYKWlG_5N6WRwjsUxRWKtq0wOtghJk6YTih27f0airjzGxvSFyLjALiB34u0NEhxhqERnZ1BrY5DU18GLiL9SpH4bNGEU86hiB7IDPKLqfjodx-HGuA4kNlbTf6yTfkLFee0mj4djZLQyEHXmROvm_z5gKpKklAg94a2XdCKlcbXBYs',
    expYears: 4,
    english: 'Español',
    languages: ['Español'],
    matchRating: 45,
    skills: ['Costos', 'Operaciones'],
    altitudeFit: 0, // No Evaluado
    certified: false,
    warning: 'Altitud: No Evaluado',
    isTop5: false,
    hasOsha: false,
    regionalRadar: 'Supervisores en Juliaca',
    bio: 'Profesional de minería con foco en control de presupuesto unitario por metro avanzado. Su legajo registra que aún no ha asistido a los exámenes de adaptación barométrica de alta montaña.',
    aiInterviewTranscript: [
      {
        question: '¿Por qué aún no ha rendido el test de adaptación en cámara hiperbárica?',
        answer: 'Tuve un retraso logístico en el centro médico ocupacional, pero estoy programando la fecha para completarlo a la brevedad.'
      }
    ]
  }
];

export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: 'Juan Pérez',
    badge: 'Beca Minsur',
    program: 'Semilleros Puno v4.2',
    status: 'FINALIZADO',
    syllabus: [
      { id: '1', course: 'Seguridad Subterránea', completed: true },
      { id: '2', course: 'Gestión Ambiental', completed: true },
      { id: '3', course: 'Operaciones de Tajo Abierto', completed: true },
      { id: '4', course: 'Ética y Responsabilidad Social', completed: true }
    ],
    verificationHash: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    matchingScore: 98.4,
    retentionMonths: 24,
    signingBonus: 4500,
    timestamp: '2023-10-24T14:22:01.442Z',
    validatorNode: 'PUNO-MAIN-04',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChTWi8ViaB82sqJauvh_WkV4g21m_kjV0GIqpGC10wGM6XsQ6O5vatCtaP_iaQrtdstWs7yn5zTRpBKRSY9HTy2jIwf2CT_GUWdk2E6OGxz1NLbg-XUBV6mf63U_mjAZn5_8Wq3OSOECyOABQfhZChIPycPeUhX_zketNm52XLHb-xJ1gocF9vuYFyd0nOzP2aFL2x_-V_-3au6IKXiEZ3h7rzif1AH3CgJTtM0ped7hn7R8RH0VZ02TSmYSZxbFna8RiMs2cNO8I'
  },
  {
    id: 'student-2',
    name: 'Yeny Cutipa',
    badge: 'Beca Minsur',
    program: 'Semilleros Puno v4.2',
    status: 'EN_CURSO',
    syllabus: [
      { id: '1', course: 'Seguridad Subterránea', completed: true },
      { id: '2', course: 'Gestión Ambiental', completed: true },
      { id: '3', course: 'Operaciones de Tajo Abierto', completed: false },
      { id: '4', course: 'Ética y Responsabilidad Social', completed: true }
    ],
    verificationHash: '0x8F5342AE7CD78B098defB751B7401B5f6d8995E',
    matchingScore: 82.5,
    retentionMonths: 18,
    signingBonus: 3800,
    timestamp: '2023-11-12T09:15:33.109Z',
    validatorNode: 'PUNO-SEC-02',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWa17sy1FXf9W9QwFqOpwB3vW0pbK0uzJHQBGdkDSaRWh3HioAC8D4jY7qn3udma4vCrXPaJxENxJpmvJB4Cfj2WF7q-gLtzoh69-Jiv5nUKE47yimLQ2mnt-w_8RrKhOiUlUaMdWYn-yOE4yyMNci3Ulabc7FQeMoCV66oZZ2Rb1AA6HPQda5BhRMDuZ7UYDsQDsY6Fpf0g_niz0sjTp-g8YVPK1cgZTLFgKjQy_yFlf33tAVuscjvfVz0Q1hyDTMHGZ0Ek77DQg'
  },
  {
    id: 'student-3',
    name: 'Marco Quispe',
    badge: 'Beca Anglo American',
    program: 'Semilleros Puno v4.1',
    status: 'EN_CURSO',
    syllabus: [
      { id: '1', course: 'Seguridad Subterránea', completed: true },
      { id: '2', course: 'Gestión Ambiental', completed: true },
      { id: '3', course: 'Operaciones de Tajo Abierto', completed: true },
      { id: '4', course: 'Ética y Responsabilidad Social', completed: false },
      { id: '5', course: 'Geomecánica Aplicada', completed: true },
      { id: '6', course: 'Ventilación de Minas', completed: false }
    ],
    verificationHash: '0x3A2F45BC91DE6780FEDcba9876543210F1234567',
    matchingScore: 65.3,
    retentionMonths: 12,
    signingBonus: 3200,
    timestamp: '2024-01-15T10:30:00.000Z',
    validatorNode: 'PUNO-MAIN-02',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDthZZXHgFD3hyR_0TUOCwsIcx9wnKAU0Zt51v-_KSl1LLR-BOeeamZzdTOO2tMwAkD4r7-p_yOfgP7KsAbqPbb_5Pv58rbvfVGul0UiASAR5HS_VPEFNAgeImO0pufHzh3PCqXfwGcjhMpVwj9Iw5-aKr21RfzhVFqfLwV2cq9uPsJT_UZu4WjsWPFARRQsxuTb-Ey6dbnXphreIW97J7RwGwrMVtB5A54YifgXh3Pa_5hIZV02NxJxZknNo7wPEu787uLLLWpVpg'
  },
  {
    id: 'student-4',
    name: 'Elena Mamani',
    badge: 'Beca Minsur',
    program: 'Semilleros Puno v4.2',
    status: 'FINALIZADO',
    syllabus: [
      { id: '1', course: 'Seguridad Subterránea', completed: true },
      { id: '2', course: 'Gestión Ambiental', completed: true },
      { id: '3', course: 'Operaciones de Tajo Abierto', completed: true },
      { id: '4', course: 'Ética y Responsabilidad Social', completed: true }
    ],
    verificationHash: '0x9E8C7765AB43d210FEDcba9876543210F89ABCDE',
    matchingScore: 95.2,
    retentionMonths: 36,
    signingBonus: 5200,
    timestamp: '2024-02-20T08:45:00.000Z',
    validatorNode: 'PUNO-SEC-01',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvx-J5u4GJCu2Z-os7CGn1gPIF-2ib-I2mfv-P4gPGtkvU-b6gP12FjwfZCnMWNGpJbxjOb7EcvkCbjrLZ8gKUWLd_FBf23WqyRSJfv3XIrHuaAyh_zfOgvx4zhBV8Q7Y7QDZgVVqcaFEou_xfYBLbMncVDjSaG2PmNMNxSBE_mVg64QfRyMbF-4XAioqPZ-Pd7sDe3GPBXfhKF1uZbgl7kQoEjCMRVs1F0taJ5OXIatTGjOg191Gfgu3q9RZgGW93Cq1UZdDsJ1A'
  },
  {
    id: 'student-5',
    name: 'Jorge Flores',
    badge: 'Beca Buenaventura',
    program: 'Semilleros Puno v4.0',
    status: 'EN_CURSO',
    syllabus: [
      { id: '1', course: 'Seguridad Subterránea', completed: true },
      { id: '2', course: 'Gestión Ambiental', completed: false },
      { id: '3', course: 'Operaciones de Tajo Abierto', completed: false },
      { id: '4', course: 'Ética y Responsabilidad Social', completed: true },
      { id: '5', course: 'Rescate Minero', completed: true }
    ],
    verificationHash: '0xB2A1C3D4E5F67890FEDcba9876543210FABCDEF1',
    matchingScore: 45.8,
    retentionMonths: 18,
    signingBonus: 2800,
    timestamp: '2024-03-05T14:10:00.000Z',
    validatorNode: 'PUNO-SEC-03',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2gu67w6nONxTov8nhG6kZVx2E1lZnUuH7Pnk8URP32Cddt_9vA_3FYea3hHeYCUzXqr6aXlPTiX-IH818ztmBN46e3KDwonaXO_gHOciHYzDCYOnjYUikh4xOqrc2ErkWosTu7m7Y-geS4N47QybIw8IiN44yHbBwvMWBSZZsUnfFWIVIlwc-X7OtAOBtmjcSW2LbwbDxmsV7GI8CNJ8t5BBmwbWIL0LweIOFwkB5AS2DGuZ-khed9JD8-GOeiUIx2vECx8_MWOo'
  },
  {
    id: 'student-6',
    name: 'Carlos Mendoza P.',
    badge: 'Beca Minsur',
    program: 'Semilleros Puno v4.2',
    status: 'FINALIZADO',
    syllabus: [
      { id: '1', course: 'Seguridad Subterránea', completed: true },
      { id: '2', course: 'Gestión Ambiental', completed: true },
      { id: '3', course: 'Operaciones de Tajo Abierto', completed: true },
      { id: '4', course: 'Ética y Responsabilidad Social', completed: true }
    ],
    verificationHash: '0xFEDCBA9876543210FEDcba9876543210F6543210',
    matchingScore: 97.1,
    retentionMonths: 30,
    signingBonus: 4900,
    timestamp: '2024-04-10T11:00:00.000Z',
    validatorNode: 'PUNO-MAIN-01',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKDasJR9SojBYATAK7z5W06o9G4B0NnCjHtsFmKcIbicScMcRm5nPzNArzJTHc8fNFQIrIkJuC20XYvrDKvgdofb0aUnubO9kbI57wBTxGj9bK6MjKTW7ZB6xuk7wbRHwp568KSTQMqt6fRkRXggIL7TOpjfUAq2IgK_jYEl3GaQFE8emi1NvktPVSn-yDfAOQmzExxSpP-3CsLIPixwlhZdFvPsPQSphmOmMPkvh7UoBUgYHiN9Rleq0hVctq0i0rKoD4PudQzXU'
  },
  {
    id: 'student-7',
    name: 'Elena Ramos G.',
    badge: 'Beca Anglo American',
    program: 'Semilleros Puno v4.1',
    status: 'EN_CURSO',
    syllabus: [
      { id: '1', course: 'Seguridad Subterránea', completed: true },
      { id: '2', course: 'Gestión Ambiental', completed: true },
      { id: '3', course: 'Operaciones de Tajo Abierto', completed: true },
      { id: '4', course: 'Ética y Responsabilidad Social', completed: true },
      { id: '5', course: 'Ventilación de Minas', completed: true },
      { id: '6', course: 'Geomecánica Aplicada', completed: false },
      { id: '7', course: 'Logística Minera', completed: false }
    ],
    verificationHash: '0x1122334455667788FEDcba9876543210FABCDEF2',
    matchingScore: 71.4,
    retentionMonths: 24,
    signingBonus: 4100,
    timestamp: '2024-05-18T16:30:00.000Z',
    validatorNode: 'PUNO-MAIN-03',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWa17sy1FXf9W9QwFqOpwB3vW0pbK0uzJHQBGdkDSaRWh3HioAC8D4jY7qn3udma4vCrXPaJxENxJpmvJB4Cfj2WF7q-gLtzoh69-Jiv5nUKE47yimLQ2mnt-w_8RrKhOiUlUaMdWYn-yOE4yyMNci3Ulabc7FQeMoCV66oZZ2Rb1AA6HPQda5BhRMDuZ7UYDsQDsY6Fpf0g_niz0sjTp-g8YVPK1cgZTLFgKjQy_yFlf33tAVuscjvfVz0Q1hyDTMHGZ0Ek77DQg'
  },
  {
    id: 'student-8',
    name: 'Mateo Quispe J.',
    badge: 'Beca Minsur',
    program: 'Semilleros Puno v4.2',
    status: 'EN_CURSO',
    syllabus: [
      { id: '1', course: 'Seguridad Subterránea', completed: true },
      { id: '2', course: 'Gestión Ambiental', completed: false },
      { id: '3', course: 'Operaciones de Tajo Abierto', completed: false },
      { id: '4', course: 'Ética y Responsabilidad Social', completed: false }
    ],
    verificationHash: '0xABCDEF1234567890FEDcba9876543210FABCDEF3',
    matchingScore: 25.0,
    retentionMonths: 12,
    signingBonus: 2500,
    timestamp: '2024-06-01T07:00:00.000Z',
    validatorNode: 'PUNO-SEC-04',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChWuZWQZu89kwDHjsLfEDD5HP2VdZ6Xnl7TquMGgHb8x1keMc87aUd0JoQMZMd9O844PCsU8QVkIdHVgQZan59-N0dwkJcIYKWlG_5N6WRwjsUxRWKtq0wOtghJk6YTih27f0airjzGxvSFyLjALiB34u0NEhxhqERnZ1BrY5DU18GLiL9SpH4bNGEU86hiB7IDPKLqfjodx-HGuA4kNlbTf6yTfkLFee0mj4djZLQyEHXmROvm_z5gKpKklAg94a2XdCKlcbXBYs'
  }
];

export const vocationalProfiles: VocProfile[] = [
  {
    id: 'geologo',
    name: 'Geólogo de Mina',
    title: 'Geología y Exploraciones',
    description: 'Especialista en mapeo geológico estructural, cubicación de recursos y control de leyes en interior mina. Responsable del modelo geológico que guía la producción diaria.',
    skills: ['Mapeo estructural', 'Logging de sondajes', 'Software mine (Datamine, Leapfrog)', 'Interpretación geofísica', 'Control de leyes'],
    dailyTasks: ['Mapear frentes de avance y tajos', 'Actualizar modelo de bloques', 'Supervisar sondajes de producción', 'Coordinar con topografía y geomecánica'],
    demandLevel: 'Alta demanda en Cerro Lindo y minas subterráneas polimetálicas',
    color: '#b91c1c',
  },
  {
    id: 'hse',
    name: 'Ingeniero HSE',
    title: 'Seguridad, Salud Ocupacional y Medio Ambiente',
    description: 'Profesional encargado de implementar el sistema de gestión de seguridad, prevención de riesgos y cumplimiento normativo ambiental en operaciones mineras.',
    skills: ['ISO 45001', 'Análisis de riesgos', 'Investigación de incidentes', 'Auditoría ambiental', 'Planes de emergencia'],
    dailyTasks: ['Inspeccionar áreas de trabajo', 'Capacitar en seguridad', 'Investigar incidentes', 'Monitorear indicadores HSE', 'Elaborar reportes regulatorios'],
    demandLevel: 'Crítico en toda operación minera. Obligatorio para D.S. 024-2016-EM',
    color: '#ca8a04',
  },
  {
    id: 'operaciones',
    name: 'Supervisor de Operaciones',
    title: 'Operaciones Mina Subterránea',
    description: 'Líder de turno responsable de la producción, avance de frentes y coordinación de equipos de acarreo y perforación en interior mina.',
    skills: ['Planificación de producción', 'Liderazgo de equipos', 'Ciclo de minado', 'Optimización de recursos', 'Reportes de producción'],
    dailyTasks: ['Asignar equipos y personal', 'Supervisar disparos y limpieza', 'Controlar dilución y leyes', 'Reportar producción del turno'],
    demandLevel: 'Demanda constante en minas subterráneas mecanizadas',
    color: '#0369a1',
  },
  {
    id: 'metalurgista',
    name: 'Metalurgista / Procesos',
    title: 'Planta Concentradora',
    description: 'Ingeniero de procesos encargado de la operación y optimización del circuito de flotación, molienda y espesamiento para maximizar recuperación metalúrgica.',
    skills: ['Flotación de polimetálicos', 'Balance de masas', 'Control de procesos', 'Optimización de reactivos', 'Análisis granulométrico'],
    dailyTasks: ['Monitorear variables de planta', 'Ajustar dosificación de reactivos', 'Analizar muestras de laboratorio', 'Optimizar recuperación y calidad'],
    demandLevel: 'Alta demanda en plantas concentradoras como Cerro Lindo',
    color: '#7c3aed',
  },
  {
    id: 'mecanico',
    name: 'Mecánico de Equipos',
    title: 'Mantenimiento Mecánico',
    description: 'Técnico especializado en mantenimiento preventivo y correctivo de equipos mineros pesados: Jumbos, Scoops, Dumpers y equipos auxiliares.',
    skills: ['Hidráulica', 'Motores diésel', 'Sistemas eléctricos', 'Soldadura', 'Diagnóstico de fallas'],
    dailyTasks: ['Mantener flota de equipos', 'Diagnosticar averías', 'Ejecutar mantenimiento programado', 'Gestionar repuestos críticos'],
    demandLevel: 'Siempre requerido en operaciones con flota de equipos subterráneos',
    color: '#15803d',
  },
  {
    id: 'geomecanico',
    name: 'Geomecánico',
    title: 'Geomecánica y Sostenimiento',
    description: 'Ingeniero especializado en estabilidad de excavaciones subterráneas, diseño de sostenimiento y monitoreo de convergencia en labores mineras.',
    skills: ['Clasificación RMR/Q de Barton', 'Diseño de malla de sostenimiento', 'Monitoreo de convergencia', 'Análisis numérico (Phase2, RS2)', 'Instrumentación geotécnica'],
    dailyTasks: ['Evaluar condiciones del macizo rocoso', 'Diseñar sostenimiento', 'Monitorear deformaciones', 'Inspeccionar labores críticas'],
    demandLevel: 'Demanda creciente por profundización de minas y condiciones geomecánicas complejas',
    color: '#0d9488',
  },
  {
    id: 'ambiental',
    name: 'Ambiental / Relaciones Comunitarias',
    title: 'Gestión Ambiental y Social',
    description: 'Profesional que asegura el cumplimiento ambiental, manejo de residuos, monitoreo de efluentes y relacionamiento con comunidades del área de influencia.',
    skills: ['EIA y PAMA', 'Monitoreo de calidad de agua', 'Manejo de relaves', 'Relaciones comunitarias', 'Legislación minera ambiental'],
    dailyTasks: ['Monitorear parámetros ambientales', 'Gestionar residuos', 'Coordinar con comunidades', 'Elaborar informes OEFA'],
    demandLevel: 'Crítico para permisos sociales y sostenibilidad operativa',
    color: '#65a30d',
  },
  {
    id: 'topografo',
    name: 'Topógrafo de Mina',
    title: 'Topografía y Levantamientos',
    description: 'Técnico responsable del levantamiento topográfico subterráneo, control de desviaciones de perforación, cubicaciones y replanteo de labores mineras.',
    skills: ['Estación total', 'Drone mapping', 'Software CAD minero', 'Control de desviaciones', 'Cubicaciones'],
    dailyTasks: ['Levantar labores subterráneas', 'Replantear chimeneas y accesos', 'Controlar desviación de taladros', 'Actualizar planos de mina'],
    demandLevel: 'Soporte esencial para operaciones precisas de avance y producción',
    color: '#a21caf',
  },
];

export const vocQuestions: VocQuestion[] = [
  {
    id: 'q1',
    question: '¿En qué tipo de entorno prefieres trabajar la mayor parte del tiempo?',
    dimension: 'Entorno Laboral',
    icon: '🏔️',
    options: [
      { id: 'q1a', text: 'Interior de mina, frente a frente con el macizo rocoso', scores: { geologo: 10, operaciones: 10, geomecanico: 10, topografo: 9, hse: 5, mecanico: 6, metalurgista: 1, ambiental: 2 } },
      { id: 'q1b', text: 'Planta concentradora, supervisando procesos metalúrgicos', scores: { metalurgista: 10, mecanico: 7, hse: 4, ambiental: 3, geologo: 2, operaciones: 2, geomecanico: 1, topografo: 1 } },
      { id: 'q1c', text: 'Oficina técnica, analizando datos y planificando', scores: { geologo: 7, geomecanico: 8, ambiental: 6, metalurgista: 5, hse: 5, operaciones: 4, topografo: 4, mecanico: 2 } },
      { id: 'q1d', text: 'Campo abierto, exploración y relación con comunidades', scores: { ambiental: 10, topografo: 8, geologo: 7, hse: 3, operaciones: 2, geomecanico: 2, metalurgista: 1, mecanico: 1 } },
    ],
  },
  {
    id: 'q2',
    question: 'Ante una falla geológica inesperada en un tajo de producción, ¿cuál es tu primera reacción?',
    dimension: 'Toma de Decisiones',
    icon: '⚡',
    options: [
      { id: 'q2a', text: 'Detener la operación y evaluar estructuralmente la zona', scores: { geomecanico: 10, geologo: 9, hse: 8, operaciones: 4, metalurgista: 1, mecanico: 2, ambiental: 2, topografo: 3 } },
      { id: 'q2b', text: 'Redirigir el tráfico de equipos y continuar en otra zona', scores: { operaciones: 10, topografo: 5, mecanico: 4, hse: 4, geologo: 3, geomecanico: 3, metalurgista: 1, ambiental: 1 } },
      { id: 'q2c', text: 'Asegurar el perímetro y reportar a supervisión', scores: { hse: 10, operaciones: 8, geomecanico: 6, geologo: 5, ambiental: 3, mecanico: 3, topografo: 2, metalurgista: 1 } },
      { id: 'q2d', text: 'Tomar muestras y registrar la estructura para el modelo geológico', scores: { geologo: 10, geomecanico: 7, topografo: 6, metalurgista: 2, hse: 2, operaciones: 2, ambiental: 2, mecanico: 1 } },
    ],
  },
  {
    id: 'q3',
    question: '¿Qué tipo de problema técnico te resulta más motivante resolver?',
    dimension: 'Especialización Técnica',
    icon: '🔧',
    options: [
      { id: 'q3a', text: 'Optimizar la malla de sostenimiento para reducir costos sin sacrificar seguridad', scores: { geomecanico: 10, geologo: 7, operaciones: 5, hse: 5, metalurgista: 1, mecanico: 2, ambiental: 1, topografo: 2 } },
      { id: 'q3b', text: 'Ajustar el circuito de flotación para mejorar la recuperación de zinc', scores: { metalurgista: 10, mecanico: 3, hse: 2, ambiental: 3, geologo: 2, operaciones: 2, geomecanico: 1, topografo: 1 } },
      { id: 'q3c', text: 'Reparar un scoop que falló en pleno turno de producción', scores: { mecanico: 10, operaciones: 7, hse: 2, geologo: 1, metalurgista: 2, geomecanico: 1, topografo: 1, ambiental: 1 } },
      { id: 'q3d', text: 'Diseñar un plan de cierre de mina con responsabilidad social', scores: { ambiental: 10, hse: 6, geologo: 4, operaciones: 3, geomecanico: 3, metalurgista: 3, topografo: 2, mecanico: 1 } },
    ],
  },
  {
    id: 'q4',
    question: 'En una situación donde la producción y la seguridad entran en conflicto, ¿qué haces?',
    dimension: 'Seguridad vs Producción',
    icon: '🛡️',
    options: [
      { id: 'q4a', text: 'Detener la producción inmediatamente hasta que las condiciones sean seguras', scores: { hse: 10, geomecanico: 8, geologo: 6, ambiental: 5, operaciones: 3, metalurgista: 3, mecanico: 3, topografo: 3 } },
      { id: 'q4b', text: 'Evaluar el nivel de riesgo y si es controlable, continuar con medidas mitigantes', scores: { operaciones: 9, geomecanico: 7, geologo: 6, mecanico: 5, hse: 4, metalurgista: 4, topografo: 4, ambiental: 3 } },
      { id: 'q4c', text: 'Consultar al superior y acatar la decisión técnica', scores: { topografo: 8, metalurgista: 7, mecanico: 6, ambiental: 6, geologo: 5, geomecanico: 4, operaciones: 4, hse: 3 } },
    ],
  },
  {
    id: 'q5',
    question: '¿Cómo prefieres contribuir a un equipo de trabajo en minería?',
    dimension: 'Trabajo en Equipo',
    icon: '👥',
    options: [
      { id: 'q5a', text: 'Liderando la cuadrilla y tomando decisiones rápidas en terreno', scores: { operaciones: 10, hse: 6, geomecanico: 5, geologo: 4, mecanico: 4, topografo: 3, metalurgista: 3, ambiental: 2 } },
      { id: 'q5b', text: 'Aportando análisis técnico detallado y data precisa', scores: { geologo: 9, geomecanico: 9, metalurgista: 8, topografo: 8, ambiental: 6, hse: 5, mecanico: 3, operaciones: 2 } },
      { id: 'q5c', text: 'Manteniendo los equipos operativos y resolviendo fallas', scores: { mecanico: 10, operaciones: 6, topografo: 3, hse: 2, geologo: 2, geomecanico: 2, metalurgista: 4, ambiental: 1 } },
      { id: 'q5d', text: 'Asegurando que todos trabajen seguro y cumplan las normas', scores: { hse: 10, ambiental: 7, operaciones: 5, geomecanico: 4, geologo: 3, metalurgista: 3, mecanico: 3, topografo: 2 } },
    ],
  },
  {
    id: 'q6',
    question: 'Tu nivel de disposición para trabajar en condiciones de altura geográfica (+4000 msnm) es:',
    dimension: 'Adaptabilidad Física',
    icon: '🏔️',
    options: [
      { id: 'q6a', text: 'Totalmente dispuesto, ya estoy aclimatado o vivo en zona altoandina', scores: { geologo: 10, geomecanico: 10, operaciones: 9, topografo: 9, hse: 8, mecanico: 7, ambiental: 8, metalurgista: 4 } },
      { id: 'q6b', text: 'Dispuesto con periodo de aclimatación previa', scores: { hse: 7, mecanico: 7, ambiental: 7, metalurgista: 6, topografo: 6, operaciones: 5, geologo: 4, geomecanico: 4 } },
      { id: 'q6c', text: 'Preferiría trabajar en zonas de menor altitud, como la costa', scores: { metalurgista: 8, mecanico: 5, ambiental: 4, hse: 3, topografo: 3, operaciones: 2, geologo: 1, geomecanico: 1 } },
    ],
  },
  {
    id: 'q7',
    question: '¿Qué herramienta o software te llama más la atención dominar?',
    dimension: 'Interés Técnico',
    icon: '💻',
    options: [
      { id: 'q7a', text: 'Software de modelamiento geológico 3D (Leapfrog, Datamine)', scores: { geologo: 10, geomecanico: 7, topografo: 5, metalurgista: 2, hse: 1, operaciones: 2, mecanico: 1, ambiental: 1 } },
      { id: 'q7b', text: 'Software de simulación de procesos (METSIM, JKSimMet)', scores: { metalurgista: 10, ambiental: 3, geologo: 2, hse: 2, mecanico: 2, operaciones: 2, geomecanico: 1, topografo: 1 } },
      { id: 'q7c', text: 'Sistemas de monitoreo geotécnico (instrumentación, radar)', scores: { geomecanico: 10, hse: 6, geologo: 6, topografo: 5, operaciones: 3, ambiental: 2, mecanico: 2, metalurgista: 1 } },
      { id: 'q7d', text: 'Sistemas de gestión HSE y reportabilidad ambiental', scores: { hse: 10, ambiental: 9, operaciones: 4, geologo: 2, geomecanico: 2, metalurgista: 2, mecanico: 2, topografo: 1 } },
    ],
  },
  {
    id: 'q8',
    question: '¿Cómo manejas la presión en un turno nocturno con avería crítica?',
    dimension: 'Manejo de Presión',
    icon: '🔥',
    options: [
      { id: 'q8a', text: 'Mantengo la calma, priorizo y ejecuto el plan paso a paso', scores: { operaciones: 10, hse: 8, geomecanico: 7, geologo: 6, mecanico: 6, topografo: 5, metalurgista: 5, ambiental: 4 } },
      { id: 'q8b', text: 'Me enfoco en diagnosticar la causa raíz técnicamente', scores: { mecanico: 10, geologo: 8, geomecanico: 8, metalurgista: 7, topografo: 4, hse: 3, operaciones: 3, ambiental: 2 } },
      { id: 'q8c', text: 'Activo el protocolo de emergencia y comunico a supervisión', scores: { hse: 10, operaciones: 7, geomecanico: 5, geologo: 4, ambiental: 4, metalurgista: 3, mecanico: 3, topografo: 3 } },
    ],
  },
  {
    id: 'q9',
    question: '¿Qué área de la minería crees que tendrá mayor impacto en los próximos 10 años?',
    dimension: 'Visión de Futuro',
    icon: '🔮',
    options: [
      { id: 'q9a', text: 'Minería automatizada y digitalización de operaciones', scores: { operaciones: 8, mecanico: 8, topografo: 7, geologo: 6, geomecanico: 5, metalurgista: 4, hse: 3, ambiental: 2 } },
      { id: 'q9b', text: 'Gestión ambiental y minería sostenible con comunidades', scores: { ambiental: 10, hse: 7, geologo: 4, metalurgista: 4, operaciones: 3, geomecanico: 3, mecanico: 2, topografo: 2 } },
      { id: 'q9c', text: 'Exploración y modelamiento geológico con IA', scores: { geologo: 10, geomecanico: 6, topografo: 5, metalurgista: 3, hse: 2, operaciones: 2, ambiental: 2, mecanico: 1 } },
      { id: 'q9d', text: 'Seguridad minera con monitoreo IoT en tiempo real', scores: { hse: 10, geomecanico: 7, operaciones: 5, mecanico: 4, topografo: 3, ambiental: 3, geologo: 2, metalurgista: 2 } },
    ],
  },
  {
    id: 'q10',
    question: '¿Qué tarea te resulta más satisfactoria al final del día?',
    dimension: 'Motivación Laboral',
    icon: '⭐',
    options: [
      { id: 'q10a', text: 'Ver el avance de producción y las toneladas movidas', scores: { operaciones: 10, mecanico: 5, geologo: 4, topografo: 4, hse: 2, geomecanico: 2, metalurgista: 2, ambiental: 1 } },
      { id: 'q10b', text: 'Resolver un problema técnico complejo que otros no pudieron', scores: { mecanico: 10, geomecanico: 9, geologo: 8, metalurgista: 7, topografo: 5, hse: 3, operaciones: 3, ambiental: 2 } },
      { id: 'q10c', text: 'Cumplir con todos los estándares de seguridad sin incidentes', scores: { hse: 10, ambiental: 6, operaciones: 5, geomecanico: 4, geologo: 3, mecanico: 3, topografo: 3, metalurgista: 2 } },
      { id: 'q10d', text: 'Entregar un informe técnico detallado y preciso', scores: { geologo: 9, topografo: 9, geomecanico: 8, metalurgista: 7, ambiental: 6, hse: 4, operaciones: 2, mecanico: 2 } },
    ],
  },
];

export const mockScenarios: Scenario[] = [
  {
    id: 'scenario-1',
    stage: 'ETAPA 1/5',
    stageNum: 1,
    category: 'RECONOCIMIENTO',
    title: 'Desprendimiento Leve en Frente de Avance',
    description: 'Estás inspeccionando el bypass 420. Se observa una pequeña caída de fragmentos rocosos sueltos desde la corona de la labor. La malla de sostenimiento instalada parece tensa.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrOEiUOE8c5n1-XzjDAEHpt9NINnxcNtQUJ5yhuvc3dBPDusN5PPFnbjAclBiJ2Xwx7grqU5iksq_cFf4Xvaqez0ysFN1_nIpPmZvn44yY14SHKQAiQLmq9KbuH9qcqEgmV9zVhVNWdrxOWrmotP_SMnZ_FLaRMYZoqzfsIw0shsUSIAzMm0B2u6GmJZZbTOfAWusCjHWlWmVPLiYeO3d2-G1Op-lwkQPt6syKmLk9RT6YdsyRl-CD8CTeCbxyjv4G6eojv5EGytI',
    alertText: 'Alerta Nivel 2: Preventivo',
    options: [
      {
        id: 'opt1_1',
        text: 'Suspender labor e informar a Geomecánica',
        description: 'Parar la maquinaria pesada en ese frente, señalizar el área y llamar al supervisor geomecánico para reevaluar el factor RMR.',
        impact: {
          calma: 8.5,
          seguridad: 10,
          tiempo: '0:25',
          toleranciaFrio: 90,
          culturalFit: { seguridad: 98, etica: 90, innovacion: 70 }
        }
      },
      {
        id: 'opt1_2',
        text: 'Continuar con precaución y purgar manualmente',
        description: 'Usar una barretilla desde una zona ya sostenida para desatar las rocas sueltas y continuar el ciclo de carga.',
        impact: {
          calma: 5.4,
          seguridad: 4.8,
          tiempo: '0:10',
          toleranciaFrio: 80,
          culturalFit: { seguridad: 50, etica: 65, innovacion: 80 }
        }
      }
    ]
  },
  {
    id: 'scenario-2',
    stage: 'ETAPA 2/5',
    stageNum: 2,
    category: 'ALERTA TÉRMICA',
    title: 'Infiltración Fuerte de Aguas Subterráneas Heladas',
    description: 'En el nivel de prospección 450, una voladura reciente cruza una falla geológica liberando un chorro de agua fría a 1°C. El sistema de drenaje primario trabaja a máxima capacidad y el agua cubre los tobillos.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrOEiUOE8c5n1-XzjDAEHpt9NINnxcNtQUJ5yhuvc3dBPDusN5PPFnbjAclBiJ2Xwx7grqU5iksq_cFf4Xvaqez0ysFN1_nIpPmZvn44yY14SHKQAiQLmq9KbuH9qcqEgmV9zVhVNWdrxOWrmotP_SMnZ_FLaRMYZoqzfsIw0shsUSIAzMm0B2u6GmJZZbTOfAWusCjHWlWmVPLiYeO3d2-G1Op-lwkQPt6syKmLk9RT6YdsyRl-CD8CTeCbxyjv4G6eojv5EGytI',
    alertText: 'Alerta Nivel 3: Severo',
    options: [
      {
        id: 'opt2_1',
        text: 'Activar bombas auxiliares neumáticas y abrigar personal',
        description: 'Instalar bombas de rebose neumáticas de respuesta rápida para encauzar el flujo, proveyendo mudas de trajes impermeables térmicos de inmediato.',
        impact: {
          calma: 9.0,
          seguridad: 9.5,
          tiempo: '0:35',
          toleranciaFrio: 94,
          culturalFit: { seguridad: 95, etica: 92, innovacion: 85 }
        }
      },
      {
        id: 'opt2_2',
        text: 'Construir dique provisional con desmonte rápido',
        description: 'Utilizar el scoop para colocar fragmentos de roca en la base y detener temporalmente el rebose hacia la rampa.',
        impact: {
          calma: 6.8,
          seguridad: 6.0,
          tiempo: '0:20',
          toleranciaFrio: 82,
          culturalFit: { seguridad: 70, etica: 60, innovacion: 75 }
        }
      }
    ]
  },
  {
    id: 'scenario-3',
    stage: 'ETAPA 3/5',
    stageNum: 3,
    category: 'ESCENARIO CRÍTICO',
    title: 'Falla Crítica en Ventilador Principal',
    description: 'Te encuentras en el nivel 400. La alarma de flujo de aire se activa. El sistema indica una falla mecánica en el aspa del ventilador primario. El polvo comienza a acumularse y la visibilidad disminuye.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrOEiUOE8c5n1-XzjDAEHpt9NINnxcNtQUJ5yhuvc3dBPDusN5PPFnbjAclBiJ2Xwx7grqU5iksq_cFf4Xvaqez0ysFN1_nIpPmZvn44yY14SHKQAiQLmq9KbuH9qcqEgmV9zVhVNWdrxOWrmotP_SMnZ_FLaRMYZoqzfsIw0shsUSIAzMm0B2u6GmJZZbTOfAWusCjHWlWmVPLiYeO3d2-G1Op-lwkQPt6syKmLk9RT6YdsyRl-CD8CTeCbxyjv4G6eojv5EGytI',
    alertText: 'Alerta Nivel 4: Crítico',
    options: [
      {
        id: 'opt3_1',
        text: 'Evacuar y alertar vía radio',
        description: 'Priorizar la vida humana, iniciando protocolo de salida inmediata y comunicación constante.',
        impact: {
          calma: 9.4,
          seguridad: 10,
          tiempo: '0:42',
          toleranciaFrio: 88,
          culturalFit: { seguridad: 100, etica: 95, innovacion: 60 }
        }
      },
      {
        id: 'opt3_2',
        text: 'Intentar bypass manual',
        description: 'Evaluar si el ventilador puede operar a baja potencia para evitar el cierre total de la sección.',
        impact: {
          calma: 6.0,
          seguridad: 4.0,
          tiempo: '1:15',
          toleranciaFrio: 80,
          culturalFit: { seguridad: 40, etica: 55, innovacion: 90 }
        }
      }
    ]
  },
  {
    id: 'scenario-4',
    stage: 'ETAPA 4/5',
    stageNum: 4,
    category: 'GASES TÓXICOS',
    title: 'Presencia Anómala de Gas Grisú (Metano)',
    description: 'Un sensor estacionario registra 1.9% de gas metano en la galería de exploración norte. El circuito eléctrico de iluminación del cargador frontal reporta chispa intermitente.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrOEiUOE8c5n1-XzjDAEHpt9NINnxcNtQUJ5yhuvc3dBPDusN5PPFnbjAclBiJ2Xwx7grqU5iksq_cFf4Xvaqez0ysFN1_nIpPmZvn44yY14SHKQAiQLmq9KbuH9qcqEgmV9zVhVNWdrxOWrmotP_SMnZ_FLaRMYZoqzfsIw0shsUSIAzMm0B2u6GmJZZbTOfAWusCjHWlWmVPLiYeO3d2-G1Op-lwkQPt6syKmLk9RT6YdsyRl-CD8CTeCbxyjv4G6eojv5EGytI',
    alertText: 'Alerta Nivel 4: Crítico',
    options: [
      {
        id: 'opt4_1',
        text: 'Corte de energía integral remota y repliegue',
        description: 'Desenergizar la subestación de galería inmediatamente para anular chispas y replegar al personal a la chimenea de aire limpio.',
        impact: {
          calma: 9.7,
          seguridad: 10,
          tiempo: '0:31',
          toleranciaFrio: 85,
          culturalFit: { seguridad: 98, etica: 96, innovacion: 75 }
        }
      },
      {
        id: 'opt4_2',
        text: 'Aislar cableado in-situ y continuar monitoreo',
        description: 'Enviar electricista con multímetro intrínseco a encintar la zona de chispa a fin de evitar detener la jornada.',
        impact: {
          calma: 4.1,
          seguridad: 1.5,
          tiempo: '2:10',
          toleranciaFrio: 71,
          culturalFit: { seguridad: 20, etica: 50, innovacion: 80 }
        }
      }
    ]
  },
  {
    id: 'scenario-5',
    stage: 'ETAPA 5/5',
    stageNum: 5,
    category: 'DESAFÍO EXTREMO',
    title: 'Peligro de Alud por Sismo Reciente (4800 msnm)',
    description: 'Un temblor de 5.2 de magnitud sacude la ladera del tajo a mediodía. Geotécnicos alertan posible falla circular en cuña de nieve y rocas congeladas sobre la rampa de acarreo.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrOEiUOE8c5n1-XzjDAEHpt9NINnxcNtQUJ5yhuvc3dBPDusN5PPFnbjAclBiJ2Xwx7grqU5iksq_cFf4Xvaqez0ysFN1_nIpPmZvn44yY14SHKQAiQLmq9KbuH9qcqEgmV9zVhVNWdrxOWrmotP_SMnZ_FLaRMYZoqzfsIw0shsUSIAzMm0B2u6GmJZZbTOfAWusCjHWlWmVPLiYeO3d2-G1Op-lwkQPt6syKmLk9RT6YdsyRl-CD8CTeCbxyjv4G6eojv5EGytI',
    alertText: 'Alerta Nivel 5: Catastrófico',
    options: [
      {
        id: 'opt5_1',
        text: 'Bloqueo físico de rampa secundaria y refugio',
        description: 'Estacionar camiones CAT de inmediato en bermas de seguridad y movilizar operarios a refugios térmicos presurizados contra aludes.',
        impact: {
          calma: 9.5,
          seguridad: 10,
          tiempo: '1:02',
          toleranciaFrio: 92,
          culturalFit: { seguridad: 100, etica: 98, innovacion: 88 }
        }
      },
      {
        id: 'opt5_2',
        text: 'Despejar mineral acelerado antes del bloqueo',
        description: 'Acelerar la marcha de cargadores para descargar las tolvas llenas antes del posible colapso geomecánico.',
        impact: {
          calma: 5.0,
          seguridad: 3.0,
          tiempo: '0:45',
          toleranciaFrio: 75,
          culturalFit: { seguridad: 30, etica: 50, innovacion: 82 }
        }
      }
    ]
  }
];
