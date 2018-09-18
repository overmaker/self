package cn.kepu.self.commons.daoimpl;

import cn.kepu.self.commons.dao.AuthDAO;
import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.entity.UserInfo;
import cn.kepu.self.commons.mybatis.mapper.AuthMapper;
import cn.kepu.self.commons.util.Util;
import cn.kepu.self.util.BinaryPair;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.StringRequestEntity;

public class AuthDAOImpl implements AuthDAO {

    private final AuthMapper authMapper;

    private final String appkey;
    private final String appsecret;
    private final String redirectURL;
    private final String tokenURL;
    private final String userInfoURL;

    private final String pcClientAuthURL;

    private final String mobileClientAuthURL;

    private final String successCallbackURL;

    public AuthDAOImpl(AuthMapper authMapper,
            String appkey,
            String appsecret,
            String redirectURL,
            String tokenURL,
            String userInfoURL,
            String successCallbackURL) {
        this.authMapper = authMapper;
        this.appkey = appkey;
        this.appsecret = appsecret;
        this.redirectURL = redirectURL;
        this.tokenURL = tokenURL;
        this.userInfoURL = userInfoURL;
        this.successCallbackURL = successCallbackURL;

        this.pcClientAuthURL = new StringBuilder("http://auth.kepu.cn/oauth2/authorize.html?client_id=")
                .append(appkey)
                .append("&redirect_uri=")
                .append(redirectURL)
                .append("&response_type=code&state=self&display=main")
                .toString();

        this.mobileClientAuthURL = new StringBuilder("http://auth.kepu.cn/oauth2/authorize.html?client_id=")
                .append(appkey)
                .append("&redirect_uri=")
                .append(redirectURL)
                .append("&response_type=code&state=self&display=mini")
                .toString();
    }

    @Override
    public String getPCClientAuthURL() {
        return pcClientAuthURL;
    }

    @Override
    public String getMobileClientAuthURL() {
        return mobileClientAuthURL;
    }

    @Override
    public String getSuccessCallbackURL() {
        return successCallbackURL;
    }

    @Override
    public String generateToken(String uid) {
        String token = Util.generateToken(); // 生成访问令牌

        User user = new User();
        user.setUid(uid);
        user.setToken(token);

        authMapper.updateUserToken(user);
        return token;
    }

    @Override
    public void clearToken(String token) {
        if (token != null) {
            authMapper.clearToken(token);
        }
    }

    @Override
    public String getToken(String code) {
        final String accessToken;
        try {
            HttpClient client = new HttpClient();
            PostMethod method = new PostMethod(tokenURL);
            StringBuilder body = new StringBuilder();
            body.append("client_id=").append(appkey)
                    .append("&client_secret=").append(appsecret)
                    .append("&grant_type=authorization_code").
                    append("&code=").append(code).
                    append("&redirect_uri=").append(URLEncoder.encode(redirectURL, "utf-8"));
            RequestEntity requestEntity = new StringRequestEntity(body.toString(), "application/x-www-form-urlencoded", "utf-8");
            method.setRequestEntity(requestEntity);
            int responseCode = client.executeMethod(method);

            try (InputStream is = method.getResponseBodyAsStream();
                    InputStreamReader isr = new InputStreamReader(is, "utf-8");
                    BufferedReader br = new BufferedReader(isr);
                    JsonReader jsonReader = Json.createReader(br)) {
                JsonObject json = jsonReader.readObject();
                if (responseCode != 200) {
                    throw new Exception(json.toString());
                }
                accessToken = json.getString("access_token");
            }
        } catch (final Exception e) {
            throw new RuntimeException(e);
        }
        return accessToken;
    }

    @Override
    public String getToken(String userName, String password) {
        final String accessToken;
        try {
            HttpClient client = new HttpClient();
            PostMethod method = new PostMethod(tokenURL);
            StringBuilder body = new StringBuilder();
            body.append("client_id=").append(appkey)
                    .append("&client_secret=").append(appsecret)
                    .append("&grant_type=password").
                    append("&username=").append(userName).
                    append("&password=").append(password);
            RequestEntity requestEntity = new StringRequestEntity(body.toString(), "application/x-www-form-urlencoded", "utf-8");
            method.setRequestEntity(requestEntity);
            int responseCode = client.executeMethod(method);

            try (InputStream is = method.getResponseBodyAsStream();
                    InputStreamReader isr = new InputStreamReader(is, "utf-8");
                    BufferedReader br = new BufferedReader(isr);
                    JsonReader jsonReader = Json.createReader(br)) {
                JsonObject json = jsonReader.readObject();
                if (responseCode == 200) {
                    accessToken = json.getString("access_token");
                } else if (responseCode >= 400 && responseCode <= 499) {
                    throw new IllegalArgumentException(json.toString());
                } else {
                    throw new RuntimeException(json.toString());
                }

            }
        } catch (final Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw (IllegalArgumentException) e;
            }
            throw new RuntimeException(e);

        }
        return accessToken;
    }

    @Override
    public BinaryPair<User, UserInfo> getUserInfo(String token) {
        final JsonObject json;
        try {
            HttpClient client = new HttpClient();
            PostMethod method = new PostMethod(userInfoURL);
            method.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            method.setRequestHeader("Authorization", "Bearer " + token);
            int responseCode = client.executeMethod(method);
            try (InputStream is = method.getResponseBodyAsStream();
                    InputStreamReader isr = new InputStreamReader(is, "utf-8");
                    BufferedReader br = new BufferedReader(isr);
                    JsonReader jsonReader = Json.createReader(br)) {
                json = jsonReader.readObject();
            }
            if (responseCode != 200) {
                throw new Exception(json.toString());
            }
            User user = new User();
            user.setUserName(json.getString("name"));
            user.setUid(Integer.toString(json.getInt("uid")));
            UserInfo userInfo = new UserInfo();
            userInfo.setGender(json.getInt("gender", 0) == 1);
            userInfo.setPhoto(json.getString("avatar", null));
            userInfo.setNickName(json.getString("screenname", null));
            userInfo.setMobile(json.getString("mobile", null));
            String email = json.getString("contactemail", null);
            if (email == null) {
                email = json.getString("email", null);
            }
            userInfo.setEmail(email);
            userInfo.setQq(json.getString("qq", null));
            BinaryPair<User, UserInfo> pair = new BinaryPair();
            pair.setV1(user);
            pair.setV2(userInfo);
            return pair;
        } catch (final Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean login(String userName, String password) {
        return authMapper.login(userName, password);
    }
    
    @Override
    public void setToken(String userName, String token) {
        authMapper.setToken(userName, token);
    }

}
