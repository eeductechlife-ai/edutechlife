/**
 * AlertListenerService
 * Listens to crisis_alerts table for new inserts via Supabase realtime
 * Automatically triggers notifications to parents when alerts are created
 *
 * Used by: src/index.js (started on server boot)
 */

const { createClient } = require('@supabase/supabase-js');
const notificationService = require('./NotificationService');
const logger = require('../utils/logger');

class AlertListenerService {
  /**
   * Initialize and start the realtime listener
   * @param {string} supabaseUrl - Supabase project URL
   * @param {string} serviceRoleKey - Supabase service role key
   */
  constructor(supabaseUrl, serviceRoleKey) {
    // No lanzar si falta configuración: antes `createClient` con una key
    // undefined tiraba "supabaseKey is required" y tumbaba TODO el backend al
    // importar app.js (el deploy de Render fallaba con exit 1). Ahora el
    // listener se desactiva con un aviso y el resto de la API sigue operando.
    this.supabase = null;
    if (!supabaseUrl || !serviceRoleKey) {
      logger.warn(
        '[AlertListenerService] Desactivado: falta SUPABASE_URL o la service key ' +
          '(SUPABASE_SERVICE_ROLE_KEY / SUPABASE_SERVICE_KEY).',
      );
    } else {
      this.supabase = createClient(supabaseUrl, serviceRoleKey);
    }
    this.subscription = null;
    this.retryCount = 0;
    this.maxRetries = 5;
    this.retryDelay = 2000; // 2 seconds
  }

  /**
   * Setup and start the realtime listener
   * Listens for INSERT events on crisis_alerts table
   */
  start() {
    if (!this.supabase) {
      logger.warn(
        '[AlertListenerService] Sin cliente Supabase: listener no iniciado.',
      );
      return;
    }

    logger.info('[AlertListenerService] Starting listener for crisis_alerts');

    try {
      this.subscription = this.supabase
        .channel('public:crisis_alerts')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'crisis_alerts'
          },
          async (payload) => {
            await this.handleNewAlert(payload);
          }
        )
        .on('error', (error) => {
          logger.error('[AlertListenerService] Subscription error:', error.message);
          this.handleError();
        })
        .on('status', (status) => {
          logger.info('[AlertListenerService] Subscription status:', status);
          if (status === 'SUBSCRIBED') {
            this.retryCount = 0; // Reset retry count on successful connection
          }
        })
        .subscribe();

      logger.info('[AlertListenerService] Listener started successfully');
    } catch (error) {
      logger.error('[AlertListenerService] Error starting listener:', error.message);
      this.handleError();
    }
  }

  /**
   * Handle new crisis alert
   * @private
   */
  async handleNewAlert(payload) {
    try {
      const crisisAlert = payload.new;
      logger.info(`[AlertListenerService] New crisis alert detected: ${crisisAlert.id}`);

      // Send notification to parent
      const result = await notificationService.sendCrisisAlert(crisisAlert.id);

      if (result.success) {
        logger.info(`[AlertListenerService] Notification sent for alert ${crisisAlert.id}`);
      } else {
        logger.error(
          `[AlertListenerService] Failed to send notification for alert ${crisisAlert.id}: ${result.error}`
        );
      }
    } catch (error) {
      logger.error('[AlertListenerService] Error handling new alert:', error.message);
    }
  }

  /**
   * Handle listener error with exponential backoff retry
   * @private
   */
  async handleError() {
    if (this.retryCount >= this.maxRetries) {
      logger.error('[AlertListenerService] Max retries reached. Listener stopped.');
      return;
    }

    this.retryCount++;
    const delay = this.retryDelay * Math.pow(2, this.retryCount - 1);

    logger.info(
      `[AlertListenerService] Retrying in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`
    );

    setTimeout(() => {
      this.start();
    }, delay);
  }

  /**
   * Stop the realtime listener
   */
  stop() {
    logger.info('[AlertListenerService] Stopping listener');

    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  /**
   * Health check - verify listener is connected
   * @returns {Promise<boolean>}
   */
  async isHealthy() {
    try {
      if (!this.subscription) {
        return false;
      }

      // Try a simple query to test connection
      const { error } = await this.supabase
        .from('crisis_alerts')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      logger.error('[AlertListenerService] Health check failed:', error.message);
      return false;
    }
  }
}

module.exports = AlertListenerService;
