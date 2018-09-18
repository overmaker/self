package cn.kepu.self.video.dao;

import cn.kepu.self.commons.entity.EchartData;
import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.entity.VideoComment;
import java.util.List;

/**
 * 视频评论
 *
 * @author 马亚星
 */
public interface VideoCommentDAO {

    /**
     * 新增视频评论
     */
    void addVideoComment(VideoComment videoComment);

    /**
     * 删除视频评论
     *
     * @param id 主键
     * @return 删除结果。0:成功，2：其他错误
     */
    int delVideoComment(Long id);

    /**
     * 查询所有视频评论
     */
    BinaryPair<List<VideoComment>, Long> selectVideoComment(int offset, int pageSize, VideoComment videoComment);

    /**
     * 统计视频的评论数量
     *
     * @param videoId
     * @return 评论数量
     */
    Long selVideoCommentCount(Long videoId);

//    后台审核
    BinaryPair<List<VideoComment>, Long> adminVideoComment(int offset, int pageSize, VideoComment videoComment);

    BinaryPair<List<VideoComment>, Long> adminComment(int offset, int pageSize, VideoComment videoComment);

    int adminChangeComment(Long id);

    //    参与情况统计2-点击量
    BinaryPair<List<VideoComment>, Long> count2();

    //    参与情况统计2-柱状图
    EchartData count20();

    //    视屏评论详情页
    BinaryPair<List<VideoComment>, Long> adminCommentView(Long id);
    //    视屏评论详情页1

    BinaryPair<List<VideoComment>, Long> adminCommentView1(Long id);
    //    视屏评论详情页2

    BinaryPair<List<VideoComment>, Long> adminCommentView2(Long id);
}
