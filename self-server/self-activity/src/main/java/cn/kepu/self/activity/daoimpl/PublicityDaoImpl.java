package cn.kepu.self.activity.daoimpl;

import cn.kepu.self.activity.dao.PublicityDao;
import cn.kepu.self.activity.entity.Publicity;
import cn.kepu.self.activity.mybatis.mapper.PublicityMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 *
 * @author 李成志
 */
public class PublicityDaoImpl implements PublicityDao {
    
    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private PublicityMapper publicityMapper;
    
    public void setPublicityMapper(PublicityMapper publicityMapper) {
        this.publicityMapper = publicityMapper;
    }

    @Override
    public void insertPublicity(Publicity publicity) {
        publicityMapper.insertPublicity(publicity);
    }

    @Override
    public void updatePublicity(Publicity publicity) {
        publicityMapper.updatePublicity(publicity);
    }

    @Override
    public void deletePublicity(Long id) {
        publicityMapper.deletePublicity(id);
    }

    @Override
    public Publicity findById(Long id) {
        return publicityMapper.findById(id);
    }

    @Override
    public BinaryPair<List<Publicity>, Long> selectPublicity(String aname, String cname, int offset, int pageSize) {
        Publicity publicity = new Publicity();
        publicity.setActivity_name(aname);
        publicity.setCooperation_name(cname);
        
        PageHelper.offsetPage(offset, pageSize);
        List<Publicity> list = publicityMapper.selectPublicity(publicity);
        PageInfo<Publicity> pageInfo = new PageInfo(list);
        BinaryPair<List<Publicity>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
    
}
