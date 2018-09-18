package cn.kepu.self.commons.mybatis.mapper;

import cn.kepu.self.commons.entity.User;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 李成志
 */
public interface AdminMapper {

    void insertAdmin(User admin);

    void updateAdmin(User admin);

    User selectById(@Param("id") Long id);

    List<User> selectAll(User user);
}
