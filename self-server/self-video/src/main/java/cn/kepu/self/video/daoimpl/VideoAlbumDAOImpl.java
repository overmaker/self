package cn.kepu.self.video.daoimpl;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.VideoAlbumDAO;
import cn.kepu.self.video.entity.VideoAlbum;
import cn.kepu.self.video.entity.VideoType;
import cn.kepu.self.video.mybatis.mapper.VideoAlbumMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DuplicateKeyException;

/**
 *
 * @author 马亚星
 */
public class VideoAlbumDAOImpl implements VideoAlbumDAO {

    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private VideoAlbumMapper videoAlbumMapper;

    public void setVideoAlbumMapper(VideoAlbumMapper videoAlbumMapper) {
        this.videoAlbumMapper = videoAlbumMapper;
    }

    @Override
    public boolean addVideoAlbum(String name) {
        try {
            videoAlbumMapper.insertVideoAlbum(name);
        } catch (final DuplicateKeyException e) {
            return false;
        }
        return true;
    }

    @Override
    public boolean delVideoAlbum(Long id) {
        try {
            videoAlbumMapper.deleteVideoAlbum(id);
        } catch (final Exception e) {
            return false;
        }
        return true;
    }

    @Override
    public boolean updateVideoAlbum(String name, Long id) {
        try {
            videoAlbumMapper.updateVideoAlbum(name, id);
        } catch (final DuplicateKeyException e) {
            return false;
        }
        return true;
    }

    @Override
    public BinaryPair<List<VideoAlbum>, Long> selVideoAlbum(VideoAlbum videoAlbum, int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<VideoAlbum> list = videoAlbumMapper.searchVideoAlbum(videoAlbum);
        PageInfo<VideoAlbum> pageInfo = new PageInfo(list);
        BinaryPair<List<VideoAlbum>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
