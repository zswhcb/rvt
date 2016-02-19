package net.foreworld.rvt.service.impl;

import java.util.Date;
import java.util.List;

import net.foreworld.rvt.model.Task;
import net.foreworld.rvt.service.TaskService;

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
	public List<Task> findByTask(Task task, int page, int rows) {
		Example example = new Example(Task.class);
		example.setOrderByClause("create_time desc");
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
