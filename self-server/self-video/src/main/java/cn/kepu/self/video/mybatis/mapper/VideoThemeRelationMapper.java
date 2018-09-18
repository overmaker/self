package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.VideoTheme;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public interface VideoThemeRelationMapper {

    List<VideoTheme> selectByVideoId(Long id);
}
