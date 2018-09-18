package cn.kepu.self.commons.util;

import java.util.Date;
import java.util.Properties;
import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Message.RecipientType;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

/**
 *
 * @author 劉一童
 */
public class SendMail {

    public final String smtpHost;
    public final String userName;
    public final String password;

    public SendMail(String smtpHost, String userName, String password) {
        this.smtpHost = smtpHost;
        this.userName = userName;
        this.password = password;
    }

    public void send(String subject, String content, InternetAddress... mailAddresses) throws Exception {
        final Properties props = new Properties();
        props.setProperty("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.setProperty("mail.smtp.socketFactory.port", "465");
        props.setProperty("mail.smtp.port", "465");
        props.setProperty("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.user", userName);
        props.put("mail.password", password);

        Authenticator authenticator = new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(userName, password);
            }
        };
        Session mailSession = Session.getInstance(props, authenticator);
        MimeMessage message = new MimeMessage(mailSession);

        InternetAddress form = new InternetAddress(userName);
        message.setFrom(form);
        message.setRecipients(RecipientType.TO, mailAddresses);

        message.setSentDate(new Date());
        message.setSubject(subject);
        Multipart mainPart = new MimeMultipart();
        BodyPart html = new MimeBodyPart();
        html.setContent(content, "text/html; charset=utf-8");
        mainPart.addBodyPart(html);
        message.setContent(mainPart);

        Transport.send(message);
    }

//    public static void main(String args[]) throws AddressException, Exception {
//
//        String filePath = ("E:/JAVA/项目/SELF/kepu-self(1)/kepu-self/self-server/self-commons/src/main/java/cn/kepu/self/commons/util/sendMail.html");
//        String title = "小旺仔";
//        String html = "";
//        html += "<!DOCTYPE html>";
//        html += "<html>";
//        html += "  <meta charset=\"UTF-8\">";
//        html += " <link rel=\"stylesheet\" type=\"text/css\" href=\"css/styles.css\"> </head>";
//        html += "<body>";
//        html += "  <div class='container_ui'> <input id='message-1' type='checkbox' ";
//        html += "checked=\"checked\"> <label for='message-1'><div class='container_ui__expand' ";
//        html += "style=\"margin-top: 3%;\" >";
//        html += " <div class='body'> ";
//        html += "     <div class='user'> ";
//        html += " <div class='face'> <img src='";
//        html += " http://i.shangc.net/2017/0105/20170105114938828.jpg'> </div>";
//        html += " <div class='details'>";
//        html += " <h2>www.baidu.com</h2>";
//        html += "<h3>$$$$$</h3> </div><a href=\"www.baidu.com\">www.baidu.com</a>";
//        html += " </div>";
//        html += "   <div class='content'>";
//        html += "<p><b>" + title + "</b> ";
//        html += "   </br>#####</p><br />";
//        html += "</div></div></div></div></label></body></html>";
//
//        SendMail mail = new SendMail("smtp.qq.com", "", ");
//        mail.send("你好，我是test1", html, new InternetAddress("hanyafeng158@qq.com"));
//
//    }
}
