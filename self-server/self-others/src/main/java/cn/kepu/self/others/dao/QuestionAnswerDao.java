package cn.kepu.self.others.dao;

import cn.kepu.self.others.entity.QuestionAnswer;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 周林敏
 */
public interface QuestionAnswerDao {
    
    int insertQuestionAnswer(String question, String answer);
    
    int updateQuestionAnswer(String question, String answer, Long id);
    
    void deleteQuestionAnswer(Long id);
    
    QuestionAnswer selectById(Long id);
    
    BinaryPair<List<QuestionAnswer>, Long> selectAll(int offset, int pageSize);
}
