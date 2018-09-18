package cn.kepu.self.video.dao;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.entity.Danmu;
import java.util.List;

/**
 * 视频弹幕
 *
 * @author 周
 */
public interface DanmuDAO {

    /**
     * 存入视频弹幕
     *
     * @param danmu
     */
    void addDanmu(Danmu danmu);

    /**
     * 删除视频弹幕
     *
     * @param id 主键
     * @return 删除结果。0:成功，2：其他错误
     */
    int delDanmu(Long id);

    /**
     * 查询所有视频弹幕
     *
     * @param danmu
     * @return
     */
    List<Danmu> selectDanmu(Danmu danmu);

//    /**
//     * 统计视频的弹幕数量
//     *
//     * @param videoId
//     * @return 弹幕数量
//     */
//    Long selDanmuCount(Long videoId);
    //    后台审核
    BinaryPair<List<Danmu>, Long> adminVideoDanmu(int offset, int pageSize, Danmu danmu);

    int adminChangeDanmu(Long id);

//    即时弹幕审核
    boolean danmuCheck(String content);
}
