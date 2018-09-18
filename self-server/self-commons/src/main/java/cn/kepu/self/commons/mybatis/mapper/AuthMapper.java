package cn.kepu.self.commons.mybatis.mapper;

import cn.kepu.self.commons.entity.User;
import org.apache.ibatis.annotations.Param;

public interface AuthMapper {
    
    void updateUserToken(User user);
    
    void clearToken(String token);
    
    boolean login(@Param("username") String userName, @Param("password") String password);
    
    void setToken(@Param("username") String userName, @Param("token") String token);
}
