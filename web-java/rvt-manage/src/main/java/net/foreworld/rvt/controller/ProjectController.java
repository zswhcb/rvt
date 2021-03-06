package net.foreworld.rvt.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import net.foreworld.rvt.model.Project;
import net.foreworld.rvt.service.ProjectService;

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
public class ProjectController {

	@Autowired
	private ProjectService projectService;

	@RequestMapping(value = { "/project/" }, method = RequestMethod.GET)
	public ModelAndView indexUI(Project project,
			@RequestParam(required = false, defaultValue = "1") int page,
			@RequestParam(required = false, defaultValue = "20") int rows) {
		ModelAndView result = new ModelAndView("project/1.0.1/index");
		List<Project> list = projectService.findByProject(project, page, rows);
		result.addObject("data_projects", list);
		return result;
	}

	@RequestMapping(value = { "/project/add" }, method = RequestMethod.GET)
	public ModelAndView addUI() {
		ModelAndView result = new ModelAndView("project/1.0.1/add");
		return result;
	}

	@RequestMapping(value = { "/project/edit" }, method = RequestMethod.GET)
	public String editUI(Map<String, Object> map,
			@RequestParam(required = true) String id) {
		Project project = projectService.selectByKey(id);

		if (null == project)
			return "redirect:/project/";

		map.put("data_project", project);
		return "project/1.0.1/edit";
	}

	@ResponseBody
	@RequestMapping(value = { "/project/add" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> add(Project project, HttpSession session) {
		Map<String, Object> result = new HashMap<String, Object>();
		// TODO
		project.setCreate_user_id(session.getAttribute("session.user.id")
				.toString());
		// TODO
		projectService.save(project);
		result.put("success", true);
		return result;
	}

	@ResponseBody
	@RequestMapping(value = { "/project/edit" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> edit(Project project) {
		Map<String, Object> result = new HashMap<String, Object>();
		// TODO
		projectService.updateNotNull(project);
		// TODO
		result.put("success", true);
		return result;
	}

	@ResponseBody
	@RequestMapping(value = { "/project/remove" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> remove(@RequestParam(required = true) String ids) {
		Map<String, Object> result = new HashMap<String, Object>();
		// TODO
		projectService.deleteByKeys(ids);
		result.put("success", true);
		return result;
	}
}