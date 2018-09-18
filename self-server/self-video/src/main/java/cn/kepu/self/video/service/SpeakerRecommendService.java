package cn.kepu.self.video.service;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.SpeakerRecommendDao;
import cn.kepu.self.video.entity.SpeakerRecommend;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum SpeakerRecommendService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private SpeakerRecommendService() {
    }

    public static SpeakerRecommendService getInstance() {
        return INSTANCE;
    }

    private SpeakerRecommendDao speakerRecommendDao;

    public void setSpeakerRecommendDao(SpeakerRecommendDao speakerRecommendDao) {
        this.speakerRecommendDao = speakerRecommendDao;
    }
    
    public void insertSpeakerRecommend(SpeakerRecommend speakerRecommend) {
        speakerRecommendDao.insertSpeakerRecommend(speakerRecommend);
    }
    
    public void updateSpeakerRecommend(SpeakerRecommend speakerRecommend) {
        speakerRecommendDao.updateSpeakerRecommend(speakerRecommend);
    }
    
    public SpeakerRecommend findById(Long id) {
        return speakerRecommendDao.findById(id);
    }
    
    public BinaryPair<List<SpeakerRecommend>, Long> selectByUser(Long id, String name, int offset, int pageSize) {
        return speakerRecommendDao.selSpeakerRecommend(id, name, offset, pageSize);
    }
}
