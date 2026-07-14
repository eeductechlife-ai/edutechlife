import {
  loadMetrics,
  saveMetrics,
  loadABTests,
  saveABTests,
  initialize,
  clearData,
} from "./storage";
import {
  recordSessionStart,
  recordSessionEnd,
  recordMessage,
} from "./sessionTracker";
import { recordLead } from "./leadTracker";
import {
  recordAppointment,
  updateAppointmentStatus,
} from "./appointmentTracker";
import {
  getVariant,
  recordTestAttempt,
  optimizeTestWeights,
  getABTestResults,
} from "./abTesting";
import {
  getMetrics,
  getSummaryMetrics,
  generateCSVReport,
  exportReport,
  exportData,
  generateHourlyTrends,
  getLeadSources,
  getRecentActivity,
  getTopInterests,
  getPeakHours,
  getPromptEffectiveness,
  getActiveTests,
} from "./reports";
import {
  analyzeSuccessfulConversations,
  getOptimizationSuggestions,
  runOptimization,
} from "./optimization";

class AnalyticsService {
  constructor() {
    this.STORAGE_KEY = "edutechlife_analytics";
    this.AB_TESTING_KEY = "edutechlife_ab_tests";
    this.initialized = false;
    this.metrics = this.loadMetrics();
    this.abTests = this.loadABTests();
    this.sessionStartTime = null;
    this.currentSessionId = null;
  }

  getStatus() {
    return {
      initialized: this.initialized,
      currentSessionId: this.currentSessionId,
      totalSessions: this.metrics.totalSessions,
      totalLeads: this.metrics.totalLeads,
      totalAppointments: this.metrics.totalAppointments,
      lastUpdated: this.metrics.lastUpdated,
    };
  }
}

Object.assign(AnalyticsService.prototype, {
  loadMetrics,
  saveMetrics,
  loadABTests,
  saveABTests,
  initialize,
  clearData,
  recordSessionStart,
  recordSessionEnd,
  recordMessage,
  recordLead,
  recordAppointment,
  updateAppointmentStatus,
  getVariant,
  recordTestAttempt,
  optimizeTestWeights,
  getABTestResults,
  getMetrics,
  getSummaryMetrics,
  generateCSVReport,
  exportReport,
  exportData,
  generateHourlyTrends,
  getLeadSources,
  getRecentActivity,
  getTopInterests,
  getPeakHours,
  getPromptEffectiveness,
  getActiveTests,
  analyzeSuccessfulConversations,
  getOptimizationSuggestions,
  runOptimization,
});

const analyticsService = new AnalyticsService();
export default analyticsService;
