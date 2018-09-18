package cn.kepu.self.task.daoimpl;

import cn.kepu.self.task.dao.TaskTypeDAO;
import cn.kepu.self.task.entity.TaskType;
import cn.kepu.self.task.mybatis.mapper.TaskTypeMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DuplicateKeyException;

/**
 * 任务发布
 *
 * @author 马亚星
 */
public class TaskTypeDAOImpl implements TaskTypeDAO {

    private final Logger logger = LogManager.getLogger("cn.kepu.self");

    private TaskTypeMapper taskTypeMapper;

    public void setTaskTypeMapper(TaskTypeMapper taskTypeMapper) {
        this.taskTypeMapper = taskTypeMapper;
    }

    @Override
    public int addTaskType(String name) {
        try {
            TaskType taskType = new TaskType();
            taskType.setName(name);
            taskTypeMapper.insertTaskType(taskType);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public int updateaskType(String name, Long id) {
        try {
            TaskType taskType = new TaskType();
            taskType.setName(name);
            taskType.setId(id);
            taskTypeMapper.updateaskType(taskType);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public int deTaskType(Long id) {
        try {
            taskTypeMapper.deleteTaskType(id);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public BinaryPair<List<TaskType>, Long> selTaskType(int offset, int pageSize, String name) {
        PageHelper.offsetPage(offset, pageSize);
        TaskType taskType = new TaskType();
        taskType.setName(name);
        List<TaskType> list = taskTypeMapper.selectTaskType(taskType);
        PageInfo<TaskType> pageInfo = new PageInfo(list);
        BinaryPair<List<TaskType>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }

}
