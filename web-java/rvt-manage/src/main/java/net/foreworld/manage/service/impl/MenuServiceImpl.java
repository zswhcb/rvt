package net.foreworld.manage.service.impl;

import java.util.List;

import net.foreworld.manage.model.Menu;
import net.foreworld.manage.service.MenuService;

import org.springframework.stereotype.Service;

import tk.mybatis.mapper.entity.Example;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
@Service("menuService")
public class MenuServiceImpl extends BaseService<Menu> implements MenuService {

	@Override
	public List<Menu> findByPid(String id) {
		if (null == id)
			id = "0";
		// TODO
		Example example = new Example(Menu.class);
		Example.Criteria criteria = example.createCriteria();
		criteria.andEqualTo("pid", id);
		return selectByExample(example);
	}
}
