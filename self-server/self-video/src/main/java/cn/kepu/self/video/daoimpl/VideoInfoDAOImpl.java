package cn.kepu.self.video.daoimpl;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoInfoDAO;
import cn.kepu.self.video.entity.VideoInfo;
import cn.kepu.self.video.mybatis.mapper.VideoInfoMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DuplicateKeyException;

/**
 * 视频信息
 *
 * @author 马亚星
 */
public class VideoInfoDAOImpl implements VideoInfoDAO {

    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private VideoInfoMapper videoInfoMapper;

    public void setVideoInfoMapper(VideoInfoMapper videoInfoMapper) {
        this.videoInfoMapper = videoInfoMapper;
    }

    @Override
    public int addVideoInfo(Long id,int likesNum, int commentNum, int score) {
        try {
            videoInfoMapper.insertVideoInfo(id);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public int delVideoInfo(Long id) {
        try {
            videoInfoMapper.deleteVideoInfo(id);
        } catch (final Exception e) {
            return 2;
        }
        return 0;
    }

    @Override
    public int upVideoInfo(int likesNum, int commentNum, int score, Long id) {
        try {
            videoInfoMapper.updateVideoInfo(likesNum, commentNum, score, id);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }
    
    @Override
    public VideoInfo selByIdVideoInfo(Long id) {
        return videoInfoMapper.selByIdVideoInfo(id);
    }

    @Override
    public BinaryPair<List<VideoInfo>, Long> selVideoInfo(int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<VideoInfo> list = videoInfoMapper.searchVideoInfo();
        PageInfo<VideoInfo> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoInfo>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
