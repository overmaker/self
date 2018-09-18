package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.VideoTheme;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 马亚星
 */
public interface VideoThemeMapper {

    void insertVideoTheme(VideoTheme videoTheme);

    void deleteVideoTheme(@Param("id") Long id);

    void updateVideoTheme(VideoTheme videoTheme);

    /**
     * 查询视频所有视频主题
     *
     * @Param name 主题名称
     * @return
     */
    List<VideoTheme> searchVideoTheme(VideoTheme videoTheme);

    List<VideoTheme> findByAll();

    VideoTheme findById(Long id);

    List<VideoTheme> findByOrder();
}
