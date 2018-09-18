package cn.kepu.self.commons.daoimpl;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.commons.dao.FSearchDAO;
import cn.kepu.self.commons.entity.FSearch;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;

import cn.kepu.self.commons.mybatis.mapper.FSearchMapper;

/**
 * 嘉宾管理
 *
 * @author
 */
public class FSearchDAOImpl implements FSearchDAO {

    private final FSearchMapper fSearchMapper;

    public FSearchDAOImpl(FSearchMapper fSearchMapper) {
        this.fSearchMapper = fSearchMapper;
    }

    @Override
    public BinaryPair<List<FSearch>, Long> selectFsearch(int offset, int pageSize, String searchContent, int type) {
        FSearch fSearch = new FSearch();
        fSearch.setSearchContent(searchContent);
        fSearch.setType(type);

        PageHelper.offsetPage(offset, pageSize);
        List<FSearch> list = fSearchMapper.selectFsearch(fSearch);
        PageInfo<FSearch> pageInfo = new PageInfo(list);
        BinaryPair<List<FSearch>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
