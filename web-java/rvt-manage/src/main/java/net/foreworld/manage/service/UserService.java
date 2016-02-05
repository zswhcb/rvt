package net.foreworld.manage.service;

import net.foreworld.manage.model.User;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
public interface UserService extends IService<User> {

	User findByName(String user_name);
}
