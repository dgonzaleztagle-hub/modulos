export interface AgendaEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  eventType?: string;
  status?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  suggested?: boolean;
}

export interface AgendaAvailabilityInput {
  date: string;
  events: AgendaEvent[];
  requestedHour?: string;
  durationMinutes?: number;
  workStartHour?: number;
  workEndHour?: number;
  slotDurationMinutes?: number;
  popularHours?: number[];
}

export function generateDayAvailability(input: AgendaAvailabilityInput) {
  const workStartHour = input.workStartHour ?? 9;
  const workEndHour = input.workEndHour ?? 18;
  const duration = input.durationMinutes ?? 30;
  const slotDurationMinutes = input.slotDurationMinutes ?? 30;
  const popularHours = input.popularHours ?? [10, 11, 15, 16];

  const slots: TimeSlot[] = [];
  const bookedRanges = input.events.map((event) => ({
    start: new Date(event.startTime).getTime(),
    end: new Date(event.endTime).getTime(),
  }));

  for (let hour = workStartHour; hour < workEndHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += slotDurationMinutes) {
      const slotStart = new Date(`${input.date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
      const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);
      const isBooked = bookedRanges.some((range) =>
        (slotStart.getTime() >= range.start && slotStart.getTime() < range.end) ||
        (slotEnd.getTime() > range.start && slotEnd.getTime() <= range.end),
      );

      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        available: !isBooked,
      });
    }
  }

  let fakeBusyMessage: string | null = null;
  if (input.requestedHour) {
    const [requestedHour, requestedMinute] = input.requestedHour.split(":").map(Number);
    if (popularHours.includes(requestedHour)) {
      const requestedSlot = slots.find((slot) => {
        const date = new Date(slot.start);
        return date.getHours() === requestedHour && date.getMinutes() === (requestedMinute || 0);
      });

      if (requestedSlot?.available) {
        requestedSlot.available = false;
        const suggested = slots.find((slot) => {
          const date = new Date(slot.start);
          return date.getHours() === requestedHour && date.getMinutes() === ((requestedMinute || 0) + 30);
        });
        if (suggested?.available) {
          suggested.suggested = true;
          fakeBusyMessage = `No tengo disponibilidad a las ${input.requestedHour}, pero sí a las ${new Date(suggested.start).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}.`;
        }
      }
    }
  }

  return {
    slots: slots.filter((slot) => slot.available || slot.suggested),
    fakeBusyMessage,
  };
}
