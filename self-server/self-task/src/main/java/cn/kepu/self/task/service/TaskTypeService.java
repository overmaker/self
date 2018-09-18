package cn.kepu.self.task.service;

import cn.kepu.self.task.dao.TaskTypeDAO;
import cn.kepu.self.task.entity.TaskType;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 * 任务类型
 *
 * @author 马亚星
 */
public enum TaskTypeService {
    INSTANCE;

    private TaskTypeService() {
    }

    private static TaskTypeService getInstance() {
        return INSTANCE;
    }

    private TaskTypeDAO taskTypeDAO;

    public void setTaskTypeDAO(TaskTypeDAO taskTypeDAO) {
        this.taskTypeDAO = taskTypeDAO;
    }

    /**
     * 新增任务类型
     *
     * @param name
     * @return 0:成功,1:值重复,2:其他错误
     */
    public int addTaskType(String name) {
        return taskTypeDAO.addTaskType(name);
    }

    /**
     * 修改任务类型
     *
     * @param name
     * @param id
     * @return 0:成功,1:值重复,2:其他错误
     */
    public int updateaskType(String name, Long id) {
        return taskTypeDAO.updateaskType(name, id);
    }

    /**
     * 删除任务类型
     *
     * @param id
     * @return
     */
    public int deTaskType(Long id) {
        return taskTypeDAO.deTaskType(id);
    }

    public BinaryPair<List<TaskType>, Long> selectTaskType(int offset, int pageSize, String name) {
        return taskTypeDAO.selTaskType(offset, pageSize, name);
    }

}
