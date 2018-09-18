package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.Speaker;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public interface VideoSpeakerRelationMapper {

    List<Speaker> selectByVideoId(Long id);
}
