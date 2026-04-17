import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAgendaCreatedEmail,
  buildAgendaReminderEmail,
  minutesUntilAgendaEvent,
  resolveAgendaRecipients,
  shouldSendAgendaReminder,
} from "../.dist/modulos/notifications/agenda-email-core/src.js";

test("agenda-email-core resuelve destinatarios por responsable", () => {
  assert.deepEqual(resolveAgendaRecipients("daniel"), ["dgonzaleztagle@gmail.com"]);
  assert.deepEqual(resolveAgendaRecipients("both"), ["dgonzaleztagle@gmail.com", "Gaston.jofre1995@gmail.com"]);
  assert.deepEqual(resolveAgendaRecipients("desconocido"), ["dgonzaleztagle@gmail.com", "Gaston.jofre1995@gmail.com"]);
});

test("agenda-email-core detecta ventana de reminder", () => {
  const now = new Date("2026-04-16T12:00:00.000Z");
  assert.equal(minutesUntilAgendaEvent("2026-04-16T12:32:00.000Z", now), 32);
  assert.equal(shouldSendAgendaReminder("2026-04-16T12:32:00.000Z", now), true);
  assert.equal(shouldSendAgendaReminder("2026-04-16T12:50:00.000Z", now), false);
});

test("agenda-email-core arma recordatorio con links útiles", () => {
  const message = buildAgendaReminderEmail(
    {
      title: "Reunión técnica",
      startTime: "2026-04-16T12:32:00.000Z",
      companyName: "Acme",
      attendeeName: "Daniela",
      whatsapp: "+56 9 1111 2222",
      website: "acme.cl",
      notes: "llevar propuesta",
    },
    {
      now: new Date("2026-04-16T12:00:00.000Z"),
      dashboardUrl: "https://app.test/agenda",
    },
  );

  assert.match(message.subject, /Reunión técnica en 32 minutos/);
  assert.match(message.html, /https:\/\/wa\.me\/56911112222/);
  assert.match(message.html, /https:\/\/acme\.cl/);
  assert.match(message.text, /Dashboard: https:\/\/app\.test\/agenda/);
});

test("agenda-email-core arma aviso de reunión creada", () => {
  const message = buildAgendaCreatedEmail(
    {
      title: "Kickoff",
      startTime: "2026-04-16T15:00:00.000Z",
      source: "chat_bot",
      attendeeName: "Cliente",
      website: "https://cliente.cl",
    },
    {
      brandName: "MODULOS",
      dashboardUrl: "https://app.test/agenda",
    },
  );

  assert.match(message.subject, /NUEVA REUNIÓN: Kickoff/);
  assert.match(message.html, /desde el bot/);
  assert.match(message.text, /Dashboard: https:\/\/app\.test\/agenda/);
});
