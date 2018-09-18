package cn.kepu.self.video.service;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoTypeDAO;
import cn.kepu.self.video.entity.VideoType;
import java.util.List;

/**
 *
 * @author 劉一童
 */
public enum VideoTypeService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private VideoTypeService() {}

    public static VideoTypeService getInstance() {
        return INSTANCE;
    }

    private VideoTypeDAO videoTypeDAO;

    public void setVideoTypeDAO(VideoTypeDAO videoTypeDAO) {
        this.videoTypeDAO = videoTypeDAO;
    }

    /**
     * 新增视频分类
     *
     * @param name 视频分类名称
     * @return 新增结果。0：成功，1：分类名已存在，2：分类名为NULL
     */
    public int addVideoType(String name) {
        if (name == null || name.trim().isEmpty()) {
            return 2;
        }
        if (videoTypeDAO.addVideoType(name)) {
            return 0;
        }
        return 1;
    }

    /**
     * 删除视频分类
     *
     * @param id 主键
     * @return
     */
    public boolean delVideoType(Long id) {
        return videoTypeDAO.delVideoType(id);
    }

    /**
     * 修改视频分类
     *
     * @param name 分类名称
     * @param id 主键
     * @return 删除结果。0：成功，1：失败，2：分类名为NULL
     */
    public int updateVideoType(String name, Long id) {
        if (name == null || name.trim().isEmpty()) {
            return 2;
        }
        if (videoTypeDAO.updateVideoType(name, id)) {
            return 0;
        }
        return 1;
    }

    /**
     * 查询视频分类
     *
     * @return
     */
    public BinaryPair<List<VideoType>, Long> selVideoType(String name, int offset, int pageSize) {
        return videoTypeDAO.selVideoType(name, offset, pageSize);
    }
}
