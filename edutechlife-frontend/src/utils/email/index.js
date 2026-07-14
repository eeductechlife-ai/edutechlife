export { EmailService } from "./sender.js";
export { getAppointmentConfirmationTemplate } from "./templates.js";
export { getAppointmentReminder24hTemplate } from "./templates.js";
export { getAppointmentReminder1hTemplate } from "./templates.js";
export { getLeadWelcomeTemplate } from "./templates.js";
export { EMAIL_CONFIG } from "./config.js";

import { EmailService } from "./sender.js";

const emailService = new EmailService();

export default emailService;
