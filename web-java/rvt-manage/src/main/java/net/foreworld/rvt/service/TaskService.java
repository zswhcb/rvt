package net.foreworld.rvt.service;

import java.util.Date;
import java.util.List;

import net.foreworld.rvt.model.Task;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
public interface TaskService extends IService<Task> {
	List<Task> findByTask(Task task, int page, int rows);

	List<Task> findByStartTime(Date start_time);
}
