package net.foreworld.mybatis.model;

import java.io.Serializable;

/**
 *
 * @author huangxin (3203317@qq.com)
 *
 */
public class User implements Serializable {
	private static final long serialVersionUID = -163023974445328861L;

	private String userName;
	private String userPass;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserPass() {
		return userPass;
	}

	public void setUserPass(String userPass) {
		this.userPass = userPass;
	}
}
