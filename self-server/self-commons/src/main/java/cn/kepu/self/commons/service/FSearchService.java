package cn.kepu.self.commons.service;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.commons.dao.FSearchDAO;
import cn.kepu.self.commons.entity.FSearch;
import java.util.List;

/**
 * 检索管理
 *
 * @author
 */
public enum FSearchService {
	INSTANCE;

	private FSearchService() {
	}

	private static FSearchService getInstance() {
		return INSTANCE;
	}

	private FSearchDAO fSearchDAO;

	public void setfSearchDAO(FSearchDAO fSearchDAO) {
		this.fSearchDAO = fSearchDAO;
	}

	/**
	 * 查询检索结果
	 *
	 * @param searchContent
	 * @param type 
	 * @param introduction
	 * @param image
	 * @return
	 */
	public BinaryPair<List<FSearch>, Long> selectFsearch(int offset, int pageSize, String searchContent, int type) {
		return fSearchDAO.selectFsearch(offset, pageSize, searchContent,type);
	}
}
