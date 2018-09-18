package cn.kepu.self.video.daoimpl;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoTypeDAO;
import cn.kepu.self.video.entity.VideoType;
import cn.kepu.self.video.mybatis.mapper.VideoTypeMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;

/**
 *
 * @author 劉一童
 */
public class VideoTypeDAOImpl implements VideoTypeDAO {
    
    private VideoTypeMapper videoTypeMapper;

    public void setVideoTypeMapper(VideoTypeMapper videoTypeMapper) {
        this.videoTypeMapper = videoTypeMapper;
    }

    @Override
    public boolean addVideoType(String name) {
        try {
            videoTypeMapper.insertVideoType(name);
        } catch (final DuplicateKeyException e) {
            return false;
        }
        return true;
    }

    @Override
    public boolean delVideoType(Long id) {
        try {
            videoTypeMapper.deleteVideoType(id);
        } catch (final DataIntegrityViolationException e) {
            return false;
        }
        return true;
    }

    @Override
    public boolean updateVideoType(String name, Long id) {
        try {
            videoTypeMapper.updateVideoType(name, id);
        } catch (final DuplicateKeyException e) {
            return false;
        }
        return true;
    }

    @Override
    public BinaryPair<List<VideoType>, Long> selVideoType(String name, int offset, int pageSize) {
        VideoType videoType = new VideoType();
        videoType.setName(name);
        PageHelper.offsetPage(offset, pageSize);
        List<VideoType> list = videoTypeMapper.searchVideoType(videoType);
        PageInfo<VideoType> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoType>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
