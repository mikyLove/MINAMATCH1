import { Candidate, Student, Scenario } from './types';

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Marco Quispe',
    title: 'Geólogo Senior',
    institution: 'UNA Puno',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDthZZXHgFD3hyR_0TUOCwsIcx9wnKAU0Zt51v-_KSl1LLR-BOeeamZzdTOO2tMwAkD4r7-p_yOfgP7KsAbqPbb_5Pv58rbvfVGul0UiASAR5HS_VPEFNAgeImO0pufHzh3PCqXfwGcjhMpVwj9Iw5-aKr21RfzhVFqfLwV2cq9uPsJT_UZu4WjsWPFARRQsxuTb-Ey6dbnXphreIW97J7RwGwrMVtB5A54YifgXh3Pa_5hIZV02NxJxZknNo7wPEu787uLLLWpVpg',
    expYears: 8,
    english: 'INGLÉS C1',
    languages: ['Español', 'Inglés C1'],
    matchRating: 92,
    skills: ['Geomecánica', 'Planeamiento', 'LHD Op.'],
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
  }
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
