package cn.kepu.self.task.dao;

import cn.kepu.self.task.entity.Task;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 * 任务发布
 *
 * @author 马亚星
 */
public interface TaskDAO {

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
     * @param status 任务状态 (0:已无效，3：已结束 ，1：待认领 ， 2：已认领)
     * @return 0：成功，2：其他错误
     */
    int addTask(Long type, String title, String thumbnail, String descript, int score, Long startTime, Long endTime, int status);

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
     * @param status 任务状态 (0:已无效，3：已结束 ，1：待认领 ， 2：已认领)
     * @param id
     * @return 0：成功，2：其他错误
     */
    int updateTask(Long type, String title, String thumbnail, String descript, int score, Long startTime, Long endTime, int status, Long id);

    /**
     * 修改任务的状态
     * 
     * @param status 状态值（0 已无效,1 待认领,2 已认领,3 已结束）
     * @param id 任务id 
     * @return  0：成功，2：其它错误
     */
    int updateTaskByStatus(Integer status,Long id);
    
    /**
     * 查询任务
     *
     * @param title 任务标题
     * @return
     */
    BinaryPair<List<Task>, Long> selectTaskList(int offset, int pageSize, String title, Long type, Integer status);
    
    Task selectById(Long id);
}
