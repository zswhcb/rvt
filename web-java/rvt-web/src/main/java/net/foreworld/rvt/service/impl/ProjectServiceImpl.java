package net.foreworld.rvt.service.impl;

import java.util.Date;
import java.util.List;

import net.foreworld.rvt.model.Project;
import net.foreworld.rvt.service.ProjectService;

import org.springframework.stereotype.Service;

import tk.mybatis.mapper.entity.Example;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
@Service("projectService")
public class ProjectServiceImpl extends BaseService<Project> implements
		ProjectService {

	@Override
	public int save(Project project) {
		project.setId(null);
		project.setCreate_time(new Date());
		return super.save(project);
	}

	@Override
	public List<Project> findByProject(Project project, int page, int rows) {
		Example example = new Example(Project.class);
		example.setOrderByClause("create_time desc");
		return selectByExample(example);
	}

	@Override
	public int updateNotNull(Project project) {
		project.setCreate_time(null);
		project.setCreate_user_id(null);
		return super.updateNotNull(project);
	}
}
