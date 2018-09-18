package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.Speaker;
import java.util.List;

/**
 * 演讲者管理
 *
 * @author 马亚星
 */
public interface SpeakerMapper {

    /**
     * 新增演讲者
     *
     * @param speaker
     */
    void insertOrUpdateSpeaker(Speaker speaker);

    void insertOrUpdateAdminSpeaker(Speaker speaker);

    /**
     * 新增演讲者
     *
     * @param sperker
     * @return 新增结果。 0:成功，1：重复值，2：其他错误
     */
    int updateSpearker(Speaker sperker);

    int updateAdminSpearker(Speaker sperker);

    /**
     * 查询演讲者
     *
     * @param sperker
     * @return
     */
    List<Speaker> selectSpeaker(Speaker sperker);

    List<Speaker> selectAdminSpeaker(Speaker sperker);

    /**
     * 通过视频id查询视频演讲者
     *
     * @param id
     * @return
     */
    Speaker videoSpeaker(Long id);

    /**
     * 通过演讲者id查询视频演讲者
     *
     * @param id
     * @return
     */
    Speaker selSpeakerById(Long id);

}
