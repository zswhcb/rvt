package net.foreworld.manage.controller;

import java.util.List;

import net.foreworld.manage.model.Menu;
import net.foreworld.manage.service.MenuService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import tk.mybatis.mapper.entity.Example;

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
		List<Menu> list = menuService.selectByExample(new Example(Menu.class));
		result.addObject("data_menus", list);
		return result;
	}
}