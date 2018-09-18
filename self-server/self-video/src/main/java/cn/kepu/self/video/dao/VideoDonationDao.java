package cn.kepu.self.video.dao;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.entity.VideoDonation;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface VideoDonationDao {
    
    void addVideoDonation(VideoDonation videoDonation);
    void updateVideoDonation(VideoDonation videoDonation);
    BinaryPair<List<VideoDonation>,Long> countVideoDonation(int offset, int count);
    BinaryPair<List<VideoDonation>, Long> countVideoDonation1(int offset, int count);
    BinaryPair<List<VideoDonation>, Long> countVideoDonation2(Long video, int offset, int count);
}
