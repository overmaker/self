package cn.kepu.self.video.dao;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.entity.Speaker;
import java.util.List;

/**
 * 演讲者管理
 *
 * @author 马亚星
 */
public interface SpeakerDAO {

    /**
     * 新增演讲者
     *
     * @param speaker
     */
    void addOrUpdateSpeaker(Speaker speaker);

    void addOrUpdateAdminSpeaker(Speaker speaker);

    /**
     * gengxin 演讲者
     *
     * @param speaker
     */
    void upSpearker(Speaker speaker);

    void upAdminSpearker(Speaker speaker);

    /**
     * 查询演讲者
     *
     * @param offset
     * @param pageSize
     * @param name
     * @param field
     * @param enable
     * @return
     */
    BinaryPair<List<Speaker>, Long> selSpeaker(int offset, int pageSize, String name, Boolean enable, Long id);

    BinaryPair<List<Speaker>, Long> selAdminSpeaker(int offset, int pageSize, String name, Long id);

    Speaker selvideoSpeaker(Long id);

    Speaker selSpeakerById(Long id);

}
