package net.foreworld.rvt.controller;

import java.util.Date;

import javax.servlet.http.HttpSession;

import net.foreworld.rvt.model.TaskTake;
import net.foreworld.rvt.service.TaskTakeService;
import net.foreworld.rvt.util.WebContext;
import net.foreworld.util.DateUtil;

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
public class DefaultController {

	@Autowired
	public TaskTakeService taskTakeService;

	@RequestMapping(value = { "/" }, method = RequestMethod.GET)
	public ModelAndView indexUI(HttpSession session) {
		Object obj = session.getAttribute("session.user");
		if (null == obj) {
			return new ModelAndView("redirect:"
					+ WebContext.CONF_HTML_VIRTUALPATH + "login");
		} // END
		ModelAndView result = new ModelAndView("default/1.0.2/index");
		// TODO
		result.addObject("data_session_user", obj);
		result.addObject("data_session_time",
				session.getAttribute("session.time"));
		return result;
	}

	@RequestMapping(value = { "/welcome" }, method = RequestMethod.GET)
	public ModelAndView welcomeUI(HttpSession session,
			@RequestParam(required = false) String create_time) {
		ModelAndView result = new ModelAndView("default/1.0.2/welcome");

		Date date = DateUtil.checkDateFormat("yyyy-MM", create_time);
		if (null == date)
			date = new Date();

		result.addObject("data_current_time", new Date());
		result.addObject("data_create_time", date);

		TaskTake taskTake = new TaskTake();
		taskTake.setUser_id(session.getAttribute("session.user.id").toString());
		taskTake.setCreate_time(date);

		result.addObject("data_tasktakes",
				taskTakeService.findByTaskTake(taskTake, 1, Integer.MAX_VALUE));
		return result;
	}
}