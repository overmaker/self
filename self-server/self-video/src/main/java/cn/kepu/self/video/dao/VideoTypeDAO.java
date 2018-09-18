package cn.kepu.self.video.dao;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.entity.VideoType;
import java.util.List;

/**
 *
 * @author 马亚星
 */
public interface VideoTypeDAO {

    /**
     * 新增视频分类
     *
     * @param name 视频分类名称
     * @return 新增结果。true：成功，false：分类名已存在
     */
    boolean addVideoType(String name);

    /**
     * 删除视频分类
     *
     * @param id 主键
     * @return 
     */
    boolean delVideoType(Long id);

    /**
     * 修改视频分类名称
     *
     * @param name 专辑名称
     * @param id 主键
     * @@return 修改结果。true：成功，false：分类名已存在
     */
    boolean updateVideoType(String name, Long id);

    /**
     * 查询所有的视频分类
     *
     * @return
     */
    BinaryPair<List<VideoType>, Long> selVideoType(String name, int offset, int pageSize);
}
