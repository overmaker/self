package cn.kepu.self.video.dao;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.entity.SpeakerRecommend;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface SpeakerRecommendDao {
    
    void insertSpeakerRecommend(SpeakerRecommend speakerRecommend);
    
    void updateSpeakerRecommend(SpeakerRecommend speakerRecommend);
    
    SpeakerRecommend findById(Long id);
    
    BinaryPair<List<SpeakerRecommend>, Long> selSpeakerRecommend(Long id, String name, int offset, int pageSize);
}
