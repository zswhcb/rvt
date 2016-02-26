package net.foreworld.rvt.service.impl;

import java.util.List;

import net.foreworld.rvt.model.Task;
import net.foreworld.rvt.service.TaskService;
import net.foreworld.util.StringUtil;

import org.springframework.stereotype.Service;

import tk.mybatis.mapper.entity.Example;

import com.github.pagehelper.PageHelper;

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
		if (null != task) {
			Example.Criteria criteria = example.createCriteria();
			// TODO
			String project_id = StringUtil.isEmpty(task.getProject_id());
			if (null != project_id) {
				criteria.andEqualTo("project_id", project_id);
			}
			// TODO
			String create_user_id = StringUtil
					.isEmpty(task.getCreate_user_id());
			if (null != create_user_id) {
				criteria.andEqualTo("create_user_id", create_user_id);
			}
		}
		PageHelper.startPage(page, rows);
		return selectByExample(example);
	}
}
