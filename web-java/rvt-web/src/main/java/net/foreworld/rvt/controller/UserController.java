package net.foreworld.rvt.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import net.foreworld.rvt.model.User;
import net.foreworld.rvt.service.UserService;
import net.foreworld.util.encryptUtil.MD5;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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

	private String index_ftl = "user/1.0.1/index";
	private String login_ftl = "user/1.0.1/login";
	private String changePwd_ftl = "user/1.0.1/changePwd";

	@RequestMapping(value = { "/user/login" }, method = RequestMethod.GET)
	public ModelAndView loginUI() {
		ModelAndView result = new ModelAndView(login_ftl);
		return result;
	}

	@RequestMapping(value = { "/user/changePwd" }, method = RequestMethod.GET)
	public ModelAndView changePwdUI() {
		ModelAndView result = new ModelAndView(changePwd_ftl);
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
		result.addObject("success", false);

		User _user = userService.findByName(user.getUser_name());

		if (null == _user) {
			result.addObject("msg", new String[] { "用户名或密码输入错误", "user_name" });
			return result;
		} // END

		String user_pass = MD5.encode(user.getUser_pass());

		if (!user_pass.equals(_user.getUser_pass())) {
			result.addObject("msg", new String[] { "用户名或密码输入错误", "user_pass" });
			return result;
		} // END

		session.setAttribute("session.user", _user);
		session.setAttribute("session.time", (new Date()).toString());
		// TODO
		result.addObject("success", true);
		return result;
	}

	@RequestMapping(value = { "/user/" }, method = RequestMethod.GET)
	public ModelAndView indexUI(User user,
			@RequestParam(required = false, defaultValue = "1") int page,
			@RequestParam(required = false, defaultValue = "20") int rows) {
		ModelAndView result = new ModelAndView(index_ftl);
		List<User> list = userService.findByUser(user, page, rows);
		result.addObject("data_users", list);
		return result;
	}

	@RequestMapping(value = { "/user/add" }, method = RequestMethod.GET)
	public ModelAndView addUI() {
		ModelAndView result = new ModelAndView("user/1.0.1/add");
		return result;
	}

	@RequestMapping(value = { "/user/add" }, method = RequestMethod.POST, produces = "application/json")
	public ModelAndView add(User user) {
		ModelAndView result = new ModelAndView();

		// TODO
		String[] msg = userService.saveNew(user);
		if (null != msg) {
			result.addObject("msg", msg);
			result.addObject("success", false);
			return result;
		}

		result.addObject("success", true);
		return result;
	}

	@RequestMapping(value = { "/user/edit" }, method = RequestMethod.GET)
	public String editUI(Map<String, Object> map,
			@RequestParam(required = true) String id) {
		User user = userService.selectByKey(id);

		if (null == user)
			return "redirect:/user/";

		map.put("data_user", user);
		return "user/1.0.1/edit";
	}

	@RequestMapping(value = { "/user/edit" }, method = RequestMethod.POST, produces = "application/json")
	public ModelAndView edit(User user) {
		ModelAndView result = new ModelAndView();

		// TODO
		userService.updateNotNull(user);

		result.addObject("success", true);
		return result;
	}

	@RequestMapping(value = { "/user/remove" }, method = RequestMethod.POST, produces = "application/json")
	public ModelAndView remove(@RequestParam(required = true) String ids) {
		ModelAndView result = new ModelAndView();
		// TODO
		userService.deleteByKeys(ids);
		result.addObject("success", true);
		return result;
	}

	@RequestMapping(value = { "/user/resetPwd" }, method = RequestMethod.POST, produces = "application/json")
	public ModelAndView resetPwd(@RequestParam(required = true) String ids) {
		ModelAndView result = new ModelAndView();
		// TODO
		userService.resetPwdByKeys(ids);
		result.addObject("success", true);
		return result;
	}
}
