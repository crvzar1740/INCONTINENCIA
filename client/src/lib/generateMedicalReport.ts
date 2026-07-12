import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/* ── Brand colours ── */
const SAGE = [61, 107, 102] as [number, number, number];       // #3D6B66
const TERRA = [156, 93, 82] as [number, number, number];       // #9C5D52
const BRONZE = [192, 138, 78] as [number, number, number];     // #C08A4E
const CREAM = [250, 247, 242] as [number, number, number];     // #FAF7F2
const DARK = [43, 36, 32] as [number, number, number];         // #2B2420
const LIGHT_BORDER = [229, 224, 216] as [number, number, number]; // #E5E0D8

interface Entry {
  id: string;
  timestamp: string;
  urgencia: "tranquilo" | "apurado" | "no-llegue";
  escape: boolean;
  causaEscape: string;
  liquido: string;
}

function formatDateTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDateShort(ts: string) {
  const d = new Date(ts);
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
}

function urgenciaLabel(u: Entry["urgencia"]) {
  return u === "tranquilo" ? "Tranquila" : u === "apurado" ? "Apurada" : "No llegó a tiempo";
}

export function generateMedicalReport(entries: Entry[]) {
  if (entries.length === 0) return;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();   // 210
  const ph = doc.internal.pageSize.getHeight();  // 297
  const margin = 18;
  const contentW = pw - margin * 2;

  /* ── Compute stats ── */
  const sorted = [...entries].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    intervals.push(
      (new Date(sorted[i].timestamp).getTime() - new Date(sorted[i - 1].timestamp).getTime()) /
        60000
    );
  }
  const avgMin = intervals.length
    ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
    : 0;
  const maxMin = intervals.length ? Math.round(Math.max(...intervals)) : 0;
  const minMin = intervals.length ? Math.round(Math.min(...intervals)) : 0;
  const totalEscapes = sorted.filter((e) => e.escape).length;
  const escapeRate = sorted.length
    ? Math.round((totalEscapes / sorted.length) * 100)
    : 0;

  /* Group by date */
  const byDate: Record<string, Entry[]> = {};
  sorted.forEach((e) => {
    const key = formatDateShort(e.timestamp);
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(e);
  });
  const days = Object.keys(byDate);

  /* ── Header bar ── */
  doc.setFillColor(...SAGE);
  doc.rect(0, 0, pw, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Suelo Firme — Diario Miccional", margin, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const today = new Date().toLocaleDateString("es-ES", {
    day: "2-digit", month: "long", year: "numeric",
  });
  doc.text(`Generado: ${today}`, pw - margin, 14, { align: "right" });

  let y = 30;

  /* ── Patient note ── */
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.text(
    "Documento generado por la paciente con la app Suelo Firme para facilitar la consulta clínica.\nNo sustituye la evaluación médica profesional.",
    margin, y
  );
  y += 11;

  /* ── Section: Resumen estadístico ── */
  doc.setFillColor(...CREAM);
  doc.roundedRect(margin, y, contentW, 28, 2, 2, "F");
  doc.setDrawColor(...LIGHT_BORDER);
  doc.roundedRect(margin, y, contentW, 28, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...SAGE);
  doc.text("RESUMEN DEL PERÍODO", margin + 5, y + 7);

  const statCols = contentW / 5;
  const stats = [
    { label: "Registros", value: String(sorted.length) },
    { label: "Días registrados", value: String(days.length) },
    { label: "Intervalo prom.", value: `${avgMin} min` },
    { label: "Intervalo mín.", value: `${minMin} min` },
    { label: "Escapes totales", value: `${totalEscapes} (${escapeRate}%)` },
  ];

  stats.forEach((s, i) => {
    const x = margin + 5 + i * statCols;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...SAGE);
    doc.text(s.value, x, y + 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...DARK);
    doc.text(s.label, x, y + 23);
  });

  y += 34;

  /* ── Section: Gráfico de intervalos por día ── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...SAGE);
  doc.text("INTERVALOS POR DÍA (minutos entre micciones)", margin, y);
  y += 4;

  const chartH = 32;
  const chartW = contentW;

  doc.setFillColor(...CREAM);
  doc.rect(margin, y, chartW, chartH, "F");
  doc.setDrawColor(...LIGHT_BORDER);
  doc.rect(margin, y, chartW, chartH, "S");

  if (days.length > 0) {
    /* Compute avg interval per day */
    const dayAvgs = days.map((d) => {
      const dayEntries = byDate[d];
      if (dayEntries.length < 2) return { day: d, avg: 0 };
      const ts = dayEntries.map((e) => new Date(e.timestamp).getTime());
      const ivs: number[] = [];
      for (let i = 1; i < ts.length; i++) ivs.push((ts[i] - ts[i - 1]) / 60000);
      return { day: d, avg: ivs.reduce((a, b) => a + b, 0) / ivs.length };
    });

    const maxVal = Math.max(...dayAvgs.map((d) => d.avg), 1);
    const barW = Math.min((chartW - 10) / dayAvgs.length - 2, 18);
    const barAreaH = chartH - 10;

    dayAvgs.forEach((d, i) => {
      if (d.avg === 0) return;
      const bh = (d.avg / maxVal) * barAreaH;
      const bx = margin + 5 + i * ((chartW - 10) / dayAvgs.length);
      const by = y + chartH - 5 - bh;

      doc.setFillColor(...SAGE);
      doc.rect(bx, by, barW, bh, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...DARK);
      doc.text(d.day, bx + barW / 2, y + chartH - 2, { align: "center" });

      doc.setFontSize(6);
      doc.setTextColor(...SAGE);
      doc.text(String(Math.round(d.avg)), bx + barW / 2, by - 1, { align: "center" });
    });

    /* Reference line: target (180 min = 3h) */
    const targetY = y + chartH - 5 - (Math.min(180, maxVal) / maxVal) * barAreaH;
    if (targetY > y + 2 && targetY < y + chartH - 5) {
      doc.setDrawColor(...BRONZE);
      doc.setLineDashPattern([1.5, 1.5], 0);
      doc.line(margin + 2, targetY, margin + chartW - 2, targetY);
      doc.setLineDashPattern([], 0);
      doc.setFontSize(6);
      doc.setTextColor(...BRONZE);
      doc.text("Meta: 180 min", margin + chartW - 3, targetY - 1, { align: "right" });
    }
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...DARK);
    doc.text("Datos insuficientes para graficar.", margin + chartW / 2, y + chartH / 2, { align: "center" });
  }

  y += chartH + 8;

  /* ── Section: Frecuencia de escapes por día ── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...SAGE);
  doc.text("EPISODIOS DE ESCAPE POR DÍA", margin, y);
  y += 4;

  const escapeRows = days.map((d) => {
    const de = byDate[d];
    const total = de.length;
    const esc = de.filter((e) => e.escape).length;
    const causes = de
      .filter((e) => e.escape && e.causaEscape)
      .map((e) => e.causaEscape)
      .join(", ");
    const urgH = de.filter((e) => e.urgencia === "no-llegue").length;
    return [d, String(total), `${esc} (${total ? Math.round((esc / total) * 100) : 0}%)`, String(urgH), causes || "—"];
  });

  autoTable(doc, {
    startY: y,
    head: [["Fecha", "Visitas", "Escapes (%)", "Urgencia alta", "Causa frecuente"]],
    body: escapeRows,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: SAGE,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: DARK,
    },
    alternateRowStyles: { fillColor: CREAM },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 18, halign: "center" },
      2: { cellWidth: 28, halign: "center" },
      3: { cellWidth: 26, halign: "center" },
      4: { cellWidth: "auto" },
    },
    styles: { lineColor: LIGHT_BORDER, lineWidth: 0.2 },
    didDrawPage: () => {},
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  /* New page if not enough space */
  if (y > ph - 60) {
    doc.addPage();
    y = 18;
  }

  /* ── Section: Registro completo ── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...SAGE);
  doc.text("REGISTRO COMPLETO DE MICCIONES", margin, y);
  y += 4;

  const entryRows = sorted.map((e) => [
    formatDateTime(e.timestamp),
    urgenciaLabel(e.urgencia),
    e.escape ? "Sí" : "No",
    e.causaEscape || "—",
    e.liquido || "—",
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Fecha y hora", "Urgencia", "Escape", "Causa", "Líquido previo"]],
    body: entryRows,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: SAGE,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: DARK,
    },
    alternateRowStyles: { fillColor: CREAM },
    columnStyles: {
      0: { cellWidth: 36 },
      1: { cellWidth: 30 },
      2: { cellWidth: 16, halign: "center" },
      3: { cellWidth: 30 },
      4: { cellWidth: "auto" },
    },
    styles: { lineColor: LIGHT_BORDER, lineWidth: 0.2 },
  });

  /* ── Footer on every page ── */
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(...SAGE);
    doc.rect(0, ph - 12, pw, 12, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(
      "Suelo Firme — app de acompañamiento para incontinencia urinaria · Basado en guías EAU 2026 · No sustituye la evaluación clínica",
      pw / 2,
      ph - 4.5,
      { align: "center" }
    );
    doc.text(`Pág. ${p}/${totalPages}`, pw - margin, ph - 4.5, { align: "right" });
  }

  doc.save(`diario-miccional-suelo-firme-${new Date().toISOString().slice(0, 10)}.pdf`);
}
