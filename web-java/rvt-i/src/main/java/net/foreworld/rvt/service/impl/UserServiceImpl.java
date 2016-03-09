package net.foreworld.rvt.service.impl;

import java.util.Date;
import java.util.List;

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

		return (null == list || 1 != list.size()) ? null : list.get(0);
	}

	@Override
	public List<User> findByInviteUserId(String invite_user_id) {
		invite_user_id = StringUtil.isEmpty(invite_user_id);
		if (null == invite_user_id)
			return null;

		Example example = new Example(User.class);
		Example.Criteria criteria = example.createCriteria();
		criteria.andEqualTo("invite_user_id", invite_user_id);

		List<User> list = selectByExample(example);

		return list;
	}

	@Override
	public User findByName(String user_name) {
		user_name = StringUtil.isEmpty(user_name);
		if (null == user_name)
			return null;

		Example example = new Example(User.class);
		Example.Criteria criteria = example.createCriteria();
		criteria.andEqualTo("user_name", user_name);

		List<User> list = selectByExample(example);

		return (null == list || 1 != list.size()) ? null : list.get(0);
	}

	@Override
	public int updateNotNull(User user) {
		user.setUser_name(null);
		user.setUser_pass(null);
		user.setCreate_time(null);

		user.setStatus(null);
		user.setApikey(null);
		user.setSeckey(null);
		user.setInvite_user_id(null);

		// TODO
		return super.updateNotNull(user);
	}

	@Override
	public int save(User user) {
		user.setRole_id("e4acb256cafa4cb487fa6abf508df073");
		user.setUser_pass(MD5.encode(user.getUser_pass()));
		user.setCreate_time(new Date());
		user.setStatus(1);

		user.setApikey(genUserApiKey());
		user.setSeckey(genUserSecKey());

		return super.save(user);
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

	private User findBySecKey(String seckey) {
		seckey = StringUtil.isEmpty(seckey);
		if (null == seckey)
			return null;

		User user = new User();
		user.setSeckey(seckey);

		List<User> list = findByUser(user, 1, Integer.MAX_VALUE);

		return (null == list || 1 != list.size()) ? null : list.get(0);
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

	private User findByApiKey(String apikey) {
		apikey = StringUtil.isEmpty(apikey);
		if (null == apikey)
			return null;

		User user = new User();
		user.setApikey(apikey);

		List<User> list = findByUser(user, 1, Integer.MAX_VALUE);

		return (null == list || 1 != list.size()) ? null : list.get(0);
	}

	private List<User> findByUser(User user, int page, int rows) {
		Example example = new Example(User.class);
		example.setOrderByClause("create_time desc");
		example.selectProperties("id", "user_name", "email", "create_time",
				"status", "apikey", "seckey", "real_name", "alipay_account",
				"invite_user_id", "role_id");
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
}
