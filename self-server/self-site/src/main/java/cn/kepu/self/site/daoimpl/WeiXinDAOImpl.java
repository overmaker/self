package cn.kepu.self.site.daoimpl;

import cn.kepu.self.site.dao.WeiXinDAO;
import java.io.BufferedInputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;

/**
 *
 * @author 劉一童
 */
public class WeiXinDAOImpl implements WeiXinDAO {
//wx2b0f5124f9b169e7
    //85875893f269dc91a1ca3e00a46ebd48

    @Override
    public String getToken(String appid, String secret) throws Exception {
        String url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appid + "&secret=" + secret;
        HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
        connection.setDoInput(true);
        connection.setRequestMethod("GET");
        connection.setUseCaches(false);
        connection.setConnectTimeout(60000);
        connection.setReadTimeout(60000);
        connection.connect();

        final String token;
        try (InputStream input = connection.getInputStream();
                BufferedInputStream bis = new BufferedInputStream(input);
                JsonReader jsonReader = Json.createReader(bis);) {
            JsonObject json = jsonReader.readObject();
            /* 如果成功，返回 {"access_token":"8_5K6oATfg9TOf4c_f2BsbB9l2ZKtfLRzV1tQkHwz391ErTyu5u7flo1b8-eIEyJ91mISJeOxNChTTOsS6ai0ZdGwd007g9bfnDdVIMU8nh5UuKsnGKIU1I9mvoNRMxp7N5ihPzqnpTAuyn3C9RILhAGAWNQ","expires_in":7200} */
            /* 如果失败，返回 {"errcode":40125,"errmsg":"invalid appsecret, view more at http://t.cn/RAEkdVq hint: [8pMq405842974]"} */
            if (json.getInt("errcode", 0) == 0) {
                token = json.getString("access_token");
            } else {
                throw new RuntimeException(json.toString());
            }
        }
        return token;
    }

    @Override
    public String getTicket(String token) throws Exception {
        String url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + token + "&type=jsapi";
        HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
        connection.setDoInput(true);
        connection.setRequestMethod("GET");
        connection.setUseCaches(false);
        connection.setConnectTimeout(60000);
        connection.setReadTimeout(60000);
        connection.connect();
        
        final String ticket;
        try (InputStream input = connection.getInputStream();
                BufferedInputStream bis = new BufferedInputStream(input);
                JsonReader jsonReader = Json.createReader(bis);) {
            JsonObject json = jsonReader.readObject();
            /* 如果成功，返回 {"errcode":0,"errmsg":"ok","ticket":"kgt8ON7yVITDhtdwci0qeYOiGPT9R8qyrXqajhbdUh47jJEZFy44t6ujjoH1vedoo4yEG7hd47_1hDkiRI6DOw","expires_in":7200} */
            /* 如果失败，返回 {"errcode":40001,"errmsg":"invalid credential, access_token is invalid or not latest hint: [3EglpA0275vr29!]"} */
            if (json.getInt("errcode", 0) == 0) {
                ticket = json.getString("ticket");
            } else {
                throw new RuntimeException(json.toString());
            }
        }
        return ticket;
    }

}
