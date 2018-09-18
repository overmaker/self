package cn.kepu.self.video.daoimpl;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.DanmuDAO;
import cn.kepu.self.video.entity.Danmu;
import cn.kepu.self.video.mybatis.mapper.DanmuMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * 视频弹幕
 *
 * @author 周
 */
public class DanmuDAOImpl implements DanmuDAO {

    private final DanmuMapper danmuMapper;
    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;

    public DanmuDAOImpl(
            DanmuMapper danmuMapper,
            JdbcTemplate jdbcTemplate,
            TransactionTemplate transactionTemplate) {
        this.danmuMapper = danmuMapper;
        this.jdbcTemplate = jdbcTemplate;
        this.transactionTemplate = transactionTemplate;
    }

    @Override
    public void addDanmu(Danmu danmu) {
        final Long videoId = danmu.getVideo().getId();
        transactionTemplate.execute(status -> {
            try {
                danmuMapper.insertDanmu(danmu);
//                jdbcTemplate.update("UPDATE kepu_self_video_info SET daumu_num = (SELECT COUNT(*) FROM kepu_self_video_danmu WHERE video=?) WHERE id=?", videoId, videoId);
                return (Void) null;
            } catch (final Throwable err) {
                status.setRollbackOnly();
                throw err;
            }
        });
    }

    @Override
    public int delDanmu(Long id) {
        try {
            danmuMapper.deleteDanmu(id);
        } catch (final Exception e) {
            return 2;
        }
        return 0;
    }

    @Override
    public List<Danmu> selectDanmu(Danmu danmu) {
        List<Danmu> list = danmuMapper.selectDanmu(danmu);
        return list;
    }
//
//    @Override
//    public Long selDanmuCount(Long videoId) {
//        return danmuMapper.selectDanmuCount(videoId);
//    }

    //    后台审核
    @Override
    public BinaryPair<List<Danmu>, Long> adminVideoDanmu(int offset, int pageSize, Danmu danmu) {
        PageHelper.offsetPage(offset, pageSize);
        List<Danmu> list = danmuMapper.adminVideoDanmu(danmu);

        PageInfo<Danmu> pageInfo = new PageInfo(list);
        BinaryPair<List<Danmu>, Long> pair = new BinaryPair();
        pair.setV1(list);
        pair.setV2(pageInfo.getTotal());
        return pair;
    }

    @Override
    public int adminChangeDanmu(Long id) {
        try {
            danmuMapper.adminChangeDanmu(id);
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }
//   即时弹幕审核

    @Override
    public boolean danmuCheck(String content) {
        int checked = danmuMapper.danmuCheck(content);
        if (checked > 0) {
            return true;
        } else {
            return false;
        }
    }
}
