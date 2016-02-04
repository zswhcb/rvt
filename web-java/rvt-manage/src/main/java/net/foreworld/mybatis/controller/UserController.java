package net.foreworld.mybatis.controller;

import java.util.Date;

import javax.servlet.http.HttpSession;

import net.foreworld.mybatis.model.User;
import net.foreworld.mybatis.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
@Controller
public class UserController {

	@Autowired
	private UserService userService;

	private String login_ftl = "user/1.0.1/login";

	@RequestMapping(value = { "/user/login" }, method = RequestMethod.GET)
	public ModelAndView loginUI() {
		ModelAndView result = new ModelAndView(login_ftl);
		// TODO
		User user = userService.findByName("xxfb001");
		result.addObject("user", user);
		return result;
	}

	@RequestMapping(value = { "/user/logout" }, method = RequestMethod.GET)
	public String logoutUI(HttpSession session) {
		session.invalidate();
		return "redirect:/user/login";
	}

	@RequestMapping(value = { "/user/login" }, method = RequestMethod.POST, produces = "application/json")
	public ModelAndView login(User user, HttpSession session) {
		ModelAndView result = new ModelAndView();
		User _user = login(user.getUser_name(), user.getUser_pass());
		// TODO
		if (null != _user) {
			result.addObject("success", true);
			// TODO
			session.setAttribute("session.user", _user);
			session.setAttribute("session.time", (new Date()).toString());
		} else {
			result.addObject("success", false);
			result.addObject("msg", "用户名或密码输入错误");
		} // END
		return result;
	}

	/**
	 * 用户登陆
	 *
	 * @param userName
	 *            用户名
	 * @param userPass
	 *            密码
	 * @return
	 */
	private User login(String userName, String userPass) {
		if ("admin".equals(userName) && "123456".equals(userPass)) {
			User user = new User();
			user.setUser_name("admin");
			user.setUser_pass("123456");
			return user;
		} else if ("huangxin".equals(userName) && "123456".equals(userPass)) {
			User user = new User();
			user.setUser_name("huangxin");
			user.setUser_pass("123456");
			return user;
		}
		return null;
	}
}
