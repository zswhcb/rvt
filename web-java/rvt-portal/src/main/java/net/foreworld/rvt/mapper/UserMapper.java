package net.foreworld.rvt.mapper;

import net.foreworld.rvt.model.User;
import net.foreworld.rvt.util.MyMapper;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
public interface UserMapper extends MyMapper<User> {

	User findByName(String user_name);
}