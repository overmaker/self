package cn.kepu.self.commons.daoimpl;

import cn.kepu.self.commons.dao.UserInfoDAO;
import cn.kepu.self.commons.entity.UserInfo;
import cn.kepu.self.commons.mybatis.mapper.UserInfoMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户基本信息
 *
 * @author 马亚星
 */
public class UserInfoDAOImpl implements UserInfoDAO {

    private UserInfoMapper userInfoMapper;

    public void setUserInfoMapper(UserInfoMapper userInfoMapper) {
        this.userInfoMapper = userInfoMapper;
    }

    @Override
    public BinaryPair<List<UserInfo>, Long> selUserInfo(int offset, int pageSize, String name, String nickname, String mobile, String email, Boolean isVip, Boolean isVolunteer) {
        PageHelper.offsetPage(offset, pageSize);

        UserInfo userInfo = new UserInfo();
        userInfo.setVip(isVip);
        userInfo.setVolunteer(isVolunteer);
        userInfo.setNickName(nickname);
        userInfo.setName(name);
        userInfo.setMobile(mobile);
        userInfo.setEmail(email);

        List<UserInfo> list = userInfoMapper.selectUserInfo(userInfo);

        PageInfo<UserInfo> pageInfo = new PageInfo(list);
        BinaryPair<List<UserInfo>, Long> value = new BinaryPair();

        list.stream().map(info -> {
            if (info.getPhoto() == null) {
                info.setPhoto("img/photo.jpg");
            }
            return info;
        }).collect(Collectors.toList());

        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

    @Override
    public UserInfo selUserInfoById(Long uid) {
        UserInfo info = userInfoMapper.selectUserInfoById(uid);
        if (info.getPhoto() == null) {
            info.setPhoto("img/photo.jpg");
        }
        return info;
    }

    @Override
    public void updateUserInfoIsVip(Long uid, boolean vip) {
        userInfoMapper.updateUserInfoIsVip(uid, vip);
    }

    @Override
    public void updateUserInfoIsVolunteer(Long uid, boolean volunteer) {
        userInfoMapper.updateUserInfoIsVolunteer(uid, volunteer);
    }

    @Override
    public void insertOrUpdateUserInfo(UserInfo userInfo) {
        userInfoMapper.insertOrUpdateUserInfo(userInfo);
    }
}
