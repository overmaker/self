package cn.kepu.self.video.service;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoDAO;
import cn.kepu.self.video.entity.Video;
import cn.kepu.self.video.entity.VideoSearch;
import cn.kepu.self.video.entity.VideoTheme;
import java.util.List;
import java.util.stream.Stream;
import cn.kepu.self.commons.service.MailService;

/**
 * 视频管理
 *
 * @author 马亚星
 */
public enum VideoService {

    INSTANCE;
    private final MailService mailService = MailService.INSTANCE;

    /**
     * 禁用实例化
     */
    private VideoService() {
    }

    public static VideoService getInstance() {
        return INSTANCE;
    }

    private VideoDAO videoDAO;

    public void setVideoDAO(VideoDAO videoDAO) {
        this.videoDAO = videoDAO;
    }

    /* 新增视频
     * @param video 视频
     */
    public void addVideo(Video video) {
        videoDAO.addVideo(video);
    }

    public void copyVideo(Long id) {
        videoDAO.copyVideo(id);
    }

    /**
     * 修改视频
     *
     * @param video
     */
    public void upVideo(Video video) {
        videoDAO.upVideo(video);
    }

    public void updateVideoCheck(Video video) {
        videoDAO.updateVideoCheck(video);
    }

    /**
     * 查询视频
     *
     * @param offset
     * @param count
     * @param title 视频标题
     * @param isVip 是否是vip
     * @param isRecommend 是否推荐到首页
     * @param isEnable 是否启用
     * @param type 视频所属分类
     * @param album 视频所属专辑
     * @return
     */
    public BinaryPair<List<Video>, Long> selVideo(int offset, int count, String title, Boolean isVip, Boolean isRecommend, Boolean isEnable, Long type, Long album) {
        return videoDAO.selVideo(offset, count, title, isVip, isRecommend, isEnable, type, album);
    }

    /*微纪录*/
    public BinaryPair<List<Video>, Long> selectMicro(int offset, int count, Video video) {
        return videoDAO.selectMicro(offset, count, video);
    }

    /*煮酒论道*/
    public BinaryPair<List<Video>, Long> selectDao(int offset, int count, Video video) {
        return videoDAO.selectDao(offset, count, video);
    }

    /**
     * 查询视频
     *
     * @param id
     * @return
     */
    public Video selByIdVideo(Long id) {
        return videoDAO.selByIdVideo(id);
    }

    public BinaryPair<List<Video>, Long> complexSearch(VideoSearch videoSearch) {
        VideoTheme[] themes = videoSearch.getVideoThemes();

        if (themes != null) {
            videoSearch.setVideoThemes(Stream.of(themes).distinct().toArray(VideoTheme[]::new));
        }

        return videoDAO.complexSearch(videoSearch);
    }

    public BinaryPair<List<Video>, Long> advanceSearch(VideoSearch videoSearch) {
        return videoDAO.advanceSearch(videoSearch);
    }

    public BinaryPair<List<Video>, Long> TimeSearch(int offset, int count) {
        return videoDAO.TimeSearch(offset, count);
    }

    public BinaryPair<List<Video>, Long> FeeSearch(int offset, int count) {
        return videoDAO.FeeSearch(offset, count);
    }

    public BinaryPair<List<Video>, Long> SameTimeSearch(Long id, int offset, int count) {
        return videoDAO.SameTimeSearch(id, offset, count);
    }

    public BinaryPair<List<Video>, Long> selectBySpeaker(Long id) {
        return videoDAO.selectBySpeaker(id);
    }

    public BinaryPair<List<Video>, Long> selectByActivity(Long id) {
        return videoDAO.selectByActivity(id);
    }

    //后台视频审核
    public BinaryPair<List<Video>, Long> selectByAdmin(Video video) {
        return videoDAO.selectByAdmin(video);
    }

    //    后台视频审核从新到旧排序
    public BinaryPair<List<Video>, Long> selectByTime0() {
        return videoDAO.selectByTime0();
    }

    //     后台视频管理排序1-6
    public BinaryPair<List<Video>, Long> selectByAdmin1() {
        return videoDAO.selectByAdmin1();
    }

    public BinaryPair<List<Video>, Long> selectByAdmin2() {
        return videoDAO.selectByAdmin2();
    }

    public BinaryPair<List<Video>, Long> selectByAdmin3() {
        return videoDAO.selectByAdmin3();
    }

    public BinaryPair<List<Video>, Long> selectByAdmin4() {
        return videoDAO.selectByAdmin4();
    }

    public BinaryPair<List<Video>, Long> selectByAdmin5() {
        return videoDAO.selectByAdmin5();
    }

    public BinaryPair<List<Video>, Long> selectByAdmin6() {
        return videoDAO.selectByAdmin6();
    }

    //    删除视频关系表1-10
    public void delVideo(Long id) {
        videoDAO.delVideo(id);
    }
}
