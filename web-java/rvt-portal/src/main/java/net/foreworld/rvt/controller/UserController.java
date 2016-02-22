package net.foreworld.rvt.controller;

import java.util.Date;
import java.util.HashMap;
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
import org.springframework.web.bind.annotation.ResponseBody;
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

	@RequestMapping(value = { "/user/login" }, method = RequestMethod.GET)
	public ModelAndView loginUI() {
		ModelAndView result = new ModelAndView("user/1.0.1/login");
		return result;
	}

	@RequestMapping(value = { "/user/invite" }, method = RequestMethod.GET)
	public ModelAndView inviteUI(HttpSession session) {
		ModelAndView result = new ModelAndView("user/1.0.1/invite");

		// TODO
		Object obj = session.getAttribute("session.user");
		result.addObject("data_session_user", obj);

		return result;
	}

	@RequestMapping(value = { "/user/register" }, method = RequestMethod.GET)
	public ModelAndView registerUI() {
		ModelAndView result = new ModelAndView("user/1.0.1/register");
		return result;
	}

	@RequestMapping(value = { "/user/register" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> register(User user) {
		Map<String, Object> result = new HashMap<String, Object>();

		result.put("success", true);
		return result;
	}

	@RequestMapping(value = { "/user/info" }, method = RequestMethod.GET)
	public ModelAndView infoUI(HttpSession session) {
		ModelAndView result = new ModelAndView("user/1.0.1/info");
		// TODO
		String id = session.getAttribute("session.user.id").toString();
		User user = userService.selectByKey(id);

		result.addObject("data_user", user);
		return result;
	}

	@RequestMapping(value = { "/user/info" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> info(HttpSession session, User user) {
		Map<String, Object> result = new HashMap<String, Object>();

		// TODO
		User _user = (User) session.getAttribute("session.user");
		user.setId(_user.getId());

		userService.updateNotNull(user);
		result.put("success", true);
		return result;
	}

	@RequestMapping(value = { "/user/changePwd" }, method = RequestMethod.GET)
	public ModelAndView changePwdUI() {
		ModelAndView result = new ModelAndView("user/1.0.1/changePwd");
		return result;
	}

	@RequestMapping(value = { "/user/changePwd" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> changePwd(HttpSession session,
			@RequestParam(required = true) String old_pass,
			@RequestParam(required = true) String new_pass) {
		Map<String, Object> result = new HashMap<String, Object>();

		// TODO
		String[] msg = userService.changePwd(
				session.getAttribute("session.user.id").toString(), old_pass,
				new_pass);
		if (null != msg) {
			result.put("msg", msg);
			result.put("success", false);
			return result;
		}

		result.put("success", true);
		return result;
	}

	@RequestMapping(value = { "/user/logout" }, method = RequestMethod.GET)
	public String logoutUI(HttpSession session) {
		session.invalidate();
		return "redirect:/user/login";
	}

	@ResponseBody
	@RequestMapping(value = { "/user/login" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> login(User user, HttpSession session) {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("success", false);

		User _user = userService.findByName(user.getUser_name());

		if (null == _user) {
			result.put("msg", new String[] { "用户名或密码输入错误", "user_name" });
			return result;
		} // END

		String user_pass = MD5.encode(user.getUser_pass());

		if (!user_pass.equals(_user.getUser_pass())) {
			result.put("msg", new String[] { "用户名或密码输入错误", "user_pass" });
			return result;
		} // END

		session.setAttribute("session.user", _user);
		session.setAttribute("session.user.id", _user.getId());
		session.setAttribute("session.time", (new Date()).toString());
		// TODO
		result.put("success", true);
		return result;
	}
}
