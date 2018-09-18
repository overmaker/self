package cn.kepu.self.task.service;

import cn.kepu.self.task.dao.TaskJoinDAO;
import cn.kepu.self.task.entity.TaskJoin;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 * 领取任务
 *
 * @author 马亚星
 */
public enum TaskJoinService {
    INSTANCE;

    private TaskJoinService() {
    }

    private static TaskJoinService getInstance() {
        return INSTANCE;
    }

    private TaskJoinDAO taskJoinDAO;

    public void setTaskJoinDAO(TaskJoinDAO taskJoinDAO) {
        this.taskJoinDAO = taskJoinDAO;
    }

    public int addTaskJoin(Long user, Long task, String mobile, String email, Integer status, String name, Integer score) {
        return taskJoinDAO.addTaskJoin(user, task, mobile, email, status, name, score);
    }

    public int updateTaskJoin(Long user, Long task, String mobile, String email, Integer status, String name, Integer score, Long id) {
        return taskJoinDAO.updateTaskJoin(user, task, mobile, email, status, name, score, id);
    }
    
    /**
     * 0. 待批准 1. 已批准 2. 被否决 3. 已结束
     * @param status
     * @param id
     * @return 
     */
    public int updateTaskJoinByStatus(Integer status,
            Long id) {
        return taskJoinDAO.updateTaskJoinByStatus(status, id);
    }
    
    public Long countTaskJoin(Long task) {
        return taskJoinDAO.countTaskJoin(task);
    }

    public BinaryPair<List<TaskJoin>, Long> selTaskJoin(int offset, int pageSize, Integer status, String email, String name, String mobile) {
        return taskJoinDAO.selTaskJoin(offset, pageSize, status, email, name, mobile);
    }

}
