/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/* ==========================================
   IMPORTS
========================================== */

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const { Resend } = require("resend");

/* ==========================================
   RESEND SECRET
========================================== */

const resendApiKey = defineSecret("RESEND_API_KEY");

/* ==========================================
   CUSTOMER CONFIRMATION EMAIL
========================================== */

exports.sendCustomerConfirmation = onDocumentCreated(
  {
    document: "serviceRequests/{requestId}",
    secrets: [resendApiKey],
  },
  async (event) => {
    try {
      const data = event.data.data();

      const resend = new Resend(
        resendApiKey.value()
      );

      await resend.emails.send({
        from: "projects@myjkservices.com",
        to: data.email,

        subject: `Request Received - ${data.requestId}`,

        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
            
            <h2>Thank You ${data.customerName}</h2>

            <p>
              We have received your project request.
            </p>

            <p>
              <strong>Request ID:</strong>
              ${data.requestId}
            </p>

            <p>
              Service Requested:
              <strong>${data.serviceType}</strong>
            </p>

            <p>
              Our team will review your request and contact
              you within 24 hours.
            </p>

            <hr>

            <p>
              J&K Services Group
            </p>

          </div>
        `,
      });

      console.log(
        `Customer email sent to ${data.email}`
      );

    } catch (error) {
      console.error(error);
    }
  }
);
