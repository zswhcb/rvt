package net.foreworld.manage.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.foreworld.manage.model.Menu;
import net.foreworld.manage.service.MenuService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import freemarker.template.Template;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
@Controller
public class MenuController {

	@Autowired
	private MenuService menuService;

	@Autowired
	private FreeMarkerConfigurer freemarkerConfigurer;

	private String index_ftl = "menu/1.0.1/index";
	private String menu_list_ftl = "menu/1.0.1/_pagelet/list.html";

	@RequestMapping(value = { "/menu/" }, method = RequestMethod.GET)
	public ModelAndView indexUI() {
		ModelAndView result = new ModelAndView(index_ftl);
		// TODO
		List<Menu> list = menuService.findByPid(null);
		result.addObject("data_menus", list);
		result.addObject("data_menuTree", list);
		// TODO
		return result;
	}

	@RequestMapping(value = { "/menu/list" }, method = RequestMethod.POST, produces = "application/json")
	public ModelAndView list(Menu menu,
			@RequestParam(required = false, defaultValue = "1") int json) {
		ModelAndView result = new ModelAndView();
		result.addObject("success", true);
		// TODO
		List<Menu> list = menuService.findByPid(menu.getPid());
		// TODO
		if (1 == json) {
			result.addObject("data", list);
		} else {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("data_menus", list);
			// TODO
			try {
				Template template = freemarkerConfigurer.getConfiguration()
						.getTemplate(menu_list_ftl);
				result.addObject("data", FreeMarkerTemplateUtils
						.processTemplateIntoString(template, map));
			} catch (Exception ignore) {
				result.addObject("success", false);
			} // END
		} // END
		return result;
	}
}