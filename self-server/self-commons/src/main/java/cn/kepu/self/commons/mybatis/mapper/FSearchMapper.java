package cn.kepu.self.commons.mybatis.mapper;

import cn.kepu.self.commons.entity.FSearch;
import java.util.List;

/**
 * 检索
 *
 * @author 
 */
public interface FSearchMapper {

    List<FSearch> selectFsearch(FSearch fSearch);

}

