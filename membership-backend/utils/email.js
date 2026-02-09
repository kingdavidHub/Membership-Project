const pug = require('pug');
const htmlToText = require('html-to-text');
const Mailjet = require('node-mailjet');

module.exports = class Email {
  constructor() {
    this.mailjet = Mailjet.apiConnect(
      process.env.MAILJET_APIKEY,
      process.env.MAILJET_SECRETKEY
    );
  }

  // Send the actual email
  async send(firstName, email, template, subject, body) {
    const html = pug.renderFile(`${__dirname}/emailTemplates/${template}.pug`, {
      firstName: firstName,
      subject,
      body
    });

    const mailOptions = {
      Messages: [
        {
          From: {
            Email: 'qarrfutureme@idunnuoluwa.online',
            Name: "Qarr's Future Me"
          },
          To: [
            {
              Email: email,
              Name: firstName
            }
          ],
          Subject: subject,
          TextPart: htmlToText.htmlToText(html),
          HTMLPart: html
        }
      ]
    };

    try {
      const response = await this.mailjet
        .post('send', { version: 'v3.1' })
        .request(mailOptions);

      // Log the success response to confirm the email was queued by Mailjet
      console.log('Mailjet API Success. Status:', response.response.status);
    } catch (err) {
      // 💥 THIS IS THE CRITICAL ADDITION!
      // The Mailjet wrapper puts the API error details in response.body
      if (err.response && err.response.body && err.response.body.Messages) {
        console.error(
          'Mailjet Error Details:',
          err.response.body.Messages[0].Errors
        );
      } else {
        console.error('General API Error:', err.message);
      }
      // throw new Error('Email sending failed.'); // Re-throw a clean error for upstream handling
    }
  }

  async onCreateUser(email, password, name) {
    const html = pug.renderFile(
      `${__dirname}/emailTemplates/userCreationConfirmation.pug`,
      {
        name,
        email,
        password,
        url: 'google.com'
      }
    );

    const mailOptions = {
      Messages: [
        {
          From: {
            Email: 'membership@idunnuoluwa.online',
            Name: 'Membership'
          },
          To: [
            {
              Email: email,
              Name: name
            }
          ],
          Subject: 'Account creation confirmation',
          TextPart: htmlToText.htmlToText(html),
          HTMLPart: html
        }
      ]
    };

    try {
      const response = await this.mailjet
        .post('send', { version: 'v3.1' })
        .request(mailOptions);

      // Log the success response to confirm the email was queued by Mailjet
      console.log('Mailjet API Success. Status:', response.response.status);
    } catch (err) {
      // 💥 THIS IS THE CRITICAL ADDITION!
      // The Mailjet wrapper puts the API error details in response.body
      if (err.response && err.response.body && err.response.body.Messages) {
        console.error(
          'Mailjet Error Details:',
          err.response.body.Messages[0].Errors
        );
      } else {
        console.error('General API Error:', err.message);
      }
      // throw new Error('Email sending failed.'); // Re-throw a clean error for upstream handling
    }
  }
};
