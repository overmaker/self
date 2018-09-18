package cn.kepu.self.task.mybatis.mapper;

import cn.kepu.self.task.entity.Task;
import java.util.List;

/**
 * 任务发布
 *
 * @author 马亚星
 */
public interface TaskMapper {

    /**
     * 发布任务
     *
     * @param task
     * @return 0：成功，2：其他错误
     */
    int insertTask(Task task);

    /**
     * 发布任务
     *
     * @param task
     * @return 0：成功，2：其他错误
     */
    int updateTask(Task task);

    int updateTaskByStatus(Task task);
    /**
     * 查询任务
     *
     * @param task 任务标题
     * @return
     */
    List<Task> selectTaskList(Task task);
    
    Task selectById(Long id);
}
