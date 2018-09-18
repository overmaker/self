package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.Danmu;
import java.util.List;

/**
 * 视频弹幕
 *
 * @author 周
 */
public interface DanmuMapper {

    /**
     * 存入视频弹幕
     *
     * @param danmu
     */
    void insertDanmu(Danmu danmu);

    /**
     * 删除视频弹幕
     *
     * @param id 主键
     * @return 删除结果。0:成功，2：其他错误
     */
    int deleteDanmu(Long id);

    /**
     * 查询所有视频弹幕
     *
     * @param danmu
     * @return
     */
    List<Danmu> selectDanmu(Danmu danmu);

//    /**
//     * 统计视频的评论数量
//     *
//     * @param videoId
//     * @return 
//     * @return弹幕数量
//     */
//    Long selectDanmuCount(Long videoId);
    //    后台审核
    List<Danmu> adminVideoDanmu(Danmu danmu);

    int adminChangeDanmu(Long id);

//    即时弹幕审核
    int danmuCheck(String content);
}
