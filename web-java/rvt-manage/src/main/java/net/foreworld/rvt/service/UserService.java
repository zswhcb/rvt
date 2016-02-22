package net.foreworld.rvt.service;

import java.util.List;

import net.foreworld.rvt.model.User;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
public interface UserService extends IService<User> {

	User findByName(String user_name);

	List<User> findByUser(User user, int page, int rows);

	int resetPwdByKeys(String keys);

	String[] saveNew(User user);

	String[] changePwd(String user_id, String old_pass, String new_pass);

	User findByApiKey(String apikey);

	User findBySecKey(String seckey);
}
