const nodemailer = require('nodemailer');
const crypto = require('crypto');

class EmailService {
  constructor() {
    // Create transporter for Gmail (you can use other services too)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
  }

  // Generate a secure 6-digit OTP
  static generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Send verification email with OTP
  async sendVerificationEmail(email, otp, userName = 'User') {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Verify your Skill Swap account',
        html: this.getVerificationEmailTemplate(otp, userName, email)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Verification email sent to: ${email}`);
      console.log(`📧 Message ID: ${result.messageId}`);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email
  async sendWelcomeEmail(email, name) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: `Welcome to Skill Swap, ${name}!`,
        html: this.getWelcomeEmailTemplate(name)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Welcome email sent to: ${email}`);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Welcome email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, resetToken, name = 'User') {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Reset your Skill Swap password',
        html: this.getPasswordResetEmailTemplate(resetToken, name)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Password reset email sent to: ${email}`);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Password reset email error:', error);
      return { success: false, error: error.message };
    }
  }

  // HTML template for verification email
  getVerificationEmailTemplate(otp, userName, email) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your Skill Swap account</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
          }
          .otp-container {
            background-color: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #007bff;
            letter-spacing: 5px;
            font-family: 'Courier New', monospace;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            margin: 10px 0;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Skill Swap</div>
            <h2>Verify your email address</h2>
          </div>
          
          <p>Hello ${userName},</p>
          
          <p>Thank you for signing up for Skill Swap! To complete your registration, please use the verification code below:</p>
          
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
          </div>
          
          <p>This verification code will expire in <strong>10 minutes</strong> for security reasons.</p>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> Never share this code with anyone. Skill Swap will never ask for this code via phone, email, or any other communication method.
          </div>
          
          <p>If you didn't create an account with Skill Swap, you can safely ignore this email.</p>
          
          <p>Best regards,<br>The Skill Swap Team</p>
          
          <div class="footer">
            <p>This email was sent to ${email}</p>
            <p>© 2024 Skill Swap. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // HTML template for welcome email
  getWelcomeEmailTemplate(name) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Skill Swap!</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
          }
          .welcome-message {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 20px 0;
          }
          .features {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          .feature {
            display: flex;
            align-items: center;
            margin: 10px 0;
          }
          .feature-icon {
            width: 20px;
            height: 20px;
            background-color: #007bff;
            border-radius: 50%;
            margin-right: 10px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            margin: 10px 0;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Skill Swap</div>
          </div>
          
          <div class="welcome-message">
            <h2>🎉 Welcome to Skill Swap, ${name}!</h2>
            <p>Your account has been successfully verified and you're ready to start exchanging skills!</p>
          </div>
          
          <p>We're excited to have you join our community of learners and teachers. Here's what you can do now:</p>
          
          <div class="features">
            <div class="feature">
              <div class="feature-icon"></div>
              <span>📝 Create your profile and list your skills</span>
            </div>
            <div class="feature">
              <div class="feature-icon"></div>
              <span>🔍 Browse other users and find skills to learn</span>
            </div>
            <div class="feature">
              <div class="feature-icon"></div>
              <span>🤝 Send and receive skill swap requests</span>
            </div>
            <div class="feature">
              <div class="feature-icon"></div>
              <span>⭐ Rate and review your learning experiences</span>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">
              Get Started
            </a>
          </div>
          
          <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
          
          <p>Happy learning!<br>The Skill Swap Team</p>
          
          <div class="footer">
            <p>© 2024 Skill Swap. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // HTML template for password reset email
  getPasswordResetEmailTemplate(resetToken, name) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your Skill Swap password</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            margin: 10px 0;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Skill Swap</div>
            <h2>Reset your password</h2>
          </div>
          
          <p>Hello ${name},</p>
          
          <p>We received a request to reset your password for your Skill Swap account. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}" class="button">
              Reset Password
            </a>
          </div>
          
          <p>This link will expire in <strong>1 hour</strong> for security reasons.</p>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </div>
          
          <p>Best regards,<br>The Skill Swap Team</p>
          
          <div class="footer">
            <p>© 2024 Skill Swap. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = EmailService; 