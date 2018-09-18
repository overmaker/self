package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.SpeakerRecommend;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface SpeakerRecommendMapper {
    
    void insertSpeakerRecommend(SpeakerRecommend speakerRecommend);
    
    void updateSpeakerRecommend(SpeakerRecommend speakerRecommend);
    
    SpeakerRecommend findById(Long id);
    
    List<SpeakerRecommend> selectSpeakerRecommend(SpeakerRecommend speakerRecommend);
}
