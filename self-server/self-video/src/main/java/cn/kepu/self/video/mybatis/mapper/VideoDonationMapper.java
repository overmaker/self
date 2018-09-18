package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.VideoDonation;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface VideoDonationMapper {
    
    void addVideoDonation(VideoDonation videoDonation);
    void updateVideoDonation(VideoDonation videoDonation);
    List<VideoDonation> countVideoDonation();
    List<VideoDonation> countVideoDonation1();
    List<VideoDonation> countVideoDonation2(VideoDonation videoDonation);
}
