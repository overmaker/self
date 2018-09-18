package cn.kepu.self.video.dao;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.entity.VideoTheme;
import java.util.List;

/**
 * 视频主题
 *
 * @author 马亚星
 */
public interface VideoThemeDAO {

    /**
     * 新增视频主题
     *
     * @param name 专辑名称
     * @return 新增结果。0：成功，1：分类名已存在，2：其他错误
     */
    boolean addVideoTheme(VideoTheme videoTheme);

    /**
     * 删除视频主题
     *
     * @param id 主键
     * @return
     */
    boolean delVideoTheme(Long id);

    /**
     * 修改视频主题名称
     *
     * @param name 专辑名称
     * @param id 主键
     * @#return
     */
    boolean updateVideoTheme(VideoTheme videoTheme);

    /**
     * 查询视频所有视频主题
     *
     * @return
     */
    BinaryPair<List<VideoTheme>, Long> selVideoTheme(String name, int offset, int count);

    BinaryPair<List<VideoTheme>, Long> findByAll();

    VideoTheme findById(Long id);

    BinaryPair<List<VideoTheme>, Long> findByOrder();
}
