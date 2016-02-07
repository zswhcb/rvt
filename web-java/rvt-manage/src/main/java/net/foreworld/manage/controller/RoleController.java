package net.foreworld.manage.controller;

import java.util.List;

import net.foreworld.manage.model.Role;
import net.foreworld.manage.service.RoleService;

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
public class RoleController {

	@Autowired
	private RoleService roleService;

	private String index_ftl = "role/1.0.1/index";

	@RequestMapping(value = { "/role/" }, method = RequestMethod.GET)
	public ModelAndView indexUI() {
		ModelAndView result = new ModelAndView(index_ftl);

		List<Role> list = roleService.selectByExample(new Example(Role.class));
		result.addObject("data_roles", list);

		return result;
	}
}