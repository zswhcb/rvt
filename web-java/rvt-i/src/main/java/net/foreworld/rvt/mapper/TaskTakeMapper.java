package net.foreworld.rvt.mapper;

import java.util.Date;
import java.util.List;

import net.foreworld.rvt.model.TaskTake;
import net.foreworld.rvt.util.MyMapper;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
public interface TaskTakeMapper extends MyMapper<TaskTake> {
	List<TaskTake> findByTaskId(String task_id);

	List<TaskTake> findByUserId(String user_id, Date create_time);
}