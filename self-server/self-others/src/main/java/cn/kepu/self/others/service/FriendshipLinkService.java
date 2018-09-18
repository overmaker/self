package cn.kepu.self.others.service;

import cn.kepu.self.others.dao.FriendshipLinkDao;
import cn.kepu.self.others.entity.FriendshipLink;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum FriendshipLinkService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private FriendshipLinkService() {}

    public static FriendshipLinkService getInstance() {
        return INSTANCE;
    }

    private FriendshipLinkDao friendshipLinkDao;
    
    public void setFriendshipLinkDao(FriendshipLinkDao friendshipLinkDao) {
        this.friendshipLinkDao = friendshipLinkDao;
    }

    public void addFriendshipLink(String tooltip, String image, String linkUrl) {
        friendshipLinkDao.insertFriendshipLink(tooltip, image, linkUrl);
    }
    
    public void updateFriendshipLink(String tooltip, String image, String linkUrl, Long id) {
        friendshipLinkDao.updateFriendshipLink(tooltip, image, linkUrl, id);
    }
    
    public void deleteFriendshipLink(Long id) {
        friendshipLinkDao.deleteFriendshipLink(id);
    }
    
    public FriendshipLink findById(Long id) {
        return friendshipLinkDao.selectById(id);
    }
    
    public BinaryPair<List<FriendshipLink>, Long> selectFriendshipLink(int offset, int pageSize){
        return friendshipLinkDao.selectAll(offset, pageSize);
    }
}
