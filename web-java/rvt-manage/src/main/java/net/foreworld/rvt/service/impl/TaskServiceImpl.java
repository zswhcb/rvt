package net.foreworld.rvt.service.impl;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import net.foreworld.rvt.model.Task;
import net.foreworld.rvt.service.TaskService;
import net.foreworld.util.DateUtil;
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
		}
		PageHelper.startPage(page, rows);
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

	@Override
	public List<Task> findByStartTime(Date start_time) {
		Example example = new Example(Task.class);
		example.setOrderByClause("create_time desc");

		// TODO
		Example.Criteria criteria = example.createCriteria();
		criteria.andGreaterThan("start_time",
				DateUtil.date2Str(null, start_time));
		criteria.andLessThan(
				"start_time",
				DateUtil.date2Str(null,
						DateUtil.getRelativeDate(start_time, Calendar.DATE, 1)));

		// TODO
		return selectByExample(example);
	}
}