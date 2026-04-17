import test from "node:test";
import assert from "node:assert/strict";
import {
  buildReservationConfirmationEmail,
  buildNewsletterWelcomeEmail,
} from "../.dist/modulos/notifications/hospitality-email-core/src.js";

test("hospitality-email-core arma email de confirmación de reserva", () => {
  const email = buildReservationConfirmationEmail({
    to: "ana@example.com",
    customerName: "Ana",
    reservationNumber: "R-99",
    reservationDate: "2026-04-18",
    reservationTime: "21:00",
    partySize: 4,
    brandName: "Rishtedar",
  });

  assert.match(email.subject, /Reserva confirmada/);
  assert.match(email.html, /R-99/);
  assert.match(email.text, /Ana/);
});

test("hospitality-email-core arma bienvenida newsletter configurable", () => {
  const email = buildNewsletterWelcomeEmail({
    to: "ana@example.com",
    firstName: "Ana",
    brandName: "Rishtedar",
    circleName: "Rishtedar Circle",
    menuUrl: "https://rishtedar.cl/menu",
  });

  assert.match(email.subject, /Bienvenido\/a al círculo Rishtedar, Ana!/);
  assert.match(email.html, /https:\/\/rishtedar\.cl\/menu/);
  assert.match(email.text, /Rishtedar Circle/);
});
