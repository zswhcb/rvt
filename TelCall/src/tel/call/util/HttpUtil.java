package tel.call.util;

import java.net.HttpURLConnection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import tel.call.R;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

/**
 * 
 * @author huangxin (3203317@qq.com)
 * 
 */
public class HttpUtil implements Runnable {
	private final static String TAG = "HttpUtil";
	public final static int METHOD_GET = 0;
	public final static int METHOD_POST = 1;
	// TODO
	private Handler handler;
	private String url;
	private int method;
	private HashMap<String, String> params;
	// TODO
	private Message msg;

	/**
	 * 
	 * @param what
	 * @param handler
	 * @param url
	 * @param params
	 */
	public HttpUtil(int what, Handler handler, String url, int method,
			HashMap<String, String> params) {
		this.handler = handler;
		this.url = url;
		this.method = method;
		this.params = params;
		// TODO
		msg = new Message();
		msg.what = what;
	}

	/**
	 * 
	 */
	private void get(String params) {
		// TODO
		msg.arg1 = R.string.valiate_network;
		// TODO
		url += "?" + params;
		Log.i(TAG, url);
		HttpGet req = new HttpGet(url);
		// TODO
		try {
			HttpResponse res = new DefaultHttpClient().execute(req);
			if (HttpURLConnection.HTTP_OK == res.getStatusLine()
					.getStatusCode()) {
				HttpEntity entity = res.getEntity();
				String str = EntityUtils.toString(entity, "utf-8");
				// TODO
				Log.i(TAG, str);
				msg.obj = str;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		handler.sendMessage(msg);
	}

	/**
	 * 
	 */
	private void post() {
		// TODO
	}

	@Override
	public void run() {
		// TODO
		Iterator<Entry<String, String>> it = params.entrySet().iterator();
		// TODO
		if (METHOD_GET == method) {
			String params = "";
			// TODO
			while (it.hasNext()) {
				Entry<String, String> entry = it.next();
				params += "&" + entry.getKey() + "=" + entry.getValue();
			}
			get(params.substring(0 == params.length() ? 0 : 1));
		} else
			post();
	}
}
