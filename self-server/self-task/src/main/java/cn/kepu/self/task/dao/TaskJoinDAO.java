package cn.kepu.self.task.dao;

import cn.kepu.self.task.entity.TaskJoin;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 * 任务领取
 *
 * @author 马亚星
 */
public interface TaskJoinDAO {
    
    /**
     * 领取任务
     *  
     * @param user 用户
     * @param task 任务
     * @param mobile 电话
     * @param email 邮箱
     * @param status 状态
     * @param name 志愿者名称
     * @param score 积分 
     * @return 0：成功，1：值重复,2：其他错误
     */
    int addTaskJoin(Long user, Long task, String mobile, String email, Integer status, String name, Integer score);
        /**
     * 领取任务
     *  
     * @param user 用户
     * @param task 任务
     * @param mobile 电话
     * @param email 邮箱
     * @param status 状态
     * @param name 志愿者名称
     * @param score 积分 
     * @param id
     * @return 0：成功，1：值重复,2：其他错误
     */
    int updateTaskJoin(Long user, Long task, String mobile, String email, Integer status, String name, Integer score,Long id);
    int updateTaskJoinByStatus(Integer status,Long id);
    
    Long countTaskJoin(Long task);
    /**
     * 查询任务领取
     * 
     * @param offset
     * @param pageSize
     * @param status
     * @param email
     * @return 
     */
    BinaryPair<List<TaskJoin>,Long> selTaskJoin(int offset,int pageSize,Integer status,String email,String name,String mobile);
}
