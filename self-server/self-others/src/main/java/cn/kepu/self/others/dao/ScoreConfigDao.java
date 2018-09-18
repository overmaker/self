package cn.kepu.self.others.dao;

import cn.kepu.self.others.entity.ScoreConfig;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ScoreConfigDao {
    
    void updateScoreConfig(ScoreConfig scoreConfig);
    
    List<ScoreConfig> selectScoreConfig();
}
