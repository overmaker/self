package cn.kepu.self.others.mybatis.mapper;

import cn.kepu.self.others.entity.About;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface AboutMapper {

    void insertAbout(About about);

    void updateAbout(About about);

    void deleteAbout(Long id);

    About selectById(Long id);

    About selectByType();

    List<About> selectAll();
}
