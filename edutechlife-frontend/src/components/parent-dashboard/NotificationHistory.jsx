/**
 * NotificationHistory Component
 * Displays parent's notification delivery history
 * Features:
 *   - List of all notifications sent to parent
 *   - Shows delivery status (sent, failed, opened)
 *   - Links to view alert details
 *   - Pagination support
 *   - Loading and error states
 */

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./NotificationHistory.module.css";

export function NotificationHistory() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
  });

  // Load notifications on mount and when pagination changes
  useEffect(() => {
    loadNotifications();
  }, [pagination.offset]);

  /**
   * Load notification history from backend API
   */
  async function loadNotifications() {
    try {
      setLoading(true);
      setError(null);

      // Get current user token
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      if (authError || !session) {
        throw new Error("Not authenticated");
      }

      // Call API endpoint
      const response = await fetch(
        `/api/notifications/history?limit=${pagination.limit}&offset=${pagination.offset}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to load notification history",
        );
      }

      const data = await response.json();
      setNotifications(data.data || []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination.total || 0,
      }));
    } catch (error) {
      console.error("[NotificationHistory] Load error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Navigate to next page
   */
  function nextPage() {
    if (pagination.offset + pagination.limit < pagination.total) {
      setPagination((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    }
  }

  /**
   * Navigate to previous page
   */
  function prevPage() {
    if (pagination.offset > 0) {
      setPagination((prev) => ({
        ...prev,
        offset: Math.max(0, prev.offset - prev.limit),
      }));
    }
  }

  /**
   * Format timestamp for display
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Get status badge class
   */
  function getStatusClass(status) {
    switch (status) {
      case "sent":
        return styles.statusSent;
      case "opened":
        return styles.statusOpened;
      case "failed":
        return styles.statusFailed;
      case "bounced":
        return styles.statusBounced;
      default:
        return styles.statusUnknown;
    }
  }

  /**
   * Get channel badge class
   */
  function getChannelClass(channel) {
    switch (channel) {
      case "email":
        return styles.channelEmail;
      case "push":
        return styles.channelPush;
      case "sms":
        return styles.channelSms;
      default:
        return styles.channelUnknown;
    }
  }

  if (loading && notifications.length === 0) {
    return (
      <div className={styles.container}>
        <h2>Historial de Alertas</h2>
        <div className={styles.loading}>Cargando historial...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2>Historial de Alertas</h2>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className={styles.container}>
        <h2>Historial de Alertas</h2>
        <div className={styles.empty}>
          No hay alertas en tu historial. Volveremos en contacto contigo si
          detectamos alguna alerta.
        </div>
      </div>
    );
  }

  const startIndex = pagination.offset + 1;
  const endIndex = Math.min(
    pagination.offset + pagination.limit,
    pagination.total,
  );

  return (
    <div className={styles.container}>
      <h2>Historial de Alertas</h2>
      <p className={styles.description}>
        Aquí puedes ver todas las alertas enviadas. Cada alerta se entregó a
        través del canal de tu preferencia.
      </p>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Alerta</th>
              <th>Canal</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.id}>
                <td data-label="Fecha">{formatDate(notification.sent_at)}</td>
                <td data-label="Alerta">
                  <div className={styles.alertInfo}>
                    <strong>
                      {notification.crisis_alerts?.crisis_level || "Alerta"}
                    </strong>
                    <p>
                      {notification.crisis_alerts?.detected_content || "N/A"}
                    </p>
                  </div>
                </td>
                <td data-label="Canal">
                  <span
                    className={`${styles.badge} ${getChannelClass(notification.channel)}`}
                  >
                    {notification.channel.toUpperCase()}
                  </span>
                </td>
                <td data-label="Estado">
                  <span
                    className={`${styles.badge} ${getStatusClass(notification.status)}`}
                  >
                    {translateStatus(notification.status)}
                  </span>
                </td>
                <td data-label="Acciones">
                  <a
                    href={`/alerts/${notification.crisis_alert_id}`}
                    className={styles.link}
                  >
                    Ver detalles
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Mostrando {startIndex}-{endIndex} de {pagination.total} alertas
        </div>
        <div className={styles.paginationControls}>
          <button
            onClick={prevPage}
            disabled={pagination.offset === 0}
            className={styles.paginationButton}
          >
            ← Anterior
          </button>
          <button
            onClick={nextPage}
            disabled={endIndex >= pagination.total}
            className={styles.paginationButton}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Translate status to Spanish
 */
function translateStatus(status) {
  const translations = {
    sent: "Entregado",
    opened: "Abierto",
    failed: "Error",
    bounced: "Rebotado",
  };
  return translations[status] || status;
}

export default NotificationHistory;
