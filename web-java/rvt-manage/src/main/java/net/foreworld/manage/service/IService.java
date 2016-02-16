package net.foreworld.manage.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 * @param <T>
 */
@Service
public interface IService<T> {

	T selectByKey(Object key);

	int save(T entity);

	int delete(Object key);

	int updateAll(T entity);

	int updateNotNull(T entity);

	List<T> selectByExample(Object example);

	@Transactional
	void deleteByKeys(String keys);
}
