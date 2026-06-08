/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Firebase Functions for J&K Services - Email notifications

const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const { Resend } = require("resend");

// Secret API key for Resend email service
const resendApiKey = defineSecret("RESEND_API_KEY");

// Human-readable status labels
const statusLabels = {
  quote_requested: "Quote Requested",
  pending: "Pending Review",
  reviewing: "Under Review",
  quoted: "Quote Ready",
  approved: "Approved",
  deposit_paid: "Deposit Received",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Status update messages for customers
const statusMessages = {
  quote_requested: "Your quote request has been received and is awaiting review.",
  pending: "Your request has been received and is awaiting review.",
  reviewing: "We are currently reviewing your request.",
  quoted: "Your quote is ready and waiting for your review.",
  approved: "Your project has been approved and is moving forward.",
  deposit_paid: "We have received your deposit payment.",
  scheduled: "Your project has been scheduled.",
  in_progress: "Work on your project is now underway.",
  completed: "Your project has been completed. Thank you for choosing J&K Services!",
  cancelled: "This project has been cancelled. Please contact us if you have questions.",
};

// Professional email styling
const emailStyles = `
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .header {
      background: linear-gradient(135deg, #1a472a 0%, #0d2818 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .logo {
      max-width: 180px;
      margin-bottom: 16px;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 600;
      color: #1a472a;
      margin-bottom: 16px;
    }
    .message {
      color: #555555;
      margin-bottom: 28px;
      font-size: 15px;
    }
    .details-card {
      background-color: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 24px;
      border-left: 4px solid #1a472a;
    }
    .details-title {
      font-size: 18px;
      font-weight: 700;
      color: #1a472a;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e0e0e0;
    }
    .detail-row {
      display: flex;
      margin-bottom: 12px;
      padding: 6px 0;
      border-bottom: 1px solid #e8e8e8;
    }
    .detail-label {
      width: 120px;
      font-weight: 600;
      color: #333333;
    }
    .detail-value {
      flex: 1;
      color: #555555;
    }
    .status-badge {
      display: inline-block;
      background-color: #1a472a;
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }
    .price-box {
      background-color: #1a472a;
      color: white;
      padding: 16px 20px;
      border-radius: 10px;
      margin-top: 16px;
      text-align: center;
    }
    .price-amount {
      font-size: 28px;
      font-weight: 700;
    }
    .price-label {
      font-size: 13px;
      opacity: 0.9;
      margin-top: 4px;
    }
    .client-section {
      background-color: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
      margin: 24px 0;
    }
    .client-title {
      font-size: 16px;
      font-weight: 700;
      color: #1a472a;
      margin-bottom: 16px;
    }
    .button {
      display: inline-block;
      background-color: #1a472a;
      color: white;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      font-weight: 500;
      margin: 16px 0;
      text-align: center;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 24px 28px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      font-size: 13px;
      color: #888888;
    }
    .footer p {
      margin: 4px 0;
    }
    hr {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 20px 0;
    }
    @media (max-width: 600px) {
      .content, .footer {
        padding-left: 20px;
        padding-right: 20px;
      }
      .detail-row {
        flex-direction: column;
      }
      .detail-label {
        width: auto;
        margin-bottom: 4px;
      }
    }
  </style>
`;

// Function to generate professional email HTML
function generateProfessionalEmail(content, includeLogo = true) {
  const logoHtml = includeLogo ? `
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="https://firebasestorage.googleapis.com/v0/b/jk-services-group.firebasestorage.app/o/JK.png?alt=media&token=ecfe3dbe-d6d7-4399-bb6d-8f59303f3da1" alt="J&K Services Group" style="max-width: 160px; height: auto;">
    </div>
  ` : '';
  
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <div class="header" style="background: linear-gradient(135deg, #1a472a 0%, #0d2818 100%); padding: 32px 24px; text-align: center;">
        ${logoHtml}
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">${content.title || 'J&K Services Group'}</h1>
      </div>
      <div class="content" style="padding: 32px 28px;">
        ${content.body}
      </div>
      <div class="footer" style="background-color: #f8f9fa; padding: 24px 28px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 13px; color: #888888;">
        <p>© ${new Date().getFullYear()} J&K Services Group. All rights reserved.</p>
        <p>Contact us: <a href="mailto:info@myjkservices.com" style="color: #1a472a; text-decoration: none;">info@myjkservices.com</a></p>
        <p>📍 Serving your community with excellence</p>
      </div>
    </div>
  </body>
  </html>`;
}

// Triggered when a new service request is created
exports.sendCustomerConfirmation = onDocumentCreated(
  { document: "serviceRequests/{requestId}", secrets: [resendApiKey] },
  async (event) => {
    try {
      const data = event.data.data();
      if (!data?.email) return;

      const resend = new Resend(resendApiKey.value());
      
      const confirmationContent = {
        title: "Request Received - " + data.requestId,
        body: `
          <div class="greeting" style="font-size: 20px; font-weight: 600; color: #1a472a; margin-bottom: 16px;">
            Thank You, ${data.customerName}!
          </div>
          <div class="message" style="color: #555555; margin-bottom: 28px; font-size: 15px;">
            We have received your request and our team will review it promptly. 
            You will receive updates as we process your request.
          </div>
          
          <div class="details-card" style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #1a472a;">
            <div class="details-title" style="font-size: 18px; font-weight: 700; color: #1a472a; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0;">
              Service Request Details
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Request ID:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${data.requestId}</div>
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Service:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${data.serviceType}</div>
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Status:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">
                <span class="status-badge" style="display: inline-block; background-color: #1a472a; color: white; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500;">
                  ${statusLabels[data.status] || data.status}
                </span>
              </div>
            </div>
          </div>
          
          <div class="client-section" style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin: 24px 0;">
            <div class="client-title" style="font-size: 16px; font-weight: 700; color: #1a472a; margin-bottom: 16px;">
              Client Information
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Name:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${data.customerName}</div>
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Contact:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${data.phone || 'Not provided'}</div>
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Email:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${data.email}</div>
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <div class="message" style="color: #555555; margin-bottom: 28px; font-size: 15px;">
            <strong>What's next?</strong><br>
            Our team will review your request within 24-48 hours and contact you with a detailed quote or next steps.
          </div>
        `
      };
      
      const adminContent = {
        title: "New Project Request - Action Required",
        body: `
          <div class="greeting" style="font-size: 20px; font-weight: 600; color: #1a472a; margin-bottom: 16px;">
            New Service Request Received
          </div>
          <div class="message" style="color: #555555; margin-bottom: 28px; font-size: 15px;">
            A new service request has been submitted and requires your attention.
          </div>
          
          <div class="details-card" style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #1a472a;">
            <div class="details-title" style="font-size: 18px; font-weight: 700; color: #1a472a; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0;">
              Project Details
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Request ID:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${data.requestId}</div>
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Customer:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${data.customerName}</div>
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Service:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${data.serviceType}</div>
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Phone:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${data.phone || 'Not provided'}</div>
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Email:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${data.email}</div>
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <div class="message" style="color: #555555; margin-bottom: 28px; font-size: 15px;">
            Please review this request and update the status accordingly.
          </div>
        `
      };

      // Send confirmation to customer and admin
      await Promise.all([
        resend.emails.send({
          from: "J&K Services Group <info@myjkservices.com>",
          to: data.email,
          subject: `Request Received - ${data.requestId}`,
          html: generateProfessionalEmail(confirmationContent, true),
        }),
        resend.emails.send({
          from: "J&K Services Group <info@myjkservices.com>",
          to: "jbizazu@myjkservices.com",
          subject: `New Project Request - ${data.requestId}`,
          html: generateProfessionalEmail(adminContent, true),
        }),
      ]);

      console.log(`Professional emails sent for request ${data.requestId}`);
    } catch (error) {
      console.error("New request email error:", error);
    }
  }
);

// Triggered when a service request status is updated
exports.sendStatusUpdate = onDocumentUpdated(
  { document: "serviceRequests/{requestId}", secrets: [resendApiKey] },
  async (event) => {
    try {
      const before = event.data.before.data();
      const after = event.data.after.data();

      if (!before || !after) {
        console.log("Missing before/after data");
        return;
      }
      
      // Exit if status didn't actually change
      if (before.status === after.status || !after?.email) return;

      const resend = new Resend(resendApiKey.value());
      const message = statusMessages[after.status] || `Your project status is now ${after.status}`;
      const statusLabel = statusLabels[after.status] || after.status;

      const customerContent = {
        title: `Project Update - ${after.requestId}`,
        body: `
          <div class="greeting" style="font-size: 20px; font-weight: 600; color: #1a472a; margin-bottom: 16px;">
            Hello ${after.customerName},
          </div>
          <div class="message" style="color: #555555; margin-bottom: 28px; font-size: 15px;">
            We wanted to keep you informed about your project's progress.
          </div>
          
          <div class="details-card" style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #1a472a;">
            <div class="details-title" style="font-size: 18px; font-weight: 700; color: #1a472a; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0;">
              Status Update
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Request ID:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${after.requestId}</div>
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Service:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${after.serviceType}</div>
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Status:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">
                <span class="status-badge" style="display: inline-block; background-color: #1a472a; color: white; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500;">
                  ${statusLabel}
                </span>
              </div>
            </div>
          </div>
          
          <div class="message" style="color: #555555; margin-bottom: 28px; font-size: 15px; background-color: #f0f7f0; padding: 16px; border-radius: 8px;">
            <strong>📋 Update Details:</strong><br>
            ${message}
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <div class="message" style="color: #555555; font-size: 13px;">
            If you have any questions about this update, please don't hesitate to contact us.
          </div>
        `
      };

      const adminContent = {
        title: `Status Updated - ${after.requestId}`,
        body: `
          <div class="greeting" style="font-size: 20px; font-weight: 600; color: #1a472a; margin-bottom: 16px;">
            Project Status Changed
          </div>
          
          <div class="details-card" style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #1a472a;">
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Customer:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${after.customerName}</div>
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Previous Status:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${statusLabels[before.status] || before.status}</div>
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">New Status:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">
                <span class="status-badge" style="display: inline-block; background-color: #1a472a; color: white; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500;">
                  ${statusLabel}
                </span>
              </div>
            </div>
            <div class="detail-row" style="display: flex; margin-bottom: 12px; padding: 6px 0; border-bottom: 1px solid #e8e8e8;">
              <div class="detail-label" style="width: 120px; font-weight: 600; color: #333333;">Request ID:</div>
              <div class="detail-value" style="flex: 1; color: #555555;">${after.requestId}</div>
            </div>
          </div>
        `
      };

      // Send status update to customer and admin
      await Promise.all([
        resend.emails.send({
          from: "J&K Services Group <info@myjkservices.com>",
          to: after.email,
          subject: `Project Update - ${after.requestId}`,
          html: generateProfessionalEmail(customerContent, true),
        }),
        resend.emails.send({
          from: "J&K Services Group <info@myjkservices.com>",
          to: "jbizazu@myjkservices.com",
          subject: `Status Changed - ${after.requestId}`,
          html: generateProfessionalEmail(adminContent, true),
        }),
      ]);

      console.log(`Professional status email sent to ${after.email} (${before.status} → ${after.status})`);
    } catch (error) {
      console.error("Status email error:", error);
    }
  }
);