export type CashCloseAlertStage = "none" | "warn_15" | "warn_10" | "warn_5" | "overdue";

export function parseScheduleMinutes(hhmm: string | null | undefined): number | null {
  if (!hhmm || !/^\d{2}:\d{2}$/.test(hhmm)) return null;
  const [hours, minutes] = hhmm.split(":").map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function resolveMinutesUntilClose(currentMinutes: number, closeMinutes: number) {
  return closeMinutes - currentMinutes;
}

export function resolveCashCloseAlertStage(minutesUntilClose: number): CashCloseAlertStage {
  if (minutesUntilClose <= 0) return "overdue";
  if (minutesUntilClose <= 5) return "warn_5";
  if (minutesUntilClose <= 10) return "warn_10";
  if (minutesUntilClose <= 15) return "warn_15";
  return "none";
}

export function resolveCashCloseAlertState(input: {
  scheduledCloseTime?: string | null;
  now?: Date;
}) {
  const closeMinutes = parseScheduleMinutes(input.scheduledCloseTime);
  if (closeMinutes == null) {
    return {
      closeMinutes: null,
      currentMinutes: null,
      minutesUntilClose: null,
      stage: "none" as CashCloseAlertStage,
    };
  }

  const now = input.now ?? new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const minutesUntilClose = resolveMinutesUntilClose(currentMinutes, closeMinutes);

  return {
    closeMinutes,
    currentMinutes,
    minutesUntilClose,
    stage: resolveCashCloseAlertStage(minutesUntilClose),
  };
}
