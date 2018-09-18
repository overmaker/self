package cn.kepu.self.video.dao;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.video.entity.SensitiveWords;
import java.util.List;

/**
 *
 * @author 周
 */
public interface SensitiveWordsDAO {

    /**
     * 新增敏感词汇
     *
     * @param sensitiveWords
     * @return 新增结果。0：成功，1：分类名已存在，2：分类名为NULL，3：其他错误
     */
    int insertSensitive(SensitiveWords sensitiveWords);

    /**
     * 删除敏感词汇
     *
     * @param id 主键
     * @return 删除结果。0:成功，1:失败,2：其他错误
     */
    int deleteSensitive(Long id);

    /**
     * 修改敏感词汇
     *
     * @param sensitiveWords
     * @#return 修改结果。0:成功，1:失败,2：其他错误
     */
    int updateSensitive(SensitiveWords sensitiveWords);

    /**
     * 查询所有的敏感词汇
     *
     * @param offset
     * @param pageSize
     * @return
     */
    BinaryPair<List<SensitiveWords>, Long> selectSensitive(String word, int offset, int pageSize);

    /**
     * 通过id查询敏感词汇
     *
     * @param id
     * @return
     */
    SensitiveWords selectSensitiveById(Long id);
}
