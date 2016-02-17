package net.foreworld.rvt.model;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
public class QueryModel {

	private Integer offset;
	private Integer pageSize;

	public Integer getOffset() {
		return null == offset ? 0 : offset;
	}

	public void setOffset(Integer offset) {
		this.offset = offset;
	}

	public Integer getPageSize() {
		return null == pageSize ? Integer.MAX_VALUE : pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}
}
