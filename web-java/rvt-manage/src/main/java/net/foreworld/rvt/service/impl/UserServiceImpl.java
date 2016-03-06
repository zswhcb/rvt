package net.foreworld.rvt.service.impl;

import java.util.Date;
import java.util.List;

import net.foreworld.rvt.mapper.UserMapper;
import net.foreworld.rvt.model.User;
import net.foreworld.rvt.service.UserService;
import net.foreworld.util.RestUtil;
import net.foreworld.util.StringUtil;
import net.foreworld.util.encryptUtil.MD5;

import org.springframework.stereotype.Service;

import tk.mybatis.mapper.entity.Example;

import com.github.pagehelper.PageHelper;

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
		example.selectProperties("id", "user_name", "email", "create_time",
				"status", "apikey", "seckey", "real_name", "alipay_account",
				"invite_user_id");
		// TODO
		if (null != user) {
			Example.Criteria criteria = example.createCriteria();
			// TODO
			String user_name = StringUtil.isEmpty(user.getUser_name());
			if (null != user_name) {
				criteria.andLike("user_name", "%" + user_name + "%");
			}

			// TODO
			String apikey = StringUtil.isEmpty(user.getApikey());
			if (null != apikey) {
				criteria.andEqualTo("apikey", apikey);
			}

			// TODO
			String seckey = StringUtil.isEmpty(user.getSeckey());
			if (null != seckey) {
				criteria.andEqualTo("seckey", seckey);
			}

			String invite_user_id = StringUtil
					.isEmpty(user.getInvite_user_id());
			if (null != invite_user_id) {
				criteria.andEqualTo("invite_user_id", invite_user_id);
			}
		}
		PageHelper.startPage(page, rows);
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
			result += super.updateNotNull(user);
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
		user.setUser_pass(null == user.getUser_pass() ? DEFAULT_USER_PASS : MD5
				.encode(user.getUser_pass()));

		user.setApikey(genUserApiKey());
		user.setSeckey(genUserSecKey());

		user.setDevice_code(null);

		// TODO
		save(user);

		return null;
	}

	@Override
	public int updateNotNull(User user) {
		user.setUser_name(null);
		user.setUser_pass(null);
		user.setCreate_time(null);

		user.setApikey(genUserApiKey());
		user.setSeckey(genUserSecKey());

		user.setDevice_code(null);

		// TODO
		return super.updateNotNull(user);
	}

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

	private String genUserApiKey() {
		String encodedKey = null;
		User user = null;
		do {
			encodedKey = RestUtil.genApiKey();
			user = findByApiKey(encodedKey);
		} while (user != null);
		return encodedKey;
	}

	private String genUserSecKey() {
		String encodedKey = null;
		User user = null;
		do {
			encodedKey = RestUtil.genApiKey();
			user = findBySecKey(encodedKey);
		} while (user != null);
		return encodedKey;
	}

	@Override
	public User findByApiKey(String apikey) {
		apikey = StringUtil.isEmpty(apikey);
		if (null == apikey)
			return null;

		User user = new User();
		user.setApikey(apikey);

		List<User> list = findByUser(user, 1, Integer.MAX_VALUE);

		return (null == list || 1 != list.size()) ? null : list.get(0);
	}

	@Override
	public User findBySecKey(String seckey) {
		seckey = StringUtil.isEmpty(seckey);
		if (null == seckey)
			return null;

		User user = new User();
		user.setSeckey(seckey);

		List<User> list = findByUser(user, 1, Integer.MAX_VALUE);

		return (null == list || 1 != list.size()) ? null : list.get(0);
	}

	@Override
	public List<User> findByInviteUserId(String invite_user_id) {
		invite_user_id = StringUtil.isEmpty(invite_user_id);
		if (null == invite_user_id)
			return null;

		User user = new User();
		user.setInvite_user_id(invite_user_id);

		return findByUser(user, 1, Integer.MAX_VALUE);
	}
}
