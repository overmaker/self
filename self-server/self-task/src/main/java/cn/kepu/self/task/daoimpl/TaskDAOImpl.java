package cn.kepu.self.task.daoimpl;

import cn.kepu.self.task.dao.TaskDAO;
import cn.kepu.self.task.entity.Task;
import cn.kepu.self.task.entity.TaskType;
import cn.kepu.self.task.mybatis.mapper.TaskJoinMapper;
import cn.kepu.self.task.mybatis.mapper.TaskMapper;
import cn.kepu.self.task.mybatis.mapper.TaskTypeMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.sql.Timestamp;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DuplicateKeyException;

/**
 * 任务发布
 *
 * @author 马亚星
 */
public class TaskDAOImpl implements TaskDAO {

    private final Logger logger = LogManager.getLogger("cn.kepu.self");

    private TaskMapper taskMapper;
    private TaskJoinMapper taskJoinMapper;
    private TaskTypeMapper taskTypeMapper;

    public void setTaskMapper(TaskMapper taskMapper) {
        this.taskMapper = taskMapper;
    }

    public void setTaskJoinMapper(TaskJoinMapper taskJoinMapper) {
        this.taskJoinMapper = taskJoinMapper;
    }
    
    public void setTaskTypeMapper(TaskTypeMapper taskTypeMapper) {
        this.taskTypeMapper = taskTypeMapper;
    }

    @Override
    public int addTask(Long type, String title, String thumbnail, String descript, int score, Long startTime, Long endTime, int status) {
        try {
            Timestamp starTime = new Timestamp(startTime);
            Timestamp endsTime = new Timestamp(endTime);

            TaskType taskType = new TaskType();
            taskType.setId(type);

            Task task = new Task();
            task.setThumbnail(thumbnail);
            task.setTitle(title);
            task.setType(taskType);
            task.setDescript(descript);
            task.setStartTime(starTime);
            task.setEndTime(endsTime);
            task.setScore(score);
            task.setStatus(status);
            taskMapper.insertTask(task);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public int updateTask(Long type, String title, String thumbnail, String descript, int score, Long startTime, Long endTime, int status, Long id) {
        try {
            Timestamp starTime = new Timestamp(startTime);
            Timestamp endsTime = new Timestamp(endTime);

            TaskType taskType = new TaskType();
            taskType.setId(type);

            Task task = new Task();
            task.setThumbnail(thumbnail);
            task.setTitle(title);
            task.setType(taskType);
            task.setDescript(descript);
            task.setStartTime(starTime);
            task.setEndTime(endsTime);
            task.setScore(score);
            task.setStatus(status);
            task.setId(id);
            taskMapper.updateTask(task);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public BinaryPair<List<Task>, Long> selectTaskList(int offset, int pageSize, String title, Long type, Integer status) {
        PageHelper.offsetPage(offset, pageSize);
        
        TaskType taskType = new TaskType();
        taskType.setId(type);

        Task task = new Task();
        task.setTitle(title);
        task.setType(taskType);
        task.setStatus(status);

        List<Task> list = taskMapper.selectTaskList(task);
        PageInfo<Task> pageInfo = new PageInfo(list);
        BinaryPair<List<Task>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
    
    @Override
    public Task selectById(Long id) {
        return taskMapper.selectById(id);
    }

    @Override
    public int updateTaskByStatus(Integer status, Long id) {
         try { 
             Task task = new Task();
             task.setStatus(status);
             task.setId(id);
             taskMapper.updateTaskByStatus(task);
         }catch(Exception e){
             e.printStackTrace();
             return 2;
         }
         return 0;
    }

}
