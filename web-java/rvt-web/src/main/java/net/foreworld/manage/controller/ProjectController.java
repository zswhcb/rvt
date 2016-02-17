package net.foreworld.manage.controller;

import java.util.List;

import net.foreworld.manage.model.Project;
import net.foreworld.manage.service.ProjectService;

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
public class ProjectController {

	@Autowired
	private ProjectService projectService;

	private String index_ftl = "project/1.0.1/index";

	@RequestMapping(value = { "/project/" }, method = RequestMethod.GET)
	public ModelAndView indexUI() {
		ModelAndView result = new ModelAndView(index_ftl);
		// TODO
		List<Project> list = projectService.selectByExample(new Example(
				Project.class));
		result.addObject("data_projects", list);

		return result;
	}
}