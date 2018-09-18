package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.VideoType;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 劉一童
 */
public interface VideoTypeMapper {

    /**
     * 新增视频分类
     *
     * @param name 视频分类名称
     */
    void insertVideoType(@Param("name")String name);

    /**
     * 删除视频分类
     *
     * @param id 主键
     */
    void deleteVideoType(@Param("id") Long id);

    /**
     * 修改视频分类名称
     *
     * @param name 专辑名称
     * @param id 主键
     * @#return 修改结果。0:成功，1:失败,2：其他错误
     */
    void updateVideoType(@Param("name") String name, @Param("id") Long id);

    /**
     * 查询所有的视频分类
     * @param videoType
     * @return 
     */
    List<VideoType> searchVideoType(VideoType videoType);
}
