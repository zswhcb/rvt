package net.foreworld.manage.service;

import java.util.List;

import net.foreworld.manage.model.Menu;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
public interface MenuService extends IService<Menu> {

	List<Menu> findByPid(String id);
}
