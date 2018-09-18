package cn.kepu.self.video.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 敏感词汇
 *
 * @author 周
 */
@XmlRootElement(name = "sensitive-words")
public final class SensitiveWords extends BaseEntity {

    /**
     * 敏感词汇
     */
    @XmlElement(name = "word")
    private String word;

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }
}
