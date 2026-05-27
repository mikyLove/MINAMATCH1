import jsPDF from 'jspdf';
import type { BigFiveScores, HoganScores } from './scoring';

export function generatePdfReport(data: {
  name: string;
  date: string;
  discScores: { D: number; I: number; S: number; C: number };
  wonderlicResult: { correct: number; total: number; level: string; percentile: number };
  bigFiveScores: BigFiveScores;
  integrityScore: { overall: number; level: string; alerts: string[] };
  hoganScores: HoganScores;
  globalScore: { psicologico: number; cognitivo: number; conductual: number; seguridad: number; adaptacionMinera: number; social: number; overall: number };
  profileMatches: { name: string; compatibility: number }[];
  topProfile: { name: string; compatibility: number };
  recommendation: string;
}) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  const colors = { primary: [15, 23, 42] as [number, number, number], accent: [245, 158, 11] as [number, number, number], slate: [100, 116, 139] as [number, number, number] };

  // Header
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageW, 32, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...colors.accent);
  doc.text('INFORME DE EVALUACIÓN MINATALENT', pageW / 2, 14, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Plataforma de Evaluación Psicométrica Minera — MinaMatch Puno', pageW / 2, 22, { align: 'center' });
  doc.setFontSize(7);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageW / 2, 28, { align: 'center' });

  y = 44;

  // Candidate info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...colors.primary);
  doc.text('DATOS DEL EVALUADO', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  [
    `Candidato: ${data.name}`,
    `Fecha de Evaluación: ${data.date}`,
    `Evaluación: DISC + Wonderlic + Big Five + Integridad + Hogan`,
  ].forEach(line => { doc.text(line, margin, y); y += 5.5; });
  y += 4;

  // Separator
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Global Score
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...colors.primary);
  doc.text('SCORE GLOBAL', margin, y);
  y += 8;
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y - 4, contentW(pageW, margin), 24, 'F');
  doc.setFontSize(22);
  doc.setTextColor(...colors.accent);
  doc.text(`${data.globalScore.overall}/100`, margin + contentW(pageW, margin) / 2, y + 8, { align: 'center' });
  y += 28;

  // Score dimensions
  const dimensions = [
    { label: 'Psicológico', value: data.globalScore.psicologico },
    { label: 'Cognitivo', value: data.globalScore.cognitivo },
    { label: 'Conductual', value: data.globalScore.conductual },
    { label: 'Seguridad', value: data.globalScore.seguridad },
    { label: 'Adaptación Minera', value: data.globalScore.adaptacionMinera },
    { label: 'Aptitud Social', value: data.globalScore.social },
  ];
  dimensions.forEach(d => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(d.label, margin, y);
    const barW = contentW(pageW, margin) - 25;
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(margin + 35, y - 2, barW, 4, 1, 1, 'F');
    doc.setFillColor(...(d.value >= 70 ? [16, 185, 129] as [number, number, number] : d.value >= 50 ? [245, 158, 11] as [number, number, number] : [239, 68, 68] as [number, number, number]));
    doc.roundedRect(margin + 35, y - 2, barW * (d.value / 100), 4, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${d.value}%`, margin + 35 + barW + 3, y + 1);
    y += 8;
  });
  y += 4;

  // Top profile
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...colors.primary);
  doc.text('PERFIL RECOMENDADO', margin, y);
  y += 8;
  doc.setFillColor(...colors.accent);
  doc.rect(margin, y - 4, contentW(pageW, margin), 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.topProfile.name} — ${data.topProfile.compatibility}% de compatibilidad`, margin + 3, y + 4);
  y += 16;

  // Tabla de perfiles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('COMPATIBILIDAD POR PERFIL MINERO', margin, y);
  y += 6;
  data.profileMatches.forEach((p, i) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`${i + 1}. ${p.name}`, margin, y);
    doc.text(`${p.compatibility}%`, pageW - margin - 15, y, { align: 'right' });
    const barW = contentW(pageW, margin) * 0.6;
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(margin + 50, y - 1, barW, 3, 1, 1, 'F');
    doc.setFillColor(...colors.accent);
    doc.roundedRect(margin + 50, y - 1, barW * (p.compatibility / 100), 3, 1, 1, 'F');
    y += 6;
  });
  y += 4;

  // Recomendación
  if (y > pageH - 50) { doc.addPage(); y = margin + 4; }
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...colors.primary);
  doc.text('RECOMENDACIÓN FINAL', margin, y);
  y += 8;
  doc.setFillColor(data.recommendation === 'Recomendado' ? '#dcfce7' : data.recommendation === 'Recomendado con observaciones' ? '#fef9c3' : '#fee2e2');
  doc.rect(margin, y - 4, contentW(pageW, margin), 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(data.recommendation === 'Recomendado' ? '#166534' : data.recommendation === 'Recomendado con observaciones' ? '#854d0e' : '#991b1b');
  doc.text(`Estado: ${data.recommendation}`, margin + 3, y + 3);
  y += 14;

  // Footer
  doc.setFillColor(...colors.primary);
  doc.rect(0, pageH - 12, pageW, 12, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text('MinaMatch Puno — Plataforma de Selección Minera Inteligente — Informe confidencial de evaluación psicométrica', pageW / 2, pageH - 5, { align: 'center' });
  doc.text(`ID: MINATALENT-${Date.now().toString(36).toUpperCase()}`, pageW / 2, pageH - 2, { align: 'center' });

  doc.save(`informe-minatalent-${data.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);

  function contentW(pw: number, m: number) { return pw - m * 2; }
}

export function generateMiningContext(): string {
  const contexts = [
    'Operaciones en mina subterránea polimetálica a más de 4500 msnm.',
    'Supervisión de equipos en condiciones de alta presión y geología compleja.',
    'Gestión de seguridad en tajos con historial de eventos geomecánicos.',
    'Coordinación de equipos multidisciplinarios en campamento minero remoto.',
    'Evaluación de riesgos operacionales en frentes de avance con gases y agua.',
  ];
  return contexts[Math.floor(Math.random() * contexts.length)];
}
