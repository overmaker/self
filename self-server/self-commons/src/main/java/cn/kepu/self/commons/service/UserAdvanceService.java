package cn.kepu.self.commons.service;

import cn.kepu.self.commons.dao.UserAdvanceDAO;
import cn.kepu.self.commons.entity.UserAdvance;
import cn.kepu.self.commons.util.SendMail;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

/**
 * 用户证书
 *
 * @author 马亚星
 */
public enum UserAdvanceService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private UserAdvanceService() {
    }

    public static UserAdvanceService getInstance() {
        return INSTANCE;
    }

    private UserAdvanceDAO userAdvanceDAO;

    public void setUserAdvanceDAO(UserAdvanceDAO userAdvanceDAO) {
        this.userAdvanceDAO = userAdvanceDAO;
    }

    public void addOrUpdateUserAdvance(UserAdvance userAdvance) {
        userAdvanceDAO.addOrUpdateUserAdvance(userAdvance);
        String name = userAdvance.getName();
        String identification_pic = userAdvance.getIdentificationPic();
        String introduction = userAdvance.getIntroduction();
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
        html += " <div class='face'> <img src=" + identification_pic + "> ";
        html += " <div class='details'>";
        html += " <h2>" + name + "</h2>";
        html += "<h3>" + introduction + "</h3> </div><a href=\"www.baidu.com\">www.baidu.com</a>";
        html += " </div>";
        html += "   <div class='content'>";
        html += "<p><b>" + "全文：" + "</b> ";
        html += "   </br>" + "我申请成为志愿者，请后台管理员审核" + "</p><br />";
        html += "</div></div></div></div></label></body></html>";
        SendMail mail = new SendMail("smtp.qq.com", "", "");
        try {
            mail.send("你好，我是test1", html, new InternetAddress("hanyafeng158@qq.com"));
        } catch (AddressException ex) {
            Logger.getLogger(UserAdvanceService.class.getName()).log(Level.SEVERE, null, ex);
        } catch (Exception ex) {
            Logger.getLogger(UserAdvanceService.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * 删除用户证书
     *
     * @param uid
     * @return
     */
    public int delUserAdvance(Long uid) {
        return userAdvanceDAO.delUserAdvance(uid);
    }

    /**
     * 查询证书
     *
     * @param uid
     * @return
     */
    public UserAdvance selectUserAdvance(Long uid) {
        return userAdvanceDAO.selUserAdvance(uid);
    }
}
