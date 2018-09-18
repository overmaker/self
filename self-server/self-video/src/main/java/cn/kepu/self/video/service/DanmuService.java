package cn.kepu.self.video.service;

import cn.kepu.self.commons.entity.User;
import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.DanmuDAO;
import cn.kepu.self.video.entity.Danmu;
import cn.kepu.self.video.entity.Video;
import java.util.List;

/**
 * 视频弹幕
 *
 * @author 周
 */
public enum DanmuService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private DanmuService() {
    }

    public static DanmuService getInstance() {
        return INSTANCE;
    }

    private DanmuDAO danmuDAO;

    public void setDanmuDAO(DanmuDAO danmuDAO) {
        this.danmuDAO = danmuDAO;
    }

    /**
     * 新增视频弹幕
     *
     * @param danmu
     */
    public void addDanmu(Danmu danmu) {
        danmuDAO.addDanmu(danmu);
    }

    /**
     * 删除视频弹幕
     *
     * @param id 主键
     * @return 删除结果。0：成功，2：其他错误
     */
    public int delDanmu(Long id) {
        return danmuDAO.delDanmu(id);
    }

    /**
     * 查询视频弹幕
     *
     * @param userId
     * @param videoId
     * @param duringTimeStart
     * @param duringTimeEnd
     * @param content
     * @return
     */
    public List<Danmu> selectDanmu(Long userId, Long videoId, Double duringTimeStart, Double duringTimeEnd, String content) {
        Danmu danmu = new Danmu();
        User user = new User();
        if (userId != null) {
            user.setId(userId);
        }
        danmu.setUser(user);
        Video video = new Video();
        if (videoId != null) {
            video.setId(videoId);
        }
        danmu.setVideo(video);
        if (content != null) {
            danmu.setContent(content);
        }
        if (duringTimeStart != null) {
            danmu.setDuringTimeStart(duringTimeStart);
        }
        if (duringTimeEnd != null) {
            danmu.setDuringTimeEnd(duringTimeEnd);
        }
        danmu.setContent(content);
        return danmuDAO.selectDanmu(danmu);
    }

//    /**
//     * 统计视频的弹幕数量
//     *
//     * @param videoId
//     * @return 弹幕数量
//     */
//    public Long selDanmuCount(Long videoId) {
//        return danmuDAO.selDanmuCount(videoId);
//    }
    //    后台审核
    public BinaryPair<List<Danmu>, Long> adminVideoDanmu(int offset, int pageSize, Long userId, Long videoId, String videoTitle, String comment) {
        Danmu danmu = new Danmu();
        User user = new User();
        if (userId != null) {
            user.setId(userId);
        }
        danmu.setUser(user);
        Video video = new Video();
        if (videoId != null) {
            video.setId(videoId);
        }
        if (videoTitle != null) {
            video.setTitle(videoTitle);
        }
        danmu.setVideo(video);
        if (comment != null) {
            danmu.setContent(comment);
        }

        return danmuDAO.adminVideoDanmu(offset, pageSize, danmu);
    }

    public int adminChangeDanmu(Long id) {
        return danmuDAO.adminChangeDanmu(id);
    }

    //    即时弹幕审核
    public boolean danmuCheck(String content) {
        return danmuDAO.danmuCheck(content);
    }
}
