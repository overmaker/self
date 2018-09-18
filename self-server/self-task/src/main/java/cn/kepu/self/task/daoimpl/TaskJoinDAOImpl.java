package cn.kepu.self.task.daoimpl;

import cn.kepu.self.commons.entity.User;
import cn.kepu.self.task.dao.TaskJoinDAO;
import cn.kepu.self.task.entity.Task;
import cn.kepu.self.task.entity.TaskJoin;
import cn.kepu.self.task.mybatis.mapper.TaskJoinMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DuplicateKeyException;

/**
 * 任务信息
 *
 * @author 马亚星
 */
public class TaskJoinDAOImpl implements TaskJoinDAO {

    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private TaskJoinMapper taskJoinMapper;

    public void setTaskJoinMapper(TaskJoinMapper taskJoinMapper) {
        this.taskJoinMapper = taskJoinMapper;
    }

    @Override
    public int addTaskJoin(Long user, Long task, String mobile, String email, Integer status, String name, Integer score) {
        try {
            Task taskEntity = new Task();
            taskEntity.setId(task);

            User userEntity = new User();
            userEntity.setId(user);

            TaskJoin taskJoin = new TaskJoin();
            taskJoin.setMobile(mobile);
            taskJoin.setEmail(email);
            taskJoin.setStatus(status);
            taskJoin.setScore(score);
            taskJoin.setTask(taskEntity);
            taskJoin.setUser(userEntity);
            taskJoin.setName(name);
            taskJoinMapper.insertTaskJoin(taskJoin);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public int updateTaskJoin(Long user, Long task, String mobile, String email, Integer status, String name, Integer score, Long id) {
        try {
            Task taskEntity = new Task();
            taskEntity.setId(task);

            User userEntity = new User();
            userEntity.setId(user);

            TaskJoin taskJoin = new TaskJoin();
            taskJoin.setMobile(mobile);
            taskJoin.setEmail(email);
            taskJoin.setStatus(status);
            taskJoin.setScore(score);
            taskJoin.setTask(taskEntity);
            taskJoin.setUser(userEntity);
            taskJoin.setName(name);
            taskJoin.setId(id);
            taskJoinMapper.updateTaskJoin(taskJoin);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public BinaryPair<List<TaskJoin>, Long> selTaskJoin(int offset, int pageSize, Integer status, String email, String name, String mobile) {
        PageHelper.offsetPage(offset, pageSize);

        TaskJoin taskJoin = new TaskJoin();
        taskJoin.setName(name);
        taskJoin.setMobile(mobile);
        taskJoin.setEmail(email);
        taskJoin.setStatus(status);

        List<TaskJoin> list = taskJoinMapper.selectTaskJoin(taskJoin);

        PageInfo<TaskJoin> pageInfo = new PageInfo(list);
        BinaryPair<List<TaskJoin>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
    
    @Override
    public Long countTaskJoin(Long task) {
        return taskJoinMapper.countTaskJoin(task);
    }

    @Override
    public int updateTaskJoinByStatus(Integer status,Long id) {
        try {
            TaskJoin taskJoin = new TaskJoin();
            taskJoin.setStatus(status);
            taskJoin.setId(id);
            taskJoinMapper.updateTaskJoinByStatus(status, id);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

}
