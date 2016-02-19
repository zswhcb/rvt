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
@Table(name = "r_project")
public class Project implements Serializable {

	private static final long serialVersionUID = 7610261318050072974L;

	@Id
	@Column(name = "id")
	@GeneratedValue(generator = "UUID")
	private String id;

	private String project_name;
	private String project_intro;
	private Integer project_type_id;
	private String tel_num;

	private Date create_time;
	private Integer status;

	public String getProject_name() {
		return project_name;
	}

	public void setProject_name(String project_name) {
		this.project_name = project_name;
	}

	public String getProject_intro() {
		return project_intro;
	}

	public void setProject_intro(String project_intro) {
		this.project_intro = project_intro;
	}

	public Integer getProject_type_id() {
		return project_type_id;
	}

	public void setProject_type_id(Integer project_type_id) {
		this.project_type_id = project_type_id;
	}

	public String getTel_num() {
		return tel_num;
	}

	public void setTel_num(String tel_num) {
		this.tel_num = tel_num;
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
