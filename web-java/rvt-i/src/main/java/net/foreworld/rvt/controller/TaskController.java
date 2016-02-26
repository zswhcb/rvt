package net.foreworld.rvt.controller;

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
public class TaskController {

	@RequestMapping(value = { "/task/monitor/" }, method = RequestMethod.GET)
	public ModelAndView monitorUI() {
		ModelAndView result = new ModelAndView("task/monitor/1.0.1/index");
		return result;
	}
}