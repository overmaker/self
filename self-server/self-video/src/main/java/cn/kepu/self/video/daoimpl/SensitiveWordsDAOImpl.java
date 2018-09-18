package cn.kepu.self.video.daoimpl;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.SensitiveWordsDAO;
import cn.kepu.self.video.entity.SensitiveWords;
import cn.kepu.self.video.mybatis.mapper.SensitiveWordsMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;

/**
 *
 * @author 周
 */
public class SensitiveWordsDAOImpl implements SensitiveWordsDAO {

    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private SensitiveWordsMapper sensitiveWordsMapper;

    public void setSensitiveWordsMapper(SensitiveWordsMapper sensitiveWordsMapper) {
        this.sensitiveWordsMapper = sensitiveWordsMapper;
    }

    @Override
    public int insertSensitive(SensitiveWords sensitiveWords) {
        try {
            sensitiveWordsMapper.insertSensitive(sensitiveWords);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final DataIntegrityViolationException e) {
            return 2;
        } catch (final Exception e) {
            logger.error("添加时异常", e);
            return 3;
        }
        return 0;
    }

    @Override
    public int deleteSensitive(Long id) {
        try {
            sensitiveWordsMapper.deleteSensitive(id);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            return 2;
        }
        return 0;
    }

    @Override
    public int updateSensitive(SensitiveWords sensitiveWords) {
        try {
            sensitiveWordsMapper.updateSensitive(sensitiveWords);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public BinaryPair<List<SensitiveWords>, Long> selectSensitive(String word, int offset, int pageSize) {
        SensitiveWords sensitiveWords = new SensitiveWords();
        sensitiveWords.setWord(word);
        PageHelper.offsetPage(offset, pageSize);
        List<SensitiveWords> list = sensitiveWordsMapper.selectSensitive(sensitiveWords);
        PageInfo<SensitiveWords> pageInfo = new PageInfo(list);
        BinaryPair<List<SensitiveWords>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public SensitiveWords selectSensitiveById(Long id) {
        return sensitiveWordsMapper.selectSensitiveById(id);
    }
}
