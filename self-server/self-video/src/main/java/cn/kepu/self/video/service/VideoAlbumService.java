package cn.kepu.self.video.service;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoAlbumDAO;
import cn.kepu.self.video.entity.VideoAlbum;
import java.util.List;

/**
 *
 * @author 马亚星
 */
public enum VideoAlbumService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private VideoAlbumService() {
    }

    public static VideoAlbumService getInstance() {
        return INSTANCE;
    }

    private VideoAlbumDAO videoAlbumDAO;

    public void setVideoAlbumDAO(VideoAlbumDAO videoAlbumDAO) {
        this.videoAlbumDAO = videoAlbumDAO;
    }

    /**
     * 新增专辑
     *
     * @param name 专辑名称
     * @return 新增结果。0：成功，1：分类名已存在，2：专辑名为NULL
     */
    public int addVideoAlbum(String name) {
        if (name == null || name.isEmpty()) {
            return 2;
        }
        if (videoAlbumDAO.addVideoAlbum(name)) {
            return 0;
        }
        return 1;
    }

    /**
     * 删除视频专辑
     *
     * @param id 主键
     * @return
     */
    public boolean delVideoAlbum(Long id) {
        return videoAlbumDAO.delVideoAlbum(id);
    }

    /**
     * 修改视频专辑
     *
     * @param name 名称
     * @param id 主键
     * @return 修改结果。0：成功，1：分类名已存在，2：专辑名为NULL
     */
    public int updateVideoAlbum(String name, Long id) {
        if (name == null || name.isEmpty()) {
            return 2;
        }
        if (videoAlbumDAO.updateVideoAlbum(name, id)) {
            return 0;
        }
        return 1;
    }

    /**
     * 查询所有的视频专辑
     *
     * @param videoAlbum
     * @param offset
     * @param pageSize
     * @return
     */
    public BinaryPair<List<VideoAlbum>, Long> selVideoAlbum(VideoAlbum videoAlbum, int offset, int pageSize) {
        return videoAlbumDAO.selVideoAlbum(videoAlbum, offset, pageSize);
    }
}
