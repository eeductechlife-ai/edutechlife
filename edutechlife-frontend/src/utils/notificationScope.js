// Las notificaciones de IngenIA (SmartBoard) comparten tabla con las de IALab;
// una cuenta que usa ambos productos no debe ver avisos de uno dentro del otro.
export const isIngeniaNotification = (n) =>
  String(n?.type || "").startsWith("smartboard_");

export const forIALab = (notifications = []) =>
  notifications.filter((n) => !isIngeniaNotification(n));
