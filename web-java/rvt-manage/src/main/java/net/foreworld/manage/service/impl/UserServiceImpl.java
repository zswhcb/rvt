package net.foreworld.manage.service.impl;

import java.util.Date;
import java.util.List;

import net.foreworld.manage.mapper.UserMapper;
import net.foreworld.manage.model.User;
import net.foreworld.manage.service.UserService;
import net.foreworld.util.StringUtil;
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

	private static final String DEFAULT_USER_PASS = MD5.encode("123456");

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
			user.setUser_pass(DEFAULT_USER_PASS);
			result += updateNotNull(user);
		}
		return result;
	}

	@Override
	public String[] saveNew(User user) {
		// TODO
		String user_name = StringUtil.isEmpty(user.getUser_name());
		if (null == user_name)
			return new String[] { "用户名不能为空", "user_name" };

		// TODO
		User _user = findByName(user_name);
		if (null != _user)
			return new String[] { "用户名已经存在", "user_name" };

		// TODO
		user.setUser_name(user_name);
		user.setId(null);
		user.setCreate_time(new Date());
		user.setUser_pass(DEFAULT_USER_PASS);

		// TODO
		save(user);

		return null;
	}

	@Override
	public int updateNotNull(User user) {
		user.setUser_name(null);
		user.setUser_pass(null);
		user.setCreate_time(null);
		// TODO
		return super.updateNotNull(user);
	}
}
