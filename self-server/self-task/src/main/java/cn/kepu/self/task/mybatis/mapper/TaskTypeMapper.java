package cn.kepu.self.task.mybatis.mapper;

import java.util.List;
import cn.kepu.self.task.entity.TaskType;

/**
 * 任务类型
 *
 * @author 马亚星
 */
public interface TaskTypeMapper {
    
    /**
     * 新增任务类型
     *
     * @param taskType   
     * @return 0:成功,1:值重复,2:其他错误
     */
    int insertTaskType(TaskType taskType);

    /**
     * 修改任务类型
     *
     * @param taskType  
     * @return 0:成功,1:值重复,2:其他错误
     */
    int updateaskType(TaskType  taskType);

    /**
     * 删除任务类型
     *
     * @param id
     * @return
     */
    int deleteTaskType(Long id);

    /**
     * 查询任务类型
     *
     * @param taskType  类型名称
     * @return
     */
   List<TaskType>  selectTaskType(TaskType taskType);
}
