package cn.kepu.self.task.mybatis.mapper;

import cn.kepu.self.task.entity.TaskJoin;
import java.util.List;

/**
 * 领取任务
 *
 * @author 马亚星
 */
public interface TaskJoinMapper {

    /**
     * 领取任务
     *
     * @param taskJoin
     * @return 0：成功，1：值重复,2：其他错误
     */
    int insertTaskJoin(TaskJoin taskJoin);

    /**
     * 领取任务
     *
     * @param taskJoin
     * @return 0：成功，1：值重复,2：其他错误
     */
    int updateTaskJoin(TaskJoin taskJoin);

    int updateTaskJoinByStatus(Integer status,Long id);
    int updateTaskJoinAllStatus(Integer status,Long task);
    int updateTaskJoinStatus(Long task);
    /**
     * 查询任务领取
     *
     * @param taskJoin
     * @return
     */
    Long countTaskJoin(Long task);
    
    List<TaskJoin> selectTaskJoin(TaskJoin taskJoin);
}
