package net.foreworld.rvt.service;

import java.util.Date;
import java.util.List;

import net.foreworld.rvt.model.TaskTake;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
public interface TaskTakeService extends IService<TaskTake> {
	List<TaskTake> findByTaskId(String task_id);

	List<TaskTake> findByTaskTake(TaskTake taskTake, int page, int rows);

	List<TaskTake> findByUserId(String user_id, Date create_time);
}