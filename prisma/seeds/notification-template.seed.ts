import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const NotificationTemplateSeeder = async () => {
  const notificationTemplate = [
    {
      id: 'signup-verification',
      subject: 'Verify your Email',
      default_content: `
            <html>
              <body>
                <h1>Welcome, {{name}}!</h1>
                <p>Thank you for registering with your email: {{email}}</p>
                <p><a href="{{APP_URL}}/api/auth/verify?token={{token}}">Verify your email</a></p>
              </body>
            </html>
          `,
      notificationTypeId: 2,
    },
    {
      id: 'reset-password-template',
      subject: 'Reset your password',
      default_content: `
      <html>
        <body>
          <h1>Welcome, {{full_name}}!</h1>
          <p>Your Password reset is in process: {{email}}</p>
          <p>Click <a href="{{RESET_LINK}}">here</a> to reset password</p>
          <p>If you did not request this, you can ignore this email.</p>
        </body>
      </html>
    `,
      notificationTypeId: 3,
    },
  ];

  for (const template of notificationTemplate) {
    try {
      await prisma.notificationTemplate.upsert({
        // where: { name: type.name },
        where: { id: template.id },
        update: {},
        create: {
          id: template.id,
          subject: template.subject,
          default_content: template.default_content,
          notificationTypeId: template.notificationTypeId,
        },
      });
      console.log(`Upserted role: ${template.subject}`);
    } catch (error) {
      console.error(`Error upserting role ${template.subject}:`, error);
    }
  }

  console.log('Notification Type seeded successfully');
};
