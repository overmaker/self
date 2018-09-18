package cn.kepu.self.task.entity;

import cn.kepu.self.commons.entity.BaseEntity;

/**
 * 任务类型
 *
 * @author 马亚星
 */
public class TaskType extends BaseEntity {

    /**
     * 类型名称
     */
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
