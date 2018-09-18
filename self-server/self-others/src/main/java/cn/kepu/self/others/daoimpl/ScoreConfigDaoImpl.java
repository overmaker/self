package cn.kepu.self.others.daoimpl;

import cn.kepu.self.others.dao.ScoreConfigDao;
import cn.kepu.self.others.entity.ScoreConfig;
import cn.kepu.self.others.mybatis.mapper.ScoreConfigMapper;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 *
 * @author 李成志
 */
public class ScoreConfigDaoImpl implements ScoreConfigDao {
    
    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private ScoreConfigMapper scoreConfigMapper;
    
    public void setScoreConfigMapper(ScoreConfigMapper scoreConfigMapper) {
        this.scoreConfigMapper = scoreConfigMapper;
    }

    @Override
    public void updateScoreConfig(ScoreConfig scoreConfig) {
        scoreConfigMapper.updateScoreConfig(scoreConfig);
    }

    @Override
    public List<ScoreConfig> selectScoreConfig() {
        List<ScoreConfig> list = scoreConfigMapper.selectScoreConfig();
        return list;
    }
    
}
