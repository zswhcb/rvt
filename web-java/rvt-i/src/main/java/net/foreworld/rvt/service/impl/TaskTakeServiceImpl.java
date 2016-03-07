package net.foreworld.rvt.service.impl;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import net.foreworld.rvt.mapper.TaskTakeMapper;
import net.foreworld.rvt.model.TaskTake;
import net.foreworld.rvt.service.TaskTakeService;
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
@Service("taskTakeService")
public class TaskTakeServiceImpl extends BaseService<TaskTake> implements
		TaskTakeService {

	@Override
	public List<TaskTake> findByTaskId(String task_id) {
		task_id = StringUtil.isEmpty(task_id);
		return null == task_id ? null : ((TaskTakeMapper) getMapper())
				.findByTaskId(task_id);
	}

	@Override
	public List<TaskTake> findByTaskTake(TaskTake taskTake, int page, int rows) {
		Example example = new Example(TaskTake.class);
		example.setOrderByClause("create_time desc");
		if (null != taskTake) {
			Example.Criteria criteria = example.createCriteria();

			// TODO
			String user_id = StringUtil.isEmpty(taskTake.getUser_id());
			if (null != user_id) {
				criteria.andEqualTo("user_id", user_id);
			}

			Date create_time = taskTake.getCreate_time();
			if (null != create_time) {
				criteria.andGreaterThan("create_time",
						DateUtil.date2Str("yyyy-MM", create_time));
				criteria.andLessThan("create_time", DateUtil.date2Str(
						"yyyy-MM", DateUtil.getRelativeDate(create_time,
								Calendar.MONTH, 1)));
			}
		}
		PageHelper.startPage(page, rows);
		return selectByExample(example);
	}

	@Override
	public List<TaskTake> findByUserId(String user_id, Date create_time) {
		if (null == create_time)
			return null;

		user_id = StringUtil.isEmpty(user_id);

		if (null == user_id)
			return null;

		return ((TaskTakeMapper) getMapper())
				.findByUserId(user_id, create_time);
	}
}