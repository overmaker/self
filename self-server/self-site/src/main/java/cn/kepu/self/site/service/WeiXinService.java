package cn.kepu.self.site.service;

import cn.kepu.self.site.dao.WeiXinDAO;
import java.math.BigDecimal;
import java.security.MessageDigest;
import java.util.Formatter;
import java.util.UUID;
import javax.json.Json;
import javax.json.JsonObjectBuilder;

/**
 *
 * @author 劉一童
 */
public enum WeiXinService {
    INSTANCE;

    private WeiXinService() {}

    public static WeiXinService getInstance() {
        return INSTANCE;
    }

    private WeiXinDAO weiXinDAO;

    private String appid;
    private String secret;
    private String siteURL;

    public void setWeiXinDAO(WeiXinDAO weiXinDAO) {
        this.weiXinDAO = weiXinDAO;
    }

    public void setAppid(String appid) {
        this.appid = appid;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public void setSiteURL(String siteURL) {
        this.siteURL = siteURL;
    }
    
    public synchronized String getConfig() {
        JsonObjectBuilder obj = Json.createObjectBuilder();
        obj.add("app-id", appid);
        obj.add("nonce", System.getProperty("nonceStr", ""));
        obj.add("time-stamp", System.getProperty("timestamp", ""));
        obj.add("signature", System.getProperty("signature", ""));
        return obj.build().toString();
    }

    public synchronized void putConfig() {
        try {
            String token = weiXinDAO.getToken(appid, secret);
            if (token == null) {
                return;
            }
            String ticket = weiXinDAO.getTicket(token);
            if (ticket == null) {
                return;
            }
            String nonceStr = create_nonce_str();
            String timestamp = create_timestamp();
            String tmp = "jsapi_ticket=" + ticket
                    + "&noncestr=" + nonceStr
                    + "&timestamp=" + timestamp
                    + "&url=" + siteURL;
            
            MessageDigest crypt = MessageDigest.getInstance("SHA-1");
            crypt.reset();
            crypt.update(tmp.getBytes("UTF-8"));
            String signature = byteToHex(crypt.digest());
            
            System.setProperty("nonceStr", nonceStr);
            System.setProperty("timestamp", timestamp);
            System.setProperty("signature", signature);
        } catch (final Exception err) {

        }
    }

    private static String byteToHex(final byte[] hash) {
        try (Formatter formatter = new Formatter();) {
            for (byte b : hash) {
                formatter.format("%02x", b);
            }
            return formatter.toString();
        }
    }

    private static String create_nonce_str() {
        return UUID.randomUUID().toString();
    }

    private static String create_timestamp() {
        return Long.toString(System.currentTimeMillis() / 1000);
    }

}
