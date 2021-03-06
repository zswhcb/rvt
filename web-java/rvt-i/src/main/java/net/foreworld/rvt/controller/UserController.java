package net.foreworld.rvt.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.http.HttpSession;

import net.foreworld.rvt.model.Task;
import net.foreworld.rvt.model.User;
import net.foreworld.rvt.service.TaskService;
import net.foreworld.rvt.service.TaskTakeService;
import net.foreworld.rvt.service.UserService;
import net.foreworld.util.StringUtil;
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
	@Autowired
	private TaskService taskService;
	@Autowired
	public TaskTakeService taskTakeService;

	@RequestMapping(value = { "/login" }, method = RequestMethod.GET)
	public ModelAndView loginUI() {
		ModelAndView result = new ModelAndView("user/1.0.1/login");
		return result;
	}

	@RequestMapping(value = { "/task" }, method = RequestMethod.GET)
	public ModelAndView taskUI(HttpSession session,
			@RequestParam(required = false) String id) {
		ModelAndView result = new ModelAndView("user/1.0.1/task");

		// TODO
		Task task = new Task();
		task.setCreate_user_id(session.getAttribute("session.user.id")
				.toString());

		List<Task> list = taskService.findByTask(task, 1, Integer.MAX_VALUE);
		result.addObject("data_tasks", list);

		if (null != list && 0 < list.size()) {
			Task _task = list.get(0);
			// TODO
			id = StringUtil.isEmpty(id);
			result.addObject("data_task_id", id);
			result.addObject("data_tasktakes", taskTakeService
					.findByTaskId((null == id) ? _task.getId() : id));
		}

		return result;
	}

	@RequestMapping(value = { "/invite" }, method = RequestMethod.GET)
	public ModelAndView inviteUI(HttpSession session) {
		ModelAndView result = new ModelAndView("user/1.0.1/invite");

		// TODO
		User user = (User) session.getAttribute("session.user");
		result.addObject("data_session_user", user);

		List<User> list = userService.findByInviteUserId(user.getId());
		result.addObject("data_users", list);

		return result;
	}

	@RequestMapping(value = { "/register" }, method = RequestMethod.GET)
	public ModelAndView registerUI() {
		ModelAndView result = new ModelAndView("user/1.0.1/register");
		return result;
	}

	@ResponseBody
	@RequestMapping(value = { "/register" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> register(User user) {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("success", false);

		// TODO
		String user_name = StringUtil.isEmpty(user.getUser_name());
		if (null == user_name) {
			result.put("msg", new String[] { "手机号不能为空" });
			return result;
		}

		String regex = "^1([\\d]{10})$";
		Pattern p = Pattern.compile(regex);
		if (!p.matcher(user_name).find()) {
			result.put("msg", new String[] { "请输入正确的手机号" });
			return result;
		}
		user.setUser_name(user_name);

		// TODO
		String invite_user_id = StringUtil.isEmpty(user.getInvite_user_id());
		if (null == invite_user_id) {
			result.put("msg", new String[] { "邀请码不能为空" });
			return result;
		}
		user.setInvite_user_id(invite_user_id);

		// TODO
		String user_pass = StringUtil.isEmpty(user.getUser_pass());
		if (null == user_pass) {
			result.put("msg", new String[] { "密码不能为空" });
			return result;
		}
		user.setUser_pass(user_pass);

		User _user = userService.findByName(user.getUser_name());
		if (null != _user) {
			result.put("msg", new String[] { "该手机号已经注册过" });
			return result;
		}

		User __user = userService.selectByKey(user.getInvite_user_id());
		if (null == __user) {
			result.put("msg", new String[] { "请输入正确的邀请码" });
			return result;
		}

		// TODO
		userService.save(user);
		result.put("success", true);

		return result;
	}

	@RequestMapping(value = { "/info" }, method = RequestMethod.GET)
	public ModelAndView infoUI(HttpSession session) {
		ModelAndView result = new ModelAndView("user/1.0.1/info");
		// TODO
		String id = session.getAttribute("session.user.id").toString();
		User user = userService.selectByKey(id);

		result.addObject("data_user", user);
		return result;
	}

	@RequestMapping(value = { "/info" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> info(HttpSession session, User user) {
		Map<String, Object> result = new HashMap<String, Object>();

		// TODO
		User _user = (User) session.getAttribute("session.user");
		user.setId(_user.getId());

		userService.updateNotNull(user);
		result.put("success", true);
		return result;
	}

	@RequestMapping(value = { "/changePwd" }, method = RequestMethod.GET)
	public ModelAndView changePwdUI() {
		ModelAndView result = new ModelAndView("user/1.0.1/changePwd");
		return result;
	}

	@RequestMapping(value = { "/changePwd" }, method = RequestMethod.POST, produces = "application/json")
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

	@RequestMapping(value = { "/logout" }, method = RequestMethod.GET)
	public String logoutUI(HttpSession session) {
		session.invalidate();
		return "redirect:/login";
	}

	@ResponseBody
	@RequestMapping(value = { "/login" }, method = RequestMethod.POST, produces = "application/json")
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
