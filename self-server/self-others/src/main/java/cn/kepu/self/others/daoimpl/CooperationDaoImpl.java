package cn.kepu.self.others.daoimpl;

import cn.kepu.self.others.dao.CooperationDao;
import cn.kepu.self.others.entity.Cooperation;
import cn.kepu.self.others.mybatis.mapper.CooperationMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;

/**
 *
 * @author 李成志
 */
public class CooperationDaoImpl implements CooperationDao {

    private CooperationMapper cooperationMapper;

    public void setCooperationMapper(CooperationMapper cooperationMapper) {
        this.cooperationMapper = cooperationMapper;
    }

    @Override
    public void insertCooperation(Cooperation cooperation) {
        cooperationMapper.insertCooperation(cooperation);
    }

    @Override
    public void updateCooperation(Cooperation cooperation) {
        cooperationMapper.updateCooperation(cooperation);
    }

    @Override
    public void deleteCooperation(Long id) {
        cooperationMapper.deleteCooperation(id);
    }

    @Override
    public Cooperation selectById(Long id) {
        return cooperationMapper.selectById(id);
    }

    @Override
    public BinaryPair<List<Cooperation>, Long> selectAll(String title, int offset, int pageSize) {
        Cooperation cooperation = new Cooperation();
        cooperation.setTitle(title);

        PageHelper.offsetPage(offset, pageSize);
        List<Cooperation> list = cooperationMapper.selectAll(cooperation);
        PageInfo<Cooperation> pageInfo = new PageInfo(list);
        BinaryPair<List<Cooperation>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
