package net.foreworld.rvt.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
@Table(name = "r_project_task_take")
public class TaskTake implements Serializable {
	private static final long serialVersionUID = -5150333155760821478L;

	@Id
	@Column(name = "id")
	@GeneratedValue(generator = "UUID")
	private String id;

	private Date upload_time;
	private Date talk_time;
	private Integer talk_time_len;
	private String task_id;
	private String user_id;

	private Date create_time;
	private Integer status;

	@Transient
	private User user;

	@Transient
	private Project project;

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Date getUpload_time() {
		return upload_time;
	}

	public void setUpload_time(Date upload_time) {
		this.upload_time = upload_time;
	}

	public Date getTalk_time() {
		return talk_time;
	}

	public void setTalk_time(Date talk_time) {
		this.talk_time = talk_time;
	}

	public Integer getTalk_time_len() {
		return talk_time_len;
	}

	public void setTalk_time_len(Integer talk_time_len) {
		this.talk_time_len = talk_time_len;
	}

	public String getTask_id() {
		return task_id;
	}

	public void setTask_id(String task_id) {
		this.task_id = task_id;
	}

	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public Date getCreate_time() {
		return create_time;
	}

	public void setCreate_time(Date create_time) {
		this.create_time = create_time;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}
}
