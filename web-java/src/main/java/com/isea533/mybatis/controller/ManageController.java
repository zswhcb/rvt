package com.isea533.mybatis.controller;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 *
 * @author huangxin (3203317@qq.com)
 *
 */
@Controller
public class ManageController {

	private String index_ftl = "manage/1.0.2/index";

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
