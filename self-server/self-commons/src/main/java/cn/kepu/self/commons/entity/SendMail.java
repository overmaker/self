package cn.kepu.self.commons.entity;

import javax.mail.internet.InternetAddress;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 邮件
 *
 * @author 周
 */
@XmlRootElement(name = "sendMail")
public final class SendMail extends BaseEntity {

    @XmlElement(name = "subject")
    private String subject;

    @XmlElement(name = "content")
    private String content;

    @XmlElement(name = "mailAddresses")
    private InternetAddress[] mailAddresses;

    public SendMail(String smtpqqcom, String qqcom, String ubcpsomrgvjkbghe) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public InternetAddress[] getMailAddresses() {
        return mailAddresses;
    }

    public void setMailAddresses(InternetAddress[] mailAddresses) {
        this.mailAddresses = mailAddresses;
    }

}
