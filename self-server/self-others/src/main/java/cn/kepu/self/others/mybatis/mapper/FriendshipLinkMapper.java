package cn.kepu.self.others.mybatis.mapper;

import cn.kepu.self.others.entity.FriendshipLink;
import java.util.List;

/**
 *
 * @author 李成志
 */
public interface FriendshipLinkMapper {
    
    void insertFriendshipLink(FriendshipLink friendshipLink);
    
    void updateFriendshipLink(FriendshipLink friendshipLink);
    
    void deleteFriendshipLink(Long id);
    
    FriendshipLink selectById(Long id);
    
    List<FriendshipLink> selectAll();
}
