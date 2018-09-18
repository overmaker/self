package cn.kepu.self.others.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 李成志
 */
@XmlRootElement(name = "policy")
public class Policy extends BaseEntity {

    /**
     * 类型
     */
    @XmlElement(name = "type")
    private Long type;
    
    /**
     * 标题
     */
    @XmlElement(name = "title")
    private String title;

    /**
     * 内容
     */
    @XmlElement(name = "content")
    private String content;

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
