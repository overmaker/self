package cn.kepu.self.others.daoimpl;

import cn.kepu.self.others.dao.QuestionAnswerDao;
import cn.kepu.self.others.entity.QuestionAnswer;
import cn.kepu.self.others.mybatis.mapper.QuestionAnswerMapper;
import cn.kepu.self.util.BinaryPair;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;

/**
 *
 * @author 周林敏
 */
public class QuestionAnswerDaoImpl implements QuestionAnswerDao {
    
    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    private QuestionAnswerMapper questionAnswerMapper;

    public void setQuestionAnswerMapper(QuestionAnswerMapper questionAnswerMapper) {
        this.questionAnswerMapper = questionAnswerMapper;
    }

    @Override
    public int insertQuestionAnswer(String question, String answer) {
        QuestionAnswer questionAnswer = new QuestionAnswer();
        questionAnswer.setQuestion(question);
        questionAnswer.setAnswer(answer);
        
        try {
            questionAnswerMapper.insertQuestionAnswer(questionAnswer);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final DataIntegrityViolationException e) {
            return 2;
        } catch (final Exception e) {
            logger.error("添加关于时异常", e);
            return 3;
        }
        return 0;
    }

    @Override
    public int updateQuestionAnswer(String question, String answer, Long id) {
        QuestionAnswer questionAnswer = new QuestionAnswer();
        questionAnswer.setQuestion(question);
        questionAnswer.setAnswer(answer);
        questionAnswer.setId(id);
        try {
            questionAnswerMapper.updateQuestionAnswer(questionAnswer);
        } catch (final DuplicateKeyException e) {
            return 1;
        } catch (final Exception e) {
            e.printStackTrace();
            return 2;
        }
        return 0;
    }

    @Override
    public void deleteQuestionAnswer(Long id) {
        questionAnswerMapper.deleteQuestionAnswer(id);
    }

    @Override
    public QuestionAnswer selectById(Long id) {
        return questionAnswerMapper.selectById(id);
    }

    @Override
    public BinaryPair<List<QuestionAnswer>, Long> selectAll(int offset, int pageSize) {
        PageHelper.offsetPage(offset, pageSize);
        List<QuestionAnswer> list = questionAnswerMapper.selectAll();
        PageInfo<QuestionAnswer> pageInfo = new PageInfo(list);
        BinaryPair<List<QuestionAnswer>, Long> value = new BinaryPair();
        value.setV1(list);
        value.setV2(pageInfo.getTotal());
        return value;
    }
}
