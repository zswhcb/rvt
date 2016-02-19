package net.foreworld.rvt.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import net.foreworld.rvt.model.Project;
import net.foreworld.rvt.model.Task;
import net.foreworld.rvt.model.User;
import net.foreworld.rvt.service.ProjectService;
import net.foreworld.rvt.service.TaskService;

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
public class TaskController {

	@Autowired
	private TaskService taskService;
	@Autowired
	private ProjectService projectService;

	@RequestMapping(value = { "/task/" }, method = RequestMethod.GET)
	public ModelAndView indexUI(Task task,
			@RequestParam(required = false, defaultValue = "1") int page,
			@RequestParam(required = false, defaultValue = "20") int rows) {
		ModelAndView result = new ModelAndView("task/1.0.1/index");
		// TODO
		List<Task> list = taskService.findByTask(task, page, rows);
		result.addObject("data_tasks", list);
		// TODO
		List<Project> list_project = projectService.findByProject(null, 1,
				Integer.MAX_VALUE);
		result.addObject("data_projects", list_project);
		return result;
	}

	@RequestMapping(value = { "/task/add" }, method = RequestMethod.GET)
	public ModelAndView addUI() {
		ModelAndView result = new ModelAndView("task/1.0.1/add");
		return result;
	}

	@RequestMapping(value = { "/task/edit" }, method = RequestMethod.GET)
	public String editUI(Map<String, Object> map,
			@RequestParam(required = true) String id) {
		Task task = taskService.selectByKey(id);

		if (null == task)
			return "redirect:/task/";

		map.put("data_task", task);
		return "task/1.0.1/edit";
	}

	@ResponseBody
	@RequestMapping(value = { "/task/add" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> add(Task task, HttpSession session) {
		Map<String, Object> result = new HashMap<String, Object>();

		// TODO
		User _user = (User) session.getAttribute("session.user");
		task.setCreate_user_id(_user.getId());

		taskService.save(task);
		result.put("success", true);
		return result;
	}

	@ResponseBody
	@RequestMapping(value = { "/task/edit" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> edit(Task task) {
		Map<String, Object> result = new HashMap<String, Object>();
		// TODO
		taskService.updateNotNull(task);
		// TODO
		result.put("success", true);
		return result;
	}

	@ResponseBody
	@RequestMapping(value = { "/task/remove" }, method = RequestMethod.POST, produces = "application/json")
	public Map<String, Object> remove(@RequestParam(required = true) String ids) {
		Map<String, Object> result = new HashMap<String, Object>();
		// TODO
		taskService.deleteByKeys(ids);
		result.put("success", true);
		return result;
	}
}