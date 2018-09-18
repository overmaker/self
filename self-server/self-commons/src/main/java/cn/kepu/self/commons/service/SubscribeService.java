package cn.kepu.self.commons.service;

import cn.kepu.self.commons.dao.SubscribeDAO;
import cn.kepu.self.commons.entity.Subscribe;
import cn.kepu.self.commons.util.SendMail;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import javax.mail.internet.InternetAddress;

/**
 *
 * @author 劉一童
 */
public enum SubscribeService {
    INSTANCE;

    private SubscribeService() {
    }

    public static SubscribeService getInstance() {
        return INSTANCE;
    }

    private SubscribeDAO subscribeDAO;
    private SendMail sendMail;

    public void setSubscribeDAO(SubscribeDAO subscribeDAO) {
        this.subscribeDAO = subscribeDAO;
    }

    public void setSendMail(SendMail sendMail) {
        this.sendMail = sendMail;
    }

    public void addSubscribe(Subscribe subscribe) {
        subscribeDAO.insertSubscribe(subscribe);
    }

    public void deleteSubscribe(String email) {
        subscribeDAO.deleteSubscribe(email);
    }

    public void sendAll(String title, String thumbnai, String content) throws Exception {
        List<Subscribe> list = subscribeDAO.selectAll();

        byte[] bytes = Files.readAllBytes(Paths.get("mail-template.html"));
        String str = new String(bytes, "utf-8");
        str = str.replace("<![CDATA[#####]]>", "http//:114.115.149.5");
        str = str.replace("<![CDATA[$$$$$]]>", thumbnai);
        str = str.replace("<![CDATA[*****]]>", content);
        str = str.replace("<![CDATA[%%%%%]]>", title);
        System.out.println(str);
        for (Subscribe subs : list) {
            System.out.println(subs.getEmail());
            sendMail.send("title", str, new InternetAddress(subs.getEmail()));
        }
    }
}
