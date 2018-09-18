package cn.kepu.self.task.dao;

import cn.kepu.self.task.entity.TaskType;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 * 任务发布
 *
 * @author 马亚星
 */
public interface TaskTypeDAO {

    /**
     * 新增任务类型
     *
     * @param name 类型名称
     * @return 0:成功,1:值重复,2:其他错误
     */
    int addTaskType(String name);

    /**
     * 修改任务类型
     *
     * @param name 类型名称
     * @param id
     * @return 0:成功,1:值重复,2:其他错误
     */
    int updateaskType(String name, Long id);

    /**
     * 删除任务类型
     *
     * @param id
     * @return
     */
    int deTaskType(Long id);

    /**
     * 查询任务类型
     *
     * @param offset
     * @param pageSize
     * @param name  类型名称
     * @return
     */
    BinaryPair<List<TaskType>, Long> selTaskType(int offset, int pageSize, String name);
}
