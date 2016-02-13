package net.foreworld.manage.controller;

import java.util.List;

import net.foreworld.manage.model.Menu;
import net.foreworld.manage.service.MenuService;

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
public class MenuController {

	@Autowired
	private MenuService menuService;

	private String index_ftl = "menu/1.0.1/index";

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
	public ModelAndView list(Menu menu) {
		ModelAndView result = new ModelAndView();
		// TODO
		List<Menu> list = menuService.findByPid(menu.getPid());
		result.addObject("data", list);
		// TODO
		result.addObject("success", true);
		return result;
	}
}