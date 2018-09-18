package cn.kepu.self.video.daoimpl;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoThemeDAO;
import cn.kepu.self.video.entity.VideoTheme;
import cn.kepu.self.video.mybatis.mapper.VideoThemeMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;

/**
 *
 * @author 马亚星
 */
public class VideoThemeDAOImpl implements VideoThemeDAO {

    private VideoThemeMapper videoThemeMapper;

    public void setVideoThemeMapper(VideoThemeMapper videoThemeMapper) {
        this.videoThemeMapper = videoThemeMapper;
    }

    @Override
    public boolean addVideoTheme(VideoTheme videoTheme) {
        try {
            videoThemeMapper.insertVideoTheme(videoTheme);
        } catch (final DuplicateKeyException e) {
            return false;
        }
        return true;
    }

    @Override
    public boolean delVideoTheme(Long id) {
        try {
            videoThemeMapper.deleteVideoTheme(id);
        } catch (final DataIntegrityViolationException e) {
            return false;
        }
        return true;
    }

    @Override
    public boolean updateVideoTheme(VideoTheme videoTheme) {
        try {
            videoThemeMapper.updateVideoTheme(videoTheme);
        } catch (final DuplicateKeyException e) {
            return false;
        }
        return true;
    }

    @Override
    public BinaryPair<List<VideoTheme>, Long> selVideoTheme(String name, int offset, int pageSize) {
        VideoTheme videoTheme = new VideoTheme();
        videoTheme.setName(name);

        PageHelper.offsetPage(offset, pageSize);
        List<VideoTheme> list = videoThemeMapper.searchVideoTheme(videoTheme);
        PageInfo<VideoTheme> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoTheme>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public BinaryPair<List<VideoTheme>, Long> findByAll() {
        PageHelper.offsetPage(0, 10000);
        List<VideoTheme> list = videoThemeMapper.findByAll();
        PageInfo<VideoTheme> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoTheme>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public VideoTheme findById(Long id) {
        VideoTheme videoTheme = videoThemeMapper.findById(id);
        return videoTheme;

    }

    @Override
    public BinaryPair<List<VideoTheme>, Long> findByOrder() {
        PageHelper.offsetPage(0, 10000);
        List<VideoTheme> list = videoThemeMapper.findByOrder();
        PageInfo<VideoTheme> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoTheme>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
