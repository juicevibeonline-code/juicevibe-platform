import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });
      this.logger.log(`Nodemailer SMTP Transporter configured: host=${host}, port=${port}`);
    } else {
      this.logger.warn("SMTP config missing in environment variables. Falling back to Console Logger.");
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"Juice Vibe Cafe" <${process.env.SMTP_USER}>`,
          to,
          subject,
          html,
        });
        this.logger.log(`Email dispatched successfully to ${to}`);
        return true;
      } catch (err: any) {
        this.logger.error(`Failed to dispatch email to ${to}: ${err.message}`);
        return false;
      }
    } else {
      this.logger.log(`[CONSOLE EMAIL DISPATCH]
To: ${to}
Subject: ${subject}
HTML Body:
----------------------------------------
${html}
----------------------------------------`);
      return true;
    }
  }

  async sendOrderConfirmation(to: string, order: any): Promise<boolean> {
    const itemsHtml = order.items
      .map(
        (item: any) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">LKR ${item.price.toLocaleString()}</td>
      </tr>`
      )
      .join("");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e8e4; border-radius: 8px; background-color: #f4faf7; color: #0f2a1e;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #10b981; margin: 0;">JUICE VIBE CAFE</h1>
          <p style="font-size: 12px; font-weight: bold; tracking-wider; text-transform: uppercase; color: #4b6b58; margin-top: 5px;">Bentota, Sri Lanka</p>
        </div>
        <h2 style="border-bottom: 2px solid #10b981; padding-bottom: 10px; color: #0f2a1e;">Order Confirmation</h2>
        <p>Hi ${order.customerName},</p>
        <p>Thank you for your order! Your refreshers are being prepared with love.</p>
        
        <div style="background-color: #ffffff; border: 1px solid #dce8e2; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0 0 5px 0;"><strong>Order Number:</strong> <span style="font-family: monospace; font-size: 14px; font-weight: bold; color: #10b981;">${order.orderNumber}</span></p>
          <p style="margin: 0 0 5px 0;"><strong>Service Type:</strong> ${order.type.toUpperCase()}</p>
          <p style="margin: 0;"><strong>Date Registered:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #e6efea;">
              <th style="padding: 8px; text-align: left; font-size: 12px;">Item Description</th>
              <th style="padding: 8px; text-align: center; font-size: 12px; width: 60px;">Qty</th>
              <th style="padding: 8px; text-align: right; font-size: 12px; width: 100px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="width: 100%; text-align: right; font-size: 14px; line-height: 1.6; margin-top: 10px; border-top: 2px solid #e1e8e4; padding-top: 10px;">
          <p style="margin: 0;">Subtotal: <strong>LKR ${order.subtotal.toLocaleString()}</strong></p>
          ${order.tax > 0 ? `<p style="margin: 0;">Tax: <strong>LKR ${order.tax.toLocaleString()}</strong></p>` : ""}
          ${order.discount > 0 ? `<p style="margin: 0; color: #10b981;">Discount: <strong>- LKR ${order.discount.toLocaleString()}</strong></p>` : ""}
          <p style="margin: 5px 0 0 0; font-size: 16px; color: #10b981;"><strong>Grand Total: LKR ${order.total.toLocaleString()}</strong></p>
        </div>

        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e1e8e4; text-align: center; font-size: 11px; color: #4b6b58;">
          <p style="margin: 0 0 5px 0;">If you have any questions, please contact our helpline.</p>
          <p style="margin: 0;"><strong>Juice Vibe Cafe, Bentota</strong></p>
        </div>
      </div>
    `;

    return this.sendEmail(to, `Order Confirmation #${order.orderNumber} - Juice Vibe`, emailHtml);
  }
}
