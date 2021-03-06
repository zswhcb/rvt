package net.foreworld.rvt.service;

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
}