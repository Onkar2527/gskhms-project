package com.codecraft.master.services.impl;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.AddressException;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.*;
import javax.mail.internet.*;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Properties;

public class EmailAttachmentSender {

    public static void sendEmailWithAttachments(String host, String port,
                                                final String userName, final String password, List<String> toAddresses,
                                                String subject, String message, MultipartFile mfile)
            throws AddressException, MessagingException, javax.mail.MessagingException {
        // sets SMTP server properties
        Properties properties = new Properties();
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", port);
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.user", userName);
        properties.put("mail.password", password);

        // creates a new session with an authenticator
        Authenticator auth = new Authenticator() {
            public PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(userName, password);
            }
        };
        Session session = Session.getInstance(properties, auth);

        // creates a new e-mail message
        Message msg = new MimeMessage(session);

        msg.setFrom(new InternetAddress(userName));


        InternetAddress[] toAddressee = new InternetAddress[toAddresses.size()]; //{new InternetAddress(toAddress)};
        for(int i = 0; i < toAddresses.size(); i++)
            toAddressee[i] = new InternetAddress(toAddresses.get(i));


        msg.setRecipients(Message.RecipientType.TO, toAddressee);
        msg.setSubject(subject);
        msg.setSentDate(new Date());
        msg.setText("blabla");
        // creates message part
        MimeBodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setContent(message, "text/html");

        // creates multi-part
        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);

        // adds attachments
      //  if(attachFiles != null && attachFiles.length > 0){
          //  for (MultipartFile filePath : attachFiles) {
                MimeBodyPart attachPart = new MimeBodyPart();
                try {
                    mfile.transferTo(new File(mfile.getOriginalFilename()).getAbsoluteFile());
                   // attachPart.setContent(mfile.getBytes(), mfile.getContentType());
                    attachPart.attachFile(mfile.getOriginalFilename());
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
                multipart.addBodyPart(attachPart);
           // }
    //    }
        //multipart.addBodyPart(mfile);
        // sets the multi-part as e-mail's content
        msg.setContent(multipart);

        // sends the e-mail
        Transport.send(msg);

    }

}
