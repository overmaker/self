package cn.kepu.self.task.service;

import cn.kepu.self.task.dao.TaskDAO;
import cn.kepu.self.task.entity.Task;
import cn.kepu.self.util.BinaryPair;
import java.util.Date;
import java.util.List;

/**
 * 任务发布
 *
 * @author 马亚星
 */
public enum TaskService {
    INSTANCE;

    private TaskService() {
    }

    private static TaskService getInstance() {
        return INSTANCE;
    }

    private TaskDAO taskDAO;

    public TaskDAO getTaskDAO() {
        return taskDAO;
    }

    public void setTaskDAO(TaskDAO taskDAO) {
        this.taskDAO = taskDAO;
    }

    /**
     * 发布任务
     *
     * @param type 任务类型
     * @param title 任务标题
     * @param thumbnail 任务海报存放相对路径
     * @param descript 任务描述
     * @param score 任务完成后奖励积分
     * @param startTime 开始时间
     * @param endTime 截止时间
     * @param status 任务状态
     * @return 0：成功，2：其他错误
     */
    public int addTask(Long type, String title, String thumbnail, String descript, int score, Long startTime, Long endTime, int status) {
        return taskDAO.addTask(type, title, thumbnail, descript, score, startTime, endTime, status);
    }

    /**
     * 发布任务
     *
     * @param type 任务类型
     * @param title 任务标题
     * @param thumbnail 任务海报存放相对路径
     * @param descript 任务描述
     * @param score 任务完成后奖励积分
     * @param startTime 开始时间
     * @param endTime 截止时间
     * @param status 任务状态
     * @param id
     * @return 0：成功，2：其他错误
     */
    public int updateTask(Long type, String title, String thumbnail, String descript, int score, Long startTime, Long endTime, int status, Long id) {
        return taskDAO.updateTask(type, title, thumbnail, descript, score, startTime, endTime, status, id);
    }

    public BinaryPair<List<Task>, Long> selectTaskList(int offset, int count, String title, Long type, Integer status) {
        return taskDAO.selectTaskList(offset, count, title, type, status);
    }
    
    public Task getTask(Long id) {
        return taskDAO.selectById(id);
    }
    
    public int updateTaskByStatus(Integer status ,Long id ){
         return taskDAO.updateTaskByStatus(status, id);
    }

}
