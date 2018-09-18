package cn.kepu.self.site.dao;

/**
 *
 * @author 劉一童
 */
public interface WeiXinDAO {

    String getToken(String appid, String secret) throws Exception;

    String getTicket(String token) throws Exception;
}
