package cn.kepu.self.video.daoimpl;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.SpeakerRecommendDao;
import cn.kepu.self.video.entity.SpeakerRecommend;
import cn.kepu.self.video.mybatis.mapper.SpeakerRecommendMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;

/**
 *
 * @author 李成志
 */
public class SpeakerRecommendDaoImpl implements SpeakerRecommendDao {
    
    private SpeakerRecommendMapper speakerRecommendMapper;

    public void setSpeakerRecommendMapper(SpeakerRecommendMapper speakerRecommendMapper) {
        this.speakerRecommendMapper = speakerRecommendMapper;
    }
    
    @Override
    public void insertSpeakerRecommend(SpeakerRecommend speakerRecommend) {
        speakerRecommendMapper.insertSpeakerRecommend(speakerRecommend);
    }
    
    @Override
    public void updateSpeakerRecommend(SpeakerRecommend speakerRecommend) {
        speakerRecommendMapper.updateSpeakerRecommend(speakerRecommend);
    }

    @Override
    public SpeakerRecommend findById(Long id) {
        return speakerRecommendMapper.findById(id);
    }

    @Override
    public BinaryPair<List<SpeakerRecommend>, Long> selSpeakerRecommend(Long id,  String name, int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        
        SpeakerRecommend speakerRecommend = new SpeakerRecommend();
        speakerRecommend.setReferences(id);
        speakerRecommend.setSpeakerName(name);
        
        List<SpeakerRecommend> list = speakerRecommendMapper.selectSpeakerRecommend(speakerRecommend);
        PageInfo<SpeakerRecommend> pageInfo = new PageInfo(list);
        BinaryPair<List<SpeakerRecommend>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
