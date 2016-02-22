package net.foreworld.rvt.controller;

import java.util.Date;
import java.util.HashMap;
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

	@ResponseBody
	@RequestMapping(value = { "/user/add" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> add(User user) {
		Map<String, Object> result = new HashMap<String, Object>();

		// TODO
		String[] msg = userService.saveNew(user);
		if (null != msg) {
			result.put("msg", msg);
			result.put("success", false);
			return result;
		}

		result.put("success", true);
		return result;
	}

	@ResponseBody
	@RequestMapping(value = { "/user/list" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> list(User user,
			@RequestParam(required = false, defaultValue = "1") int page,
			@RequestParam(required = false, defaultValue = "10") int rows) {
		Map<String, Object> result = new HashMap<String, Object>();
		// TODO
		List<User> list = userService.findByUser(user, page, rows);

		result.put("data", list);
		result.put("success", true);
		return result;
	}

	@RequestMapping(value = { "/user/edit" }, method = RequestMethod.GET)
	public String editUI(Map<String, Object> map,
			@RequestParam(required = true) String id) {
		User user = userService.selectByKey(id);
		// TODO
		if (null == user)
			return "redirect:/user/";
		// TODO
		map.put("data_user", user);
		return "user/1.0.1/edit";
	}

	@ResponseBody
	@RequestMapping(value = { "/user/edit" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> edit(User user) {
		Map<String, Object> result = new HashMap<String, Object>();
		// TODO
		userService.updateNotNull(user);
		// TODO
		result.put("success", true);
		return result;
	}

	@ResponseBody
	@RequestMapping(value = { "/user/remove" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> remove(@RequestParam(required = true) String ids) {
		Map<String, Object> result = new HashMap<String, Object>();
		// TODO
		userService.deleteByKeys(ids);
		result.put("success", true);
		return result;
	}

	@ResponseBody
	@RequestMapping(value = { "/user/resetPwd" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> resetPwd(
			@RequestParam(required = true) String ids) {
		Map<String, Object> result = new HashMap<String, Object>();
		// TODO
		userService.resetPwdByKeys(ids);
		result.put("success", true);
		return result;
	}
}
