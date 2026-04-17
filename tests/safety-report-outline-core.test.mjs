import test from "node:test";
import assert from "node:assert/strict";

import {
  buildAccidentReportOutline,
  buildInspectionReportOutline,
  buildTrainingReportOutline,
} from "../.dist/modulos/pdf/safety-report-outline-core/src.js";

test("safety-report-outline-core builds accident outline with root cause", () => {
  const outline = buildAccidentReportOutline(
    {
      worker_name: "Ana Perez",
      worker_rut: "12.345.678-9",
      worker_position: "Operaria",
      accident_date: "2026-04-10",
      accident_time: "10:30",
      accident_location: "Bodega",
      accident_type: "trabajo",
      description: "Golpe con caja",
      injury_type: "Contusion",
      sick_leave_days: 2,
      why1: "Caja mal apilada",
      root_cause: "Falta de orden",
    },
    [{ description: "Ordenar sector", responsible: "Supervisor", deadline: "7 dias", status: "pendiente" }],
  );

  assert.ok(outline.some((section) => section.title === "Analisis 5 por ques"));
  assert.ok(outline.flatMap((section) => section.lines).some((line) => line.includes("Causa raiz")));
});

test("safety-report-outline-core builds inspection summary", () => {
  const outline = buildInspectionReportOutline(
    {
      inspection_date: "2026-04-12",
      area: "Produccion",
      inspector: "Carlos",
      inspection_type: "programada",
    },
    [
      { description: "Cable expuesto", severity: "critico", location: "Linea 1" },
      { description: "Señaletica dañada", severity: "menor", location: "Pasillo" },
    ],
    [],
  );

  assert.ok(outline.some((section) => section.title === "Resumen"));
  assert.ok(outline.flatMap((section) => section.lines).some((line) => line.includes("Criticos: 1")));
});

test("safety-report-outline-core builds training attendance summary", () => {
  const outline = buildTrainingReportOutline(
    {
      title: "Uso de extintores",
      training_date: "2026-04-14",
      duration_minutes: 60,
      instructor: "Prevencionista",
      topic: "Emergencias",
      objectives: "Reaccionar ante incendios",
      observations: null,
    },
    [
      { name: "Ana", rut: "1-9", attended: true },
      { name: "Luis", rut: "2-7", attended: false },
    ],
  );

  assert.ok(outline.some((section) => section.title === "Lista de asistencia"));
  assert.ok(outline.flatMap((section) => section.lines).some((line) => line.includes("Asistentes: 1")));
});
