package net.foreworld.rvt.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 *
 * @author huangxin (3203317@qq.com)
 * @license LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @copyright FOREWORLD.NET
 *
 */
@Table(name = "r_project_task")
public class Project_Task implements Serializable {
	private static final long serialVersionUID = -9168663455251260357L;

	@Id
	@Column(name = "id")
	@GeneratedValue(generator = "UUID")
	private String id;

	private String task_name;
	private String task_intro;
	private String sms_intro;
	private Integer task_sum;
	private String project_id;

	private Integer talk_timeout;
	private Integer talk_time_len;
	private Date start_time;
	private Date end_time;

	private String create_user_id;
	private Date create_time;
	private Integer status;

	public String getTask_name() {
		return task_name;
	}

	public void setTask_name(String task_name) {
		this.task_name = task_name;
	}

	public String getTask_intro() {
		return task_intro;
	}

	public void setTask_intro(String task_intro) {
		this.task_intro = task_intro;
	}

	public String getSms_intro() {
		return sms_intro;
	}

	public void setSms_intro(String sms_intro) {
		this.sms_intro = sms_intro;
	}

	public Integer getTask_sum() {
		return task_sum;
	}

	public void setTask_sum(Integer task_sum) {
		this.task_sum = task_sum;
	}

	public String getProject_id() {
		return project_id;
	}

	public void setProject_id(String project_id) {
		this.project_id = project_id;
	}

	public Integer getTalk_timeout() {
		return talk_timeout;
	}

	public void setTalk_timeout(Integer talk_timeout) {
		this.talk_timeout = talk_timeout;
	}

	public Integer getTalk_time_len() {
		return talk_time_len;
	}

	public void setTalk_time_len(Integer talk_time_len) {
		this.talk_time_len = talk_time_len;
	}

	public Date getStart_time() {
		return start_time;
	}

	public void setStart_time(Date start_time) {
		this.start_time = start_time;
	}

	public Date getEnd_time() {
		return end_time;
	}

	public void setEnd_time(Date end_time) {
		this.end_time = end_time;
	}

	public String getCreate_user_id() {
		return create_user_id;
	}

	public void setCreate_user_id(String create_user_id) {
		this.create_user_id = create_user_id;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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
