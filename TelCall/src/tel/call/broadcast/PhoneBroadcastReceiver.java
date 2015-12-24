package tel.call.broadcast;

import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;

import org.json.JSONException;
import org.json.JSONObject;

import tel.call.R;
import tel.call.action.ServiceAction;
import tel.call.util.HttpUtil;
import tel.call.util.HttpUtil.RequestMethod;
import tel.call.util.RestUtil;
import tel.call.util.UserInfo;
import android.annotation.SuppressLint;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.database.Cursor;
import android.os.Handler;
import android.os.Message;
import android.provider.CallLog.Calls;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.util.Log;

/**
 * 
 * @author huangxin (3203317@qq.com)
 * 
 */
public class PhoneBroadcastReceiver extends BroadcastReceiver {
	private static final String TAG = PhoneBroadcastReceiver.class
			.getSimpleName();

	private static final String[] porjection = new String[] { Calls.TYPE,
			Calls.NUMBER, Calls.DATE, Calls.DURATION };

	private OnePhoneStateListener listener;

	private UserInfo app;
	private String httpUrl;

	private SharedPreferences preferences;

	@SuppressWarnings("static-access")
	@Override
	public void onReceive(Context ctx, Intent intent) {
		if (intent.getAction().equals(Intent.ACTION_NEW_OUTGOING_CALL)) {
			app = (UserInfo) ctx.getApplicationContext();
			httpUrl = ctx.getString(R.string.httpUrl);
			preferences = ctx.getSharedPreferences("upload",
					ctx.getApplicationContext().MODE_PRIVATE);

			String telNum = intent.getStringExtra(Intent.EXTRA_PHONE_NUMBER);
			// TODO
			TelephonyManager tm = (TelephonyManager) ctx
					.getSystemService(Service.TELEPHONY_SERVICE);
			// TODO
			if (null == listener)
				listener = new OnePhoneStateListener(ctx);
			// TODO
			listener.setTelNum(telNum);
			listener.setCallTime(new Date());
			tm.listen(listener, PhoneStateListener.LISTEN_CALL_STATE);
		}
	}

	@Override
	public void finalize() throws Throwable {
		if (null != listener)
			listener = null;
		super.finalize();
	}

	@SuppressLint("HandlerLeak")
	private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			switch (msg.what) {
			case ServiceAction.COMMITTASK:
				commitTask(msg);
				break;
			default:
				break;
			}
		}

		private void remove() {
			Editor editor = preferences.edit();
			editor.remove("id");
			editor.remove("TALK_TIME_LEN");
			editor.remove("TALK_TIME");
			editor.remove("TEL_NUM");
			editor.commit();
		}

		private void commitTask(Message msg) {
			// TODO
			if (null == msg.obj) {
				return;
			}

			// TODO
			try {
				JSONObject _jo = new JSONObject((String) msg.obj);
				// TODO
				if (!_jo.getBoolean("success")) {
				}

				remove();
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
	};

	private void commitTask(String TEL_NUM, long TALK_TIME, int TALK_TIME_LEN) {
		if (!TEL_NUM.equals(app.getCallInfo().getTel_num())
				|| TALK_TIME_LEN < app.getCallInfo().getTalk_time_len())
			return;

		HashMap<String, String> _params = new HashMap<String, String>();
		// TODO
		_params.put("apikey", app.getApikey());
		_params.put("command", "commitTask");
		long ts = (new Date()).getTime() + app.getTs();
		_params.put("ts", Long.toString(ts));

		// TODO
		try {
			JSONObject jo = new JSONObject();
			jo.put("id", app.getCallInfo().getHandtask_id());
			jo.put("TALK_TIME_LEN", TALK_TIME_LEN);
			jo.put("TALK_TIME", TALK_TIME);
			jo.put("TEL_NUM", TEL_NUM);
			String data = jo.toString();
			_params.put("data", URLEncoder.encode(data, "UTF-8"));

			String params = URLEncoder
					.encode("apikey=" + app.getApikey()
							+ "&command=commitTask&data=" + data + "&ts=" + ts,
							"UTF-8");
			_params.put("signature", RestUtil.standard(params, app.getSeckey()));

			// TODO
			Editor editor = preferences.edit();
			editor.putString("id", app.getCallInfo().getHandtask_id());
			editor.putInt("TALK_TIME_LEN", TALK_TIME_LEN);
			editor.putLong("TALK_TIME", TALK_TIME);
			editor.putString("TEL_NUM", TEL_NUM);
			editor.commit();
		} catch (Exception e) {
			e.printStackTrace();
			return;
		} finally {
			app.setCallInfo(null);
		}

		// TODO
		HttpUtil _hu = new HttpUtil(ServiceAction.COMMITTASK, handler, httpUrl
				+ "api", RequestMethod.POST, _params);
		Thread _t = new Thread(_hu);
		_t.start();
	}

	private void findLast(Context ctx, String telNum, long callTime) {
		Cursor cursor = null;
		// TODO
		try {
			cursor = ctx.getContentResolver().query(
					Calls.CONTENT_URI,
					porjection,
					Calls.TYPE + "=" + Calls.OUTGOING_TYPE + " AND "
							+ Calls.NUMBER + "=? AND " + Calls.DATE + ">"
							+ callTime + " AND 0<" + Calls.DURATION,
					new String[] { telNum }, "DATE DESC LIMIT 1");
			// TODO
			if (cursor.moveToFirst()) {
				Log.i(TAG,
						"===========" + cursor.getString(0) + ","
								+ cursor.getString(1) + ","
								+ cursor.getString(2) + ","
								+ cursor.getString(3));

				commitTask(cursor.getString(1), cursor.getLong(2),
						cursor.getInt(3));
			} else {
				Log.i(TAG, "===========no");
			}
		} catch (Exception e) {
			Log.e(TAG, e.getMessage());
		} finally {
			if (null != cursor)
				cursor.close();
		}
	}

	private class OnePhoneStateListener extends PhoneStateListener {
		private String telNum;
		private Date callTime;
		private Context ctx;

		public OnePhoneStateListener(Context ctx) {
			this.ctx = ctx;
		}

		public void setTelNum(String telNum) {
			this.telNum = telNum;
		}

		public void setCallTime(Date callTime) {
			this.callTime = callTime;
		}

		@Override
		public void onCallStateChanged(int state, String incomingNumber) {
			super.onCallStateChanged(state, incomingNumber);
			switch (state) {
			case TelephonyManager.CALL_STATE_IDLE: // 挂断
				findLast(ctx, telNum, callTime.getTime());
				break;
			case TelephonyManager.CALL_STATE_OFFHOOK: // 接听
				break;
			case TelephonyManager.CALL_STATE_RINGING: // 响铃
				break;
			}
		}
	};
}
