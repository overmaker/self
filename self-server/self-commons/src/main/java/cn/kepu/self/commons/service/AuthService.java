package cn.kepu.self.commons.service;

import cn.kepu.self.commons.dao.AuthDAO;
import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.entity.UserInfo;
import cn.kepu.self.commons.util.Util;
import cn.kepu.self.util.BinaryPair;

/**
 *
 * @author 劉一童
 */
public enum AuthService {
    INSTANCE;

    private AuthService() {}

    public static AuthService getInstance() {
        return INSTANCE;
    }

    private AuthDAO authDAO;

    public void setAuthDAO(AuthDAO authDAO) {
        this.authDAO = authDAO;
    }

    public String getPCClientAuthURL() {
        return authDAO.getPCClientAuthURL();
    }

    public String getMobileClientAuthURL() {
        return authDAO.getMobileClientAuthURL();
    }

    public String getSuccessCallbackURL() {
        return authDAO.getSuccessCallbackURL();
    }

    public String generateToken(String uid) {
        return authDAO.generateToken(uid);
    }

    public String getToken(String code) {
        return authDAO.getToken(code);
    }

    public String getToken(String userName, String password) {
        return authDAO.getToken(userName, password);
    }

    public BinaryPair<User, UserInfo> getUserInfo(String token) {
        return authDAO.getUserInfo(token);
    }
    
    /**
     * 通过self平台登录
     * @param userName 用户名
     * @param password 密码
     * @return 登录成功返回令牌字符串，登录失败返回null
     */
    public String login(String userName, String password) {
        boolean success = authDAO.login(userName, password);
        String token = null;
        if (success) {
            token = Util.generateToken(); // 生成访问令牌
            authDAO.setToken(userName, token);
        }
        return token;
    }

    public void logout(String token) {
        authDAO.clearToken(token);
    }
}
