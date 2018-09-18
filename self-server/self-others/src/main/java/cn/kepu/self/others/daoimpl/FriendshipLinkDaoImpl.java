package cn.kepu.self.others.daoimpl;

import cn.kepu.self.others.dao.FriendshipLinkDao;
import cn.kepu.self.others.entity.FriendshipLink;
import cn.kepu.self.others.mybatis.mapper.FriendshipLinkMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 *
 * @author 李成志
 */
public class FriendshipLinkDaoImpl implements FriendshipLinkDao{
    
    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private FriendshipLinkMapper friendshipLinkMapper;

    public void setFriendshipLinkMapper(FriendshipLinkMapper friendshipLinkMapper) {
        this.friendshipLinkMapper = friendshipLinkMapper;
    }

    @Override
    public void insertFriendshipLink(String tooltip, String image, String linkUrl) {
        FriendshipLink friendshipLink = new FriendshipLink();
        friendshipLink.setTooltip(tooltip);
        friendshipLink.setImage(image);
        friendshipLink.setLinkUrl(linkUrl);
        friendshipLinkMapper.insertFriendshipLink(friendshipLink);
    }

    @Override
    public void updateFriendshipLink(String tooltip, String image, String linkUrl, Long id) {
        FriendshipLink friendshipLink = new FriendshipLink();
        friendshipLink.setTooltip(tooltip);
        friendshipLink.setImage(image);
        friendshipLink.setLinkUrl(linkUrl);
        friendshipLink.setId(id);
        friendshipLinkMapper.updateFriendshipLink(friendshipLink);
    }

    @Override
    public void deleteFriendshipLink(Long id) {
        friendshipLinkMapper.deleteFriendshipLink(id);
    }

    @Override
    public FriendshipLink selectById(Long id) {
        return friendshipLinkMapper.selectById(id);
    }

    @Override
    public BinaryPair<List<FriendshipLink>, Long> selectAll(int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<FriendshipLink> list = friendshipLinkMapper.selectAll();
        PageInfo<FriendshipLink> pageInfo = new PageInfo(list);
        BinaryPair<List<FriendshipLink>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
    
}
