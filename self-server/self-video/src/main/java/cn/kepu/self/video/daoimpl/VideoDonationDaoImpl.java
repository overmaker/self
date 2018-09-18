package cn.kepu.self.video.daoimpl;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoDonationDao;
import cn.kepu.self.video.entity.Video;
import cn.kepu.self.video.entity.VideoDonation;
import cn.kepu.self.video.mybatis.mapper.VideoDonationMapper;
import cn.kepu.self.video.mybatis.mapper.VideoMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;

/**
 *
 * @author 李成志
 */
public class VideoDonationDaoImpl implements VideoDonationDao {
    
    private final VideoDonationMapper videoDonationMapper;
    private final VideoMapper videoMapper;
    
    public VideoDonationDaoImpl(VideoDonationMapper videoDonationMapper,VideoMapper videoMapper) {
        this.videoDonationMapper = videoDonationMapper;
        this.videoMapper = videoMapper;
    }

    @Override
    public void addVideoDonation(VideoDonation videoDonation) {
        videoDonationMapper.addVideoDonation(videoDonation);
    }

    @Override
    public void updateVideoDonation(VideoDonation videoDonation) {
        videoDonationMapper.updateVideoDonation(videoDonation);
    }
    
    @Override
    public BinaryPair<List<VideoDonation>,Long> countVideoDonation(int offset, int count) {
        PageHelper.offsetPage(offset, count);
        
        List<VideoDonation> list = videoDonationMapper.countVideoDonation();
        PageInfo<VideoDonation> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoDonation>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<VideoDonation>, Long> countVideoDonation1(int offset, int count) {
        PageHelper.offsetPage(offset, count);
        
        List<VideoDonation> list = videoDonationMapper.countVideoDonation1();
        PageInfo<VideoDonation> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoDonation>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<VideoDonation>, Long> countVideoDonation2(Long video, int offset, int count) {
        PageHelper.offsetPage(offset, count);
        
        Video video1 = new Video();
        video1.setId(video);
        
        VideoDonation videoDonation = new VideoDonation();
        videoDonation.setVideo(video1);
        List<VideoDonation> list = videoDonationMapper.countVideoDonation2(videoDonation);
        PageInfo<VideoDonation> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoDonation>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
    
}
