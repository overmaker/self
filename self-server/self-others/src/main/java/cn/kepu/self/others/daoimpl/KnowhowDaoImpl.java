package cn.kepu.self.others.daoimpl;

import cn.kepu.self.others.dao.KnowhowDao;
import cn.kepu.self.others.entity.Knowhow;
import cn.kepu.self.others.mybatis.mapper.KnowhowMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;

/**
 *
 * @author 李成志
 */
public class KnowhowDaoImpl implements KnowhowDao {
    
    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private KnowhowMapper knowhowMapper;

    public void setKnowhowMapper(KnowhowMapper knowhowMapper) {
        this.knowhowMapper = knowhowMapper;
    }

    @Override
    public int insertKnowhow(String type, String introduction) {
        Knowhow knowhow = new Knowhow();
        knowhow.setType(type);
        knowhow.setIntroduction(introduction);
        
        try {
            knowhowMapper.insertKnowhow(knowhow);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final DataIntegrityViolationException e) {
            return 2;
        } catch (final Exception e) {
            logger.error("添加关于时异常", e);
            return 3;
        }
        return 0;
    }

    @Override
    public int updateKnowhow(String type, String introduction, Long id) {
        Knowhow knowhow = new Knowhow();
        knowhow.setType(type);
        knowhow.setIntroduction(introduction);
        knowhow.setId(id);
        
        try {
            knowhowMapper.updateKnowhow(knowhow);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public void deleteKnowhow(Long id) {
        knowhowMapper.deleteKnowhow(id);
    }

    @Override
    public Knowhow selectById(Long id) {
        return knowhowMapper.selectById(id);
    }

    @Override
    public BinaryPair<List<Knowhow>, Long> selectAll(int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<Knowhow> list = knowhowMapper.selectAll();
        PageInfo<Knowhow> pageInfo = new PageInfo(list);
        BinaryPair<List<Knowhow>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
    
}
