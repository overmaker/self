package cn.kepu.self.video.service;

import cn.kepu.self.commons.util.SendMail;
import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.SpeakerDAO;
import cn.kepu.self.video.entity.Speaker;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

/**
 * 演讲者管理
 *
 * @author 马亚星
 */
public enum SpeakerService {
    INSTANCE;

    private SpeakerService() {
    }

    private static SpeakerService getInstance() {
        return INSTANCE;
    }

    private SpeakerDAO speakerDAO;

    public void setSpeakerDAO(SpeakerDAO speakerDAO) {
        this.speakerDAO = speakerDAO;
    }

    /**
     * 新增演讲者
     *
     * @param speaker
     */
    public void addOrUpdateSpeaker(Speaker speaker) {
        speakerDAO.addOrUpdateSpeaker(speaker);
        String name = speaker.getName();
        String photo = speaker.getPhoto();
        String introduction = speaker.getIntroduction();
        String html = "";
        html += "<!DOCTYPE html>";
        html += "<html>";
        html += "  <meta charset=\"UTF-8\">";
        html += " <link rel=\"stylesheet\" type=\"text/css\" href=\"css/styles.css\"> </head>";
        html += "<body>";
        html += "  <div class='container_ui'> <input id='message-1' type='checkbox' ";
        html += "checked=\"checked\"> <label for='message-1'><div class='container_ui__expand' ";
        html += "style=\"margin-top: 3%;\" >";
        html += " <div class='body'> ";
        html += "     <div class='user'> ";
        html += " <div class='face'> <img src=" + photo + "> ";
        html += " <div class='details'>";
        html += " <h2>" + name + "</h2>";
        html += "<h3>" + introduction + "</h3> </div>";
        html += " </div>";
        html += "   <div class='content'>";
        html += "<p><b>" + "全文：" + "</b> ";
        html += "   </br>" + "我推荐&&&成为演讲者,请管理员审核" + "</p><br />";
        html += "</div></div></div></div></label></body></html>";
        SendMail mail = new SendMail("smtp.qq.com", "", "");
        try {
            mail.send("你好，我是test1", html, new InternetAddress("hanyafeng158@qq.com"));
        } catch (AddressException ex) {
            Logger.getLogger(SpeakerService.class.getName()).log(Level.SEVERE, null, ex);
        } catch (Exception ex) {
            Logger.getLogger(SpeakerService.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void addOrUpdateAdminSpeaker(Speaker speaker) {
        speakerDAO.addOrUpdateAdminSpeaker(speaker);
        String name = speaker.getName();
        String photo = speaker.getPhoto();
        String introduction = speaker.getIntroduction();
        String html = "";
        html += "<!DOCTYPE html>";
        html += "<html>";
        html += "  <meta charset=\"UTF-8\">";
        html += " <link rel=\"stylesheet\" type=\"text/css\" href=\"css/styles.css\"> </head>";
        html += "<body>";
        html += "  <div class='container_ui'> <input id='message-1' type='checkbox' ";
        html += "checked=\"checked\"> <label for='message-1'><div class='container_ui__expand' ";
        html += "style=\"margin-top: 3%;\" >";
        html += " <div class='body'> ";
        html += "     <div class='user'> ";
        html += " <div class='face'> <img src=" + photo + "> ";
        html += " <div class='details'>";
        html += " <h2>" + name + "</h2>";
        html += "<h3>" + introduction + "</h3> </div>";
        html += " </div>";
        html += "   <div class='content'>";
        html += "<p><b>" + "全文：" + "</b> ";
        html += "   </br>" + "我推荐&&&成为演讲者,请管理员审核" + "</p><br />";
        html += "</div></div></div></div></label></body></html>";
        SendMail mail = new SendMail("smtp.qq.com", "", "");
        try {
            mail.send("你好，我是test1", html, new InternetAddress("hanyafeng158@qq.com"));
        } catch (AddressException ex) {
            Logger.getLogger(SpeakerService.class.getName()).log(Level.SEVERE, null, ex);
        } catch (Exception ex) {
            Logger.getLogger(SpeakerService.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * 更新演讲者
     *
     * @param speaker
     */
    public void upSpearker(Speaker speaker) {
        speakerDAO.upSpearker(speaker);
    }

    public void upAdminSpearker(Speaker speaker) {
        speakerDAO.upAdminSpearker(speaker);
    }

    /**
     * 查询演讲者
     *
     * @param offset
     * @param pageSize
     * @param name
     * @param field
     * @return
     */
    public BinaryPair<List<Speaker>, Long> selSpeaker(int offset, int pageSize, String name, Boolean enable, Long id) {
        return speakerDAO.selSpeaker(offset, pageSize, name, enable, id);
    }

    public BinaryPair<List<Speaker>, Long> selAdminSpeaker(int offset, int pageSize, String name, Long id) {
        return speakerDAO.selAdminSpeaker(offset, pageSize, name, id);
    }

    /**
     * 通过演视频id查询视频演讲者
     *
     * @param id
     * @return
     */
    public Speaker selvideoSpeaker(Long id) {
        return speakerDAO.selvideoSpeaker(id);
    }

    /**
     * 通过演讲者id查询视频演讲者
     *
     * @param id
     * @return
     */
    public Speaker selSpeakerById(Long id) {
        return speakerDAO.selSpeakerById(id);
    }
}
