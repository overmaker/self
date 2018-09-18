package cn.kepu.self.video.mybatis.mapper;

import cn.kepu.self.video.entity.SensitiveWords;
import java.util.List;

/**
 *
 * @author周
 */
public interface SensitiveWordsMapper {

    /**
     * 新增敏感词汇
     *
     * @param sensitiveWords
     */
    void insertSensitive(SensitiveWords sensitiveWords);

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
     * 查询敏感词汇
     *
     * @return
     */
    List<SensitiveWords> selectSensitive(SensitiveWords sensitiveWords);

    /**
     * 通过id查询敏感词汇
     *
     * @param id
     * @return
     */
    SensitiveWords selectSensitiveById(Long id);
}
