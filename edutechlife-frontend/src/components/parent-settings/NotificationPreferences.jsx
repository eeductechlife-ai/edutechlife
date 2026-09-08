/**
 * NotificationPreferences Component
 * Allows parents to manage notification channel preferences and frequency
 * Features:
 *   - Toggle email, push, SMS notifications
 *   - Select alert frequency (immediate, daily, weekly)
 *   - Auto-save to Supabase
 *   - Loading and error states
 */

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./NotificationPreferences.module.css";

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    email_enabled: true,
    push_enabled: true,
    sms_enabled: false,
    alert_frequency: "immediate",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  /**
   * Load parent preferences from Supabase
   */
  async function loadPreferences() {
    try {
      setLoading(true);

      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("No authenticated user");
      }

      // Fetch parent record
      const { data: parent, error: parentError } = await supabase
        .from("parents")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (parentError && parentError.code !== "PGRST116") {
        throw new Error(parentError.message);
      }

      if (!parent) {
        // No parent record yet - use defaults
        setPreferences({
          email_enabled: true,
          push_enabled: true,
          sms_enabled: false,
          alert_frequency: "immediate",
        });
        setLoading(false);
        return;
      }

      // Fetch preferences
      const { data: prefs, error: prefsError } = await supabase
        .from("parent_preferences")
        .select("*")
        .eq("parent_id", parent.id)
        .single();

      if (prefsError && prefsError.code === "PGRST116") {
        // No preferences record - use defaults
        setPreferences({
          email_enabled: true,
          push_enabled: true,
          sms_enabled: false,
          alert_frequency: "immediate",
        });
      } else if (prefsError) {
        throw new Error(prefsError.message);
      } else {
        setPreferences(prefs);
      }
    } catch (error) {
      console.error("[NotificationPreferences] Load error:", error);
      setMessage({
        type: "error",
        text: "Error loading preferences: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Save preferences to Supabase
   */
  async function savePreferences() {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("No authenticated user");
      }

      // Call API endpoint to update preferences
      const response = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.user_metadata?.token || ""}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save preferences");
      }

      setMessage({
        type: "success",
        text: "Preferencias guardadas correctamente",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("[NotificationPreferences] Save error:", error);
      setMessage({
        type: "error",
        text: "Error saving preferences: " + error.message,
      });
    } finally {
      setSaving(false);
    }
  }

  /**
   * Toggle a boolean preference
   */
  function togglePreference(key) {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  /**
   * Update frequency preference
   */
  function updateFrequency(frequency) {
    setPreferences((prev) => ({
      ...prev,
      alert_frequency: frequency,
    }));
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <h2>Preferencias de Notificaciones</h2>
        <div className={styles.loading}>Cargando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Preferencias de Notificaciones</h2>
      <p className={styles.description}>
        Elige cómo y cuándo deseas recibir alertas sobre el progreso académico
        de tu hijo(a).
      </p>

      {/* Channel Preferences */}
      <div className={styles.section}>
        <h3>Canales de Notificación</h3>

        <div className={styles.preference}>
          <div className={styles.preferenceLabel}>
            <label htmlFor="email-toggle">
              <strong>Email</strong>
              <span className={styles.description}>
                Recibe alertas por correo electrónico
              </span>
            </label>
          </div>
          <div className={styles.preferenceControl}>
            <input
              id="email-toggle"
              type="checkbox"
              checked={preferences.email_enabled}
              onChange={() => togglePreference("email_enabled")}
              className={styles.toggle}
            />
            <span className={styles.toggleLabel}>
              {preferences.email_enabled ? "Activado" : "Desactivado"}
            </span>
          </div>
        </div>

        <div className={styles.preference}>
          <div className={styles.preferenceLabel}>
            <label htmlFor="push-toggle">
              <strong>Notificaciones Push</strong>
              <span className={styles.description}>
                Recibe alertas en tu dispositivo
              </span>
            </label>
          </div>
          <div className={styles.preferenceControl}>
            <input
              id="push-toggle"
              type="checkbox"
              checked={preferences.push_enabled}
              onChange={() => togglePreference("push_enabled")}
              className={styles.toggle}
            />
            <span className={styles.toggleLabel}>
              {preferences.push_enabled ? "Activado" : "Desactivado"}
            </span>
          </div>
        </div>

        <div className={styles.preference}>
          <div className={styles.preferenceLabel}>
            <label htmlFor="sms-toggle">
              <strong>SMS (Texto)</strong>
              <span className={styles.description}>
                Recibe alertas por mensaje de texto
              </span>
            </label>
          </div>
          <div className={styles.preferenceControl}>
            <input
              id="sms-toggle"
              type="checkbox"
              checked={preferences.sms_enabled}
              onChange={() => togglePreference("sms_enabled")}
              className={styles.toggle}
            />
            <span className={styles.toggleLabel}>
              {preferences.sms_enabled ? "Activado" : "Desactivado"}
            </span>
          </div>
        </div>
      </div>

      {/* Alert Frequency */}
      <div className={styles.section}>
        <h3>Frecuencia de Alertas</h3>
        <p className={styles.description}>
          ¿Con qué frecuencia deseas recibir alertas de crisis?
        </p>

        <div className={styles.frequencyOptions}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="frequency"
              value="immediate"
              checked={preferences.alert_frequency === "immediate"}
              onChange={(e) => updateFrequency(e.target.value)}
            />
            <span>
              <strong>Inmediato</strong>
              <br />
              <small>Recibe alertas apenas se detecten problemas</small>
            </span>
          </label>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="frequency"
              value="daily"
              checked={preferences.alert_frequency === "daily"}
              onChange={(e) => updateFrequency(e.target.value)}
            />
            <span>
              <strong>Diariamente</strong>
              <br />
              <small>Recibe un resumen de alertas cada día</small>
            </span>
          </label>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="frequency"
              value="weekly"
              checked={preferences.alert_frequency === "weekly"}
              onChange={(e) => updateFrequency(e.target.value)}
            />
            <span>
              <strong>Semanalmente</strong>
              <br />
              <small>Recibe un resumen de alertas cada semana</small>
            </span>
          </label>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div
          className={`${styles.message} ${styles[`message-${message.type}`]}`}
        >
          {message.text}
        </div>
      )}

      {/* Save Button */}
      <div className={styles.actions}>
        <button
          onClick={savePreferences}
          disabled={saving}
          className={styles.saveButton}
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
}

export default NotificationPreferences;
