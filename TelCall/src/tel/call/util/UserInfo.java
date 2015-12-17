package tel.call.util;

import android.app.Application;

/**
 * 
 * @author huangxin (3203317@qq.com)
 * 
 */
public class UserInfo extends Application {

	private String apikey;
	private String seckey;

	public String getApikey() {
		return apikey;
	}

	public void setApikey(String apikey) {
		this.apikey = apikey;
	}

	public String getSeckey() {
		return seckey;
	}

	public void setSeckey(String seckey) {
		this.seckey = seckey;
	}
}