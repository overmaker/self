package cn.kepu.self.video.dao;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.entity.VideoAlbum;
import java.util.List;

/**
 * 视频专辑
 *
 * @author 马亚星
 */
public interface VideoAlbumDAO {

    /**
     * 新增视频专辑
     *
     * @param name 专辑名称
     * @return 新增结果。true：成功，false：专辑名已存在
     */
    boolean addVideoAlbum(String name);

    /**
     * 删除视频专辑
     *
     * @param id 主键
     * @return 删除结果。0:成功，1:失败,2：其他错误
     */
    boolean delVideoAlbum(Long id);

    /**
     * 修改视频专辑名称
     *
     * @param name 专辑名称
     * @param id 主键
     * @#return 修改结果。0:成功，1:失败,2：其他错误
     */
    boolean updateVideoAlbum(String name, Long id);

    /**
     * 查询所有的视频专辑
     *
     * @Param videoAlbum 专辑表 
     * @return
     */
    BinaryPair<List<VideoAlbum>, Long> selVideoAlbum(VideoAlbum videoAlbum, int offset, int pageSize);

}
