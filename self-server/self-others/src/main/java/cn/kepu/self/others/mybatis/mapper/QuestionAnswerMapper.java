package cn.kepu.self.others.mybatis.mapper;

import cn.kepu.self.others.entity.QuestionAnswer;
import java.util.List;

/**
 *
 * @author 
 */
public interface QuestionAnswerMapper {
    
    void insertQuestionAnswer(QuestionAnswer questionAnswer);
    
    void updateQuestionAnswer(QuestionAnswer questionAnswer);
    
    void deleteQuestionAnswer(Long id);
    
    QuestionAnswer selectById(Long id);
    
    List<QuestionAnswer> selectAll();
}
