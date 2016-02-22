package net.foreworld.rvt.service;

import java.util.List;

import net.foreworld.rvt.model.Project;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
public interface ProjectService extends IService<Project> {

	List<Project> findByProject(Project project, int page, int rows);
}
