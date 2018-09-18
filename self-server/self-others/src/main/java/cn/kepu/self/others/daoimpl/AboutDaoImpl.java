package cn.kepu.self.others.daoimpl;

import cn.kepu.self.others.dao.AboutDao;
import cn.kepu.self.others.entity.About;
import cn.kepu.self.others.mybatis.mapper.AboutMapper;
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
public class AboutDaoImpl implements AboutDao {

    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private AboutMapper aboutMapper;

    public void setAboutMapper(AboutMapper aboutMapper) {
        this.aboutMapper = aboutMapper;
    }

    @Override
    public int insertAbout(String type, String introduction) {
        About about = new About();
        about.setType(type);
        about.setIntroduction(introduction);

        try {
            aboutMapper.insertAbout(about);
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
    public int updateAbout(String type, String introduction, Long id) {
        About about = new About();
        about.setType(type);
        about.setIntroduction(introduction);
        about.setId(id);

        try {
            aboutMapper.updateAbout(about);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public void deleteAbout(Long id) {
        aboutMapper.deleteAbout(id);
    }

    @Override
    public About selectById(Long id) {
        return aboutMapper.selectById(id);
    }

    @Override
    public About selectByType() {
        return aboutMapper.selectByType();
    }

    @Override
    public BinaryPair<List<About>, Long> selectAll(int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<About> list = aboutMapper.selectAll();
        PageInfo<About> pageInfo = new PageInfo(list);
        BinaryPair<List<About>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
}
