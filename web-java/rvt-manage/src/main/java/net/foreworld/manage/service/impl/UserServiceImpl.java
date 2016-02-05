package net.foreworld.manage.service.impl;

import net.foreworld.manage.mapper.UserMapper;
import net.foreworld.manage.model.User;
import net.foreworld.manage.service.UserService;

import org.springframework.stereotype.Service;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
@Service("userService")
public class UserServiceImpl extends BaseService<User> implements UserService {

	@Override
	public User findByName(String user_name) {
		return ((UserMapper) getMapper()).findByName(user_name);
	}
}
