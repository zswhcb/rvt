package net.foreworld.manage.controller;

import javax.servlet.http.HttpSession;

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
public class DefaultController {

	private String index_ftl = "default/1.0.2/index";

	@RequestMapping(value = { "/" }, method = RequestMethod.GET)
	public ModelAndView indexUI(HttpSession session) {
		Object obj = session.getAttribute("session.user");
		if (null == obj) {
			return new ModelAndView("redirect:/user/login");
		} // END
		ModelAndView result = new ModelAndView(index_ftl);
		// TODO
		result.addObject("data_session_user", obj);
		result.addObject("data_session_time",
				session.getAttribute("session.time"));
		return result;
	}
}
