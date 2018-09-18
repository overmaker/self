package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.VideoAlbum;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 *
 * @author 马亚星
 */
public interface VideoAlbumMapper {

    /**
     * 新增视频专辑
     *
     * @param name 视频专辑名称
     */
    void insertVideoAlbum(@Param("name") String name);

    void deleteVideoAlbum(@Param("id")Long id);

    void updateVideoAlbum(@Param("name")String name, @Param("id")Long id);

    /**
     * 查询所有的视频专辑
     *
     * @param videoAlbum
     * @return
     */
    List<VideoAlbum> searchVideoAlbum(VideoAlbum videoAlbum);
}
