package cn.kepu.self.commons.service;

import cn.kepu.self.commons.util.SendMail;
import javax.mail.internet.InternetAddress;
import cn.kepu.self.commons.util.ToString;

/**
 *
 * @author 劉一童
 */
public enum MailService {
    INSTANCE;

    private MailService() {
    }

    public static MailService getInstance() {
        return INSTANCE;
    }

    public SendMail sendMail;

    public void setSendMail(SendMail sendMail) {
        this.sendMail = sendMail;
    }

    public void send(String subject, String content, InternetAddress... mailAddresses) throws Exception {
        sendMail.send(subject, content, mailAddresses);
    }

    public void ToString(String qdpPath, String appPath) throws Exception {
        ToString.ToString2(qdpPath,appPath);
    }

//    public void ToString2(String[] args) {
//        ToString.ToString(args);
//    }
}
