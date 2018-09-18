package cn.kepu.self.video.service;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.dao.SensitiveWordsDAO;
import cn.kepu.self.video.entity.SensitiveWords;
import java.util.List;

/**
 *
 * @author 周
 */
public enum SensitiveWordsService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private SensitiveWordsService() {
    }

    public static SensitiveWordsService getInstance() {
        return INSTANCE;
    }

    private SensitiveWordsDAO sensitiveWordsDAO;

    public void setSensitiveWordsDAO(SensitiveWordsDAO sensitiveWordsDAO) {
        this.sensitiveWordsDAO = sensitiveWordsDAO;
    }

    /**
     * 新增敏感词汇
     *
     * @param sensitiveWords
     * @return 新增结果。0：成功，1：分类名已存在，2：分类名为NULL，3：其他错误
     */
    public int insertSensitive(SensitiveWords sensitiveWords) {
        return sensitiveWordsDAO.insertSensitive(sensitiveWords);
    }

    /**
     * 删除敏感词汇
     *
     * @param id 主键
     * @return 删除结果。0：成功，1：失败，2：其他错误
     */
    public int deleteSensitive(Long id) {
        return sensitiveWordsDAO.deleteSensitive(id);
    }

    /**
     * 修改敏感词汇
     *
     * @param sensitiveWords
     * @return 删除结果。0：成功，1：失败，2：其他错误
     */
    public int updateSensitive(SensitiveWords sensitiveWords) {

        return sensitiveWordsDAO.updateSensitive(sensitiveWords);
    }

    /**
     * 查询敏感词汇
     *
     * @return
     */
    public BinaryPair<List<SensitiveWords>, Long> selectSensitive(String word, int offset, int pageSize) {
        return sensitiveWordsDAO.selectSensitive(word, offset, pageSize);
    }

    /**
     * 通过id查询敏感词汇
     *
     * @return
     */
    public SensitiveWords selectSensitiveById(Long id) {

        return sensitiveWordsDAO.selectSensitiveById(id);
    }
}
