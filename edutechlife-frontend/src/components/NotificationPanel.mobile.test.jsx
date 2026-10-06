/**
 * TEST: la campana móvil no debe romperse en celulares sin la API Notification
 * (iPhone con Safari normal, navegadores integrados) ni con ids no string.
 */
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";

const mockNotif = {
  notifications: [
    {
      id: 12345, // id numérico: antes .startsWith lanzaba TypeError al tocarla
      type: "general",
      title: "Desafío pendiente",
      message: "Tienes un desafío sin completar",
      is_read: false,
      created_at: new Date().toISOString(),
      metadata: {},
    },
  ],
  loading: false,
  markAsRead: vi.fn(),
  markAllAsRead: vi.fn(),
  dismissNotification: vi.fn(),
  clearAllNotifications: vi.fn(),
  // Preferencia guardada desde otro dispositivo: push activo.
  preferences: { push: true },
  updatePreferences: vi.fn(),
};

vi.mock("../context/NotificationContext", () => ({
  useNotification: () => mockNotif,
}));
vi.mock("../utils/notificationScope", () => ({
  forIALab: (n) => n,
}));
vi.mock("../i18n/I18nProvider", () => ({
  useTranslation: () => ({
    t: (k) => k,
    locale: "es",
  }),
}));
vi.mock("../hooks/useBrowserNotifications", () => ({
  default: () => ({
    subscribeToPush: vi.fn(),
    syncPushSubscription: vi.fn(),
    supported: false,
  }),
}));

import NotificationPanel from "./NotificationPanel";

describe("NotificationPanel en celulares sin Notification", () => {
  let saved;
  beforeEach(() => {
    saved = window.Notification;
    delete window.Notification;
  });
  afterEach(() => {
    window.Notification = saved;
  });

  it("abre sin lanzar aunque push esté activo y no exista la API", () => {
    expect(() =>
      render(
        <MemoryRouter>
          <NotificationPanel isOpen onClose={() => {}} />
        </MemoryRouter>,
      ),
    ).not.toThrow();
    // Sin API: no hay interruptor, solo el aviso.
    expect(
      screen.queryByLabelText("Toggle push notifications"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("notification.push_unsupported"),
    ).toBeInTheDocument();
  });

  it("tocar una notificación con id numérico no lanza", () => {
    render(
      <MemoryRouter>
        <NotificationPanel isOpen onClose={() => {}} />
      </MemoryRouter>,
    );
    const item = screen.getByText("Desafío pendiente");
    expect(() => item.click()).not.toThrow();
  });

  it("en móvil el panel ocupa el ancho de pantalla (no se sale por la izquierda)", () => {
    const { container } = render(
      <MemoryRouter>
        <NotificationPanel isOpen onClose={() => {}} />
      </MemoryRouter>,
    );
    const panel = container.firstChild;
    expect(panel.className).toContain("fixed");
    expect(panel.className).toContain("left-3");
    expect(panel.className).toContain("right-3");
    expect(panel.className).toContain("md:absolute");
  });

  it("el botón de borrar es visible en móvil (sin hover táctil)", () => {
    render(
      <MemoryRouter>
        <NotificationPanel isOpen onClose={() => {}} />
      </MemoryRouter>,
    );
    const del = screen.getByLabelText("notification.delete_aria");
    expect(del.className).toContain("opacity-100");
    expect(del.className).toContain("md:opacity-0");
  });
});
