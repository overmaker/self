package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.VideoInfo;
import java.util.List;

/**
 * 视频信息
 *
 * @author 马亚星
 */
public interface VideoInfoMapper {

    /**
     * 新增视频信息
     *
     * @param id
     * @return 新增结果。 0：成功，1：重复值，2：其他错误
     */
    int insertVideoInfo(Long id);

    /**
     * 删除视频信息
     *
     * @param id 主键
     * @return 删除结果。 0：成功，2：其他错误
     */
    int deleteVideoInfo(Long id);

    /**
     * 修改视频信息
     *
     * @param likesNum 视频点赞数
     * @param commentNum 视频评论数
     * @param score 视频平均分
     * @param id 主键
     * @return 修改结果。 0：成功，1：重复值，2：其他错误
     */
    int updateVideoInfo(int likesNum, int commentNum, int score, Long id);

    /**
     * 查询视频信息
     *
     * @return
     */
    VideoInfo selByIdVideoInfo(Long id);
            
    List<VideoInfo> searchVideoInfo();
}
