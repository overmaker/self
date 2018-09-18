package cn.kepu.self.others.mybatis.mapper;

import cn.kepu.self.others.entity.ScoreConfig;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface ScoreConfigMapper {
    
    void updateScoreConfig(ScoreConfig scoreConfig);
    
    List<ScoreConfig> selectScoreConfig();
}
