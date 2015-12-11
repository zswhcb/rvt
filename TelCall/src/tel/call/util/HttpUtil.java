package tel.call.util;

import java.io.IOException;
import java.net.HttpURLConnection;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import android.os.Message;
import android.util.Log;

/**
 * 
 * @author huangxin (3203317@qq.com)
 * 
 */
public class HttpUtil {
	private final static String TAG = "HttpUtil";

	/**
	 * 
	 * @param url
	 * @param what
	 * @return
	 */
	public static Message get(String url, int what) {
		HttpGet req = new HttpGet(url);
		// TODO
		try {
			HttpResponse res = new DefaultHttpClient().execute(req);
			if (HttpURLConnection.HTTP_OK == res.getStatusLine()
					.getStatusCode()) {
				HttpEntity entity = res.getEntity();
				String str = EntityUtils.toString(entity, "utf-8");
				// TODO
				Message msg = new Message();
				msg.what = what;
				msg.obj = str;
				return msg;
			}
		} catch (ClientProtocolException e) {
			Log.i(TAG, e.getMessage());
		} catch (IOException e) {
			Log.i(TAG, e.getMessage());
		}
		return null;
	}
}
