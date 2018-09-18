package cn.kepu.self.others.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 周林敏
 */
@XmlRootElement(name = "question-answer")
public class QuestionAnswer extends BaseEntity {

    /**
     * 问题
     */
    @XmlElement(name = "question")
    private String question;

    /**
     * 答案
     */
    @XmlElement(name = "answer")
    private String answer;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

}
