package net.foreworld.manage.service.impl;

import java.util.List;

import net.foreworld.manage.mapper.UserMapper;
import net.foreworld.manage.model.User;
import net.foreworld.manage.service.UserService;
import net.foreworld.util.encryptUtil.MD5;

import org.springframework.stereotype.Service;

import tk.mybatis.mapper.entity.Example;

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

	@Override
	public List<User> findByUser(User user, int page, int rows) {
		Example example = new Example(User.class);
		example.setOrderByClause("create_time desc");
		return selectByExample(example);
	}

	@Override
	public int resetPwdByKeys(String keys) {
		String[] _keys = keys.split(",");
		int result = 0;
		// TODO
		for (String key : _keys) {
			User user = new User();
			user.setId(key);
			user.setUser_pass(MD5.encode("123456"));
			result += updateNotNull(user);
		}
		return result;
	}
}
