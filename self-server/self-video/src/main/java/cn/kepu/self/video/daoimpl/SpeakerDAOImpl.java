package cn.kepu.self.video.daoimpl;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.SpeakerDAO;
import cn.kepu.self.video.entity.Speaker;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.springframework.dao.DuplicateKeyException;
import cn.kepu.self.video.mybatis.mapper.SpeakerMapper;

/**
 * 演讲者管理
 *
 * @author 马亚星
 */
public class SpeakerDAOImpl implements SpeakerDAO {

    private SpeakerMapper speakerMapper;

    public void setSpeakerMapper(SpeakerMapper speakerMapper) {
        this.speakerMapper = speakerMapper;
    }

    @Override
    public void addOrUpdateSpeaker(Speaker speaker) {
        try {
            speakerMapper.insertOrUpdateSpeaker(speaker);
        } catch (final DuplicateKeyException e) {
        }
    }

    @Override
    public void addOrUpdateAdminSpeaker(Speaker speaker) {
        try {
            speakerMapper.insertOrUpdateAdminSpeaker(speaker);
        } catch (final DuplicateKeyException e) {
        }
    }

    @Override
    public void upSpearker(Speaker speaker) {
        try {
            speakerMapper.updateSpearker(speaker);
        } catch (final DuplicateKeyException e) {
        }
    }

    @Override
    public void upAdminSpearker(Speaker speaker) {
        try {
            speakerMapper.updateAdminSpearker(speaker);
        } catch (final DuplicateKeyException e) {
        }
    }

    @Override
    public BinaryPair<List<Speaker>, Long> selSpeaker(int offset, int pageSize, String name, Boolean enable, Long id) {
        Speaker speaker = new Speaker();
        speaker.setName(name);
        speaker.setEnable(enable);
        speaker.setId(id);

        PageHelper.offsetPage(offset, pageSize);
        List<Speaker> list = speakerMapper.selectSpeaker(speaker);
        PageInfo<Speaker> pageInfo = new PageInfo(list);
        BinaryPair<List<Speaker>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<Speaker>, Long> selAdminSpeaker(int offset, int pageSize, String name, Long id) {
        Speaker speaker = new Speaker();
        speaker.setName(name);
        speaker.setId(id);

        PageHelper.offsetPage(offset, pageSize);
        List<Speaker> list = speakerMapper.selectAdminSpeaker(speaker);
        PageInfo<Speaker> pageInfo = new PageInfo(list);
        BinaryPair<List<Speaker>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public Speaker selvideoSpeaker(Long id) {
        Speaker speaker = speakerMapper.videoSpeaker(id);
        if (speaker == null) {
            return null;
        }
        return speaker;
    }

    @Override
    public Speaker selSpeakerById(Long id) {
        Speaker speaker = speakerMapper.selSpeakerById(id);
        if (speaker == null) {
            return null;
        }
        return speaker;
    }
}
