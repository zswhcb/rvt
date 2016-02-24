package net.foreworld.rvt.service.impl;

import java.util.List;

import net.foreworld.rvt.model.TaskTake;
import net.foreworld.rvt.service.TaskTakeService;
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
@Service("taskTakeService")
public class TaskTakeServiceImpl extends BaseService<TaskTake> implements
		TaskTakeService {

	@Override
	public List<TaskTake> findByTaskId(String task_id) {
		task_id = StringUtil.isEmpty(task_id);
		if (null == task_id)
			return null;

		Example example = new Example(TaskTake.class);
		example.setOrderByClause("create_time desc");
		Example.Criteria criteria = example.createCriteria();
		criteria.andEqualTo("task_id", task_id);

		List<TaskTake> list = selectByExample(example);

		return list;
	}
}