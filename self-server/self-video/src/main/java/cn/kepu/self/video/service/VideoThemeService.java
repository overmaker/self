package cn.kepu.self.video.service;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoThemeDAO;
import cn.kepu.self.video.entity.VideoTheme;
import java.util.List;

/**
 *
 * @author 马亚星
 */
public enum VideoThemeService {
    INSTANCE;

    private VideoThemeService() {}

    public static VideoThemeService getInstance() {
        return INSTANCE;
    }

    private VideoThemeDAO videoThemeDAO;

    public void setVideoAlbumDAO(VideoThemeDAO videoThemeDAO) {
        this.videoThemeDAO = videoThemeDAO;
    }

    /**
     * 新增主题
     *
     * @param name 主题名称
     * @return 新增结果。0：成功，1：分类名已存在，2：主题名为NULL
     */
    public int addVideoTheme(VideoTheme videoTheme) {
        if (videoTheme == null || videoTheme.getName().trim().isEmpty()) {
            return 2;
        }
        if (videoThemeDAO.addVideoTheme(videoTheme)) {
            return 0;
        }
        return 1;
    }

    /**
     * 删除视频主题
     *
     * @param id 主键
     * @return
     */
    public boolean delVideoTheme(Long id) {
        return videoThemeDAO.delVideoTheme(id);
    }

    /**
     * 修改视频主题
     *
     * @param name 名称
     * @param id 主键
     * @return 修改结果。0：成功，1：分类名已存在，2：其他错误
     */
    public int updateVideoTheme(VideoTheme videoTheme) {
        if (videoTheme == null || videoTheme.getName().trim().isEmpty()) {
            return 2;
        }
        if (videoThemeDAO.updateVideoTheme(videoTheme)) {
            return 0;
        }
        return 1;
    }

    /**
     * 查询所有的视频主题
     *
     * @Param name 主题名称
     * @return
     */
    public BinaryPair<List<VideoTheme>, Long> searchVideoTheme(String name, int offset, int count) {
        return videoThemeDAO.selVideoTheme(name, offset, count);
    }

    public BinaryPair<List<VideoTheme>, Long> findByAll() {
        return videoThemeDAO.findByAll();
    }

    public VideoTheme findById(Long id) {
        return videoThemeDAO.findById(id);
    }

    public BinaryPair<List<VideoTheme>, Long> findByOrder() {
        return videoThemeDAO.findByOrder();
    }

}
