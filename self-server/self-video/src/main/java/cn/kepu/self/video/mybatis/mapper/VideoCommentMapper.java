package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.VideoComment;
import java.util.List;

/**
 * 视频评论
 *
 * @author 马亚星
 */
public interface VideoCommentMapper {

    /**
     * 新增视频评论
     *
     * @param videoComment 评论
     */
    void insertVideoComment(VideoComment videoComment);

    /**
     * 删除视频评论
     *
     * @param id 主键
     * @return 删除结果。0:成功，2：其他错误
     */
    int deleteVideoComment(Long id);

    /**
     * 查询所有视频评论
     *
     * @param video
     * @return
     */
    List<VideoComment> selectVideoComment(VideoComment videoComment);

    /**
     * 统计视频的评论数量
     *
     * @param videoId
     * @return 评论数量
     */
    Long selectVideoCommentCount(Long videoId);

//    后台审核
    List<VideoComment> adminVideoComment(VideoComment videoComment);

    List<VideoComment> adminComment(VideoComment videoComment);

    int adminChangeComment(Long id);

    //    参与情况统计1-点击量
    List<VideoComment> count2();

//    视屏评论详情页
    List<VideoComment> adminCommentView(Long id);

    //    视屏评论详情页1
    List<VideoComment> adminCommentView1(Long id);

    //    视屏评论详情页2
    List<VideoComment> adminCommentView2(Long id);

}
