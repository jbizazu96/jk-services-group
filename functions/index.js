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
  deposit_paid: "We have received your payment.",
  scheduled: "Your project has been scheduled.",
  in_progress: "Work on your project is now underway.",
  completed: "Your project has been completed.",
  cancelled: "This project has been cancelled.",
};

// Triggered when a new service request is created
exports.sendCustomerConfirmation = onDocumentCreated(
  { document: "serviceRequests/{requestId}", secrets: [resendApiKey] },
  async (event) => {
    try {
      const data = event.data.data();
      if (!data?.email) return;

      const resend = new Resend(resendApiKey.value());

      // Send confirmation to customer and admin
      await Promise.all([
          resend.emails.send({
            from: "info@myjkservices.com",
            to: data.email,
            subject: `Request Received - ${data.requestId}`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px">
                <h2>Thank You ${data.customerName}</h2>
                <p>We have received your request.</p>
                <p><strong>Request ID:</strong> ${data.requestId}</p>
                <p><strong>Service:</strong> ${data.serviceType}</p>
                <p>Our team will review your request and contact you shortly.</p>
                <hr>
                <p>J&K Services Group</p>
              </div>
            `,
          }),

          resend.emails.send({
            from: "info@myjkservices.com",
            to: "jbizazu@myjkservices.com",
            subject: `New Project Request - ${data.requestId}`,
            html: `
              <h2>New Project Request</h2>
              <p><strong>Name:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Phone:</strong> ${data.phone}</p>
              <p><strong>Service:</strong> ${data.serviceType}</p>
              <p><strong>Status:</strong> ${data.status}</p>
            `,
          }),
        ]);

      console.log(`Emails sent for request ${data.requestId}`);
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

      // Send status update to customer and admin
      await Promise.all([
            resend.emails.send({
              from: "info@myjkservices.com",
              to: after.email,
              subject: `Project Update - ${after.requestId}`,
              html: `
                <div style="font-family:Arial,sans-serif;max-width:600px">
                  <h2>Project Status Update</h2>
                  <p>Hello ${after.customerName},</p>
                  <p>Your project status has changed.</p>
                  <p><strong>Request ID:</strong> ${after.requestId}</p>
                  <p><strong>Status:</strong> ${statusLabels[after.status] || after.status}</p>
                  <p>${message}</p>
                  <hr>
                  <p>J&K Services Group</p>
                </div>
              `,
            }),

            resend.emails.send({
              from: "info@myjkservices.com",
              to: "jbizazu@myjkservices.com",
              subject: `Status Changed - ${after.requestId}`,
              html: `
                <h2>Status Updated</h2>
                <p><strong>Customer:</strong> ${after.customerName}</p>
                <p><strong>Previous Status:</strong> ${statusLabels[before.status] || before.status}</p>
                <p><strong>New Status:</strong> ${statusLabels[after.status] || after.status}</p>
                <p><strong>Request ID:</strong> ${after.requestId}</p>
              `,
            }),
          ]);

      console.log(`Status email sent to ${after.email} (${before.status} → ${after.status})`);
    } catch (error) {
      console.error("Status email error:", error);
    }
  
  }
);