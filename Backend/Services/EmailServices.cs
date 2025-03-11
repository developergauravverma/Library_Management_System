using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class EmailServices
    {
        public IConfiguration _config {get;set;}
        public EmailServices(IConfiguration config)
        {
            _config = config;
        }

        public void SendEmail(string toEmail, string subject, string body)
        {
            string fromEmail = _config.GetSection("Constants:FromEmail").Value ?? string.Empty;
            string VPassword = _config.GetSection("Constants:EmailVerificationPassword").Value ?? string.Empty;

            var message = new MailMessage(){
                From = new MailAddress(fromEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            message.To.Add(toEmail);

            var smtpClient = new SmtpClient("smtp.gmail.com"){
                Port = 587,
                EnableSsl = true,
                Credentials = new NetworkCredential(fromEmail,VPassword)
            };

            smtpClient.Send(message);
        }
    }
}