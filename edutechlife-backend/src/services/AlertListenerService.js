/**
 * AlertListenerService
 * Listens to crisis_alerts table for new inserts via Supabase realtime
 * Automatically triggers notifications to parents when alerts are created
 *
 * Used by: src/index.js (started on server boot)
 */

const { createClient } = require('@supabase/supabase-js');
const notificationService = require('./NotificationService');

class AlertListenerService {
  /**
   * Initialize and start the realtime listener
   * @param {string} supabaseUrl - Supabase project URL
   * @param {string} serviceRoleKey - Supabase service role key
   */
  constructor(supabaseUrl, serviceRoleKey) {
    this.supabase = createClient(supabaseUrl, serviceRoleKey);
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
    console.log('[AlertListenerService] Starting listener for crisis_alerts');

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
          console.error('[AlertListenerService] Subscription error:', error.message);
          this.handleError();
        })
        .on('status', (status) => {
          console.log('[AlertListenerService] Subscription status:', status);
          if (status === 'SUBSCRIBED') {
            this.retryCount = 0; // Reset retry count on successful connection
          }
        })
        .subscribe();

      console.log('[AlertListenerService] Listener started successfully');
    } catch (error) {
      console.error('[AlertListenerService] Error starting listener:', error.message);
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
      console.log(`[AlertListenerService] New crisis alert detected: ${crisisAlert.id}`);

      // Send notification to parent
      const result = await notificationService.sendCrisisAlert(crisisAlert.id);

      if (result.success) {
        console.log(`[AlertListenerService] Notification sent for alert ${crisisAlert.id}`);
      } else {
        console.error(
          `[AlertListenerService] Failed to send notification for alert ${crisisAlert.id}: ${result.error}`
        );
      }
    } catch (error) {
      console.error('[AlertListenerService] Error handling new alert:', error.message);
    }
  }

  /**
   * Handle listener error with exponential backoff retry
   * @private
   */
  async handleError() {
    if (this.retryCount >= this.maxRetries) {
      console.error('[AlertListenerService] Max retries reached. Listener stopped.');
      return;
    }

    this.retryCount++;
    const delay = this.retryDelay * Math.pow(2, this.retryCount - 1);

    console.log(
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
    console.log('[AlertListenerService] Stopping listener');

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
      console.error('[AlertListenerService] Health check failed:', error.message);
      return false;
    }
  }
}

module.exports = AlertListenerService;
