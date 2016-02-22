package net.foreworld.rvt.service.impl;

import java.util.List;

import net.foreworld.rvt.model.User;
import net.foreworld.rvt.service.UserService;
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

	@Override
	public String[] changePwd(String user_id, String old_pass, String new_pass) {
		old_pass = StringUtil.isEmpty(old_pass);

		// TODO
		User user = selectByKey(user_id);
		if (null == user)
			return new String[] { "用户不存在" };

		// TODO
		if (!MD5.encode(old_pass).equals(user.getUser_pass()))
			return new String[] { "原始密码错误" };

		User _user = new User();
		_user.setId(user_id);
		_user.setUser_pass(MD5.encode(new_pass));
		super.updateNotNull(_user);

		return null;
	}

	@Override
	public String[] register(User user) {
		return null;
	}

	@Override
	public User findByEmail(String email) {
		email = StringUtil.isEmpty(email);
		if (null == email)
			return null;

		Example example = new Example(User.class);
		Example.Criteria criteria = example.createCriteria();
		criteria.andEqualTo("email", email);

		List<User> list = selectByExample(example);

		if (1 != list.size())
			return null;

		return list.get(0);
	}

	@Override
	public User findByRefereeId(String referee_id) {
		referee_id = StringUtil.isEmpty(referee_id);
		if (null == referee_id)
			return null;

		Example example = new Example(User.class);
		Example.Criteria criteria = example.createCriteria();
		criteria.andEqualTo("referee_id", referee_id);

		List<User> list = selectByExample(example);

		if (1 != list.size())
			return null;

		return list.get(0);
	}
}
