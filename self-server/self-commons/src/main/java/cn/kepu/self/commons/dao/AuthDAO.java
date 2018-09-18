package cn.kepu.self.commons.dao;

import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.entity.UserInfo;
import cn.kepu.self.util.BinaryPair;

public interface AuthDAO {

    String getPCClientAuthURL();

    String getMobileClientAuthURL();
    
    String getSuccessCallbackURL();

    /**
     * 生成访问令牌并存储返回
     *
     * @param uid
     * @return
     */
    String generateToken(String uid);

    void clearToken(String token);

    String getToken(String code);

    String getToken(String userName, String password);

    BinaryPair<User, UserInfo> getUserInfo(String token);
    
    /**
     * 通过self平台登录
     * @param userName
     * @param password
     * @return 
     */
    boolean login(String userName, String password);
    
    void setToken(String userName, String token);
}
