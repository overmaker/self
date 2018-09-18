package cn.kepu.self.commons.dao;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.commons.entity.FSearch;
import java.util.List;

/**
 * 检索
 *
 * @author 
 */
public interface FSearchDAO {

    BinaryPair<List<FSearch>, Long> selectFsearch(int offset,int pageSize,String searchContent, int type);

}
