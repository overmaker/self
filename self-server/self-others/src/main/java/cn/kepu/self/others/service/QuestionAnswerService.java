
package cn.kepu.self.others.service;

import cn.kepu.self.others.dao.QuestionAnswerDao;
import cn.kepu.self.others.entity.QuestionAnswer;
import cn.kepu.self.util.BinaryPair;
import java.util.List;

/**
 *
 * @author 周林敏
 */
public enum QuestionAnswerService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private QuestionAnswerService() {}

    public static QuestionAnswerService getInstance() {
        return INSTANCE;
    }

    private QuestionAnswerDao questionAnswerDao;
    
    public void setQuestionAnswerDao(QuestionAnswerDao questionAnswerDao) {
        this.questionAnswerDao = questionAnswerDao;
    }

    public int addQuestionAnswer(String question, String answer) {
        if (question == null || question.isEmpty()) {
            return 2;
        }
        return questionAnswerDao.insertQuestionAnswer(question, answer);
    }
    
    public int updateQuestionAnswer(String question, String answer, Long id) {
        if (question == null || question.isEmpty()) {
            return 2;
        }
        return questionAnswerDao.updateQuestionAnswer(question, answer, id);
    }
    
    public void deleteQuestionAnswer(Long id) {
        questionAnswerDao.deleteQuestionAnswer(id);
    }
    
    public QuestionAnswer findById(Long id) {
        return questionAnswerDao.selectById(id);
    }
    
    public BinaryPair<List<QuestionAnswer>, Long> selectQuestionAnswer(int offset, int pageSize){
        return questionAnswerDao.selectAll(offset, pageSize);
    }
}
