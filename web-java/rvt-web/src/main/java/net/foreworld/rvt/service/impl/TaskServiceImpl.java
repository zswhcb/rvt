package net.foreworld.rvt.service.impl;

import java.util.Date;
import java.util.List;

import net.foreworld.rvt.model.Task;
import net.foreworld.rvt.service.TaskService;
import net.foreworld.util.StringUtil;

import org.springframework.stereotype.Service;

import tk.mybatis.mapper.entity.Example;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
@Service("taskService")
public class TaskServiceImpl extends BaseService<Task> implements TaskService {

	@Override
	public List<Task> findByTask(Task task) {
		Example example = new Example(Task.class);
		example.setOrderByClause("create_time desc");
		if (null != task) {
			Example.Criteria criteria = example.createCriteria();

			// TODO
			String project_id = StringUtil.isEmpty(task.getProject_id());
			if (null != project_id) {
				criteria.andEqualTo("project_id", project_id);
			}
		}
		return selectByExample(example);
	}

	@Override
	public int save(Task task) {
		task.setId(null);
		task.setCreate_time(new Date());
		return super.save(task);
	}

	@Override
	public int updateNotNull(Task task) {
		task.setCreate_time(null);
		task.setCreate_user_id(null);
		return super.updateNotNull(task);
	}
}
