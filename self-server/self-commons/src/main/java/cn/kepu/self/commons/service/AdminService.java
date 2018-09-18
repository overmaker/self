package cn.kepu.self.commons.service;

import cn.kepu.self.commons.dao.AdminDao;
import cn.kepu.self.commons.dao.UserInfoDAO;
import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.entity.UserInfo;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 李成志
 */
public enum AdminService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private AdminService() {}

    public static AdminService getInstance() {
        return INSTANCE;
    }

    private AdminDao adminDao;
    private UserInfoDAO userInfoDAO;

    public void setAdminDao(AdminDao adminDao) {
        this.adminDao = adminDao;
    }

    public void setUserInfoDAO(UserInfoDAO userInfoDAO) {
        this.userInfoDAO = userInfoDAO;
    }

    public boolean addAdmin(String userName, String password, String name, Long roleId) {
        return adminDao.insertAdmin(userName, password, name, roleId);
    }

    public void updateAdmin(Long id, String password, String name, Long roleId) {
        adminDao.updateAdmin(id, password, name, roleId);
    }

    public BinaryPair<User, UserInfo> getAdmin(Long id) {
        User admin = adminDao.selectById(id);
        UserInfo info = userInfoDAO.selUserInfoById(id);
        
        BinaryPair<User, UserInfo> pair = new BinaryPair();
        pair.setV1(admin);
        pair.setV2(info);
        return pair;
    }

    public BinaryPair<List<User>, Long> selectAdmin(String name, int offset, int pageSize) {
        return adminDao.selectAll(name, offset, pageSize);
    }
}
