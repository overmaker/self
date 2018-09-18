package cn.kepu.self.others.dao;

import cn.kepu.self.others.entity.FriendshipLink;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface FriendshipLinkDao {
    
    void insertFriendshipLink(String tooltip, String image, String linkUrl);
    
    void updateFriendshipLink(String tooltip, String image, String linkUrl, Long id);
    
    void deleteFriendshipLink(Long id);
    
    FriendshipLink selectById(Long id);
    
    BinaryPair<List<FriendshipLink>, Long> selectAll(int offset, int pageSize);
}
