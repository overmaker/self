package cn.kepu.self.video.service;

import cn.kepu.self.util.BinaryPair;
import static cn.kepu.self.util.threadpool.SelfThreadPoolCollection.INSTANCE;
import cn.kepu.self.video.dao.VideoDonationDao;
import cn.kepu.self.video.entity.VideoDonation;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 *
 * @author 李成志
 */
public enum VideoDonationService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private VideoDonationService() {
    }

    public static VideoDonationService getInstance() {
        return INSTANCE;
    }

    private VideoDonationDao videoDonationDao;
    private static final SimpleDateFormat DATETIME_FORMAT = new SimpleDateFormat("yyyyMMddHHmmss");

    /**
     * 生成打赏序列号
     *
     * @return 打赏序列号
     */
    private static String generateSN() {
        Random r = new Random();
        return DATETIME_FORMAT.format(new Date()) + Stream.of(
                (long) r.nextInt(16),
                (long) r.nextInt(16),
                (long) r.nextInt(16),
                (long) r.nextInt(16)).
                map(n -> Long.toHexString(n)).collect(Collectors.joining("")).toUpperCase();
    }

    public void setVideoDonationDao(VideoDonationDao videoDonationDao) {
        this.videoDonationDao = videoDonationDao;
    }

    public void addVideoDonation(VideoDonation videoDonation) {
        videoDonation.setSn(generateSN());
        videoDonationDao.addVideoDonation(videoDonation);
    }

    public void updateVideoDonation(VideoDonation videoDonation) {
        videoDonationDao.updateVideoDonation(videoDonation);
    }

    public BinaryPair<List<VideoDonation>, Long> countVideoDonation(int offset, int count) {
        return videoDonationDao.countVideoDonation(offset, count);
    }

    public BinaryPair<List<VideoDonation>, Long> countVideoDonation1(int offset, int count) {
        return videoDonationDao.countVideoDonation1(offset, count);
    }

    public BinaryPair<List<VideoDonation>, Long> countVideoDonation2(Long video, int offset, int count) {
        return videoDonationDao.countVideoDonation2(video, offset, count);
    }
}
