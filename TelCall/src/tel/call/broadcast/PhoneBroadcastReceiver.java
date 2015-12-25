package tel.call.broadcast;

import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;

import org.json.JSONException;
import org.json.JSONObject;

import tel.call.R;
import tel.call.action.ServiceAction;
import tel.call.util.AppUtil;
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

	private UserInfo userInfo;
	private String httpUrl;
	private SharedPreferences preferences;

	@SuppressWarnings("static-access")
	@Override
	public void onReceive(Context ctx, Intent intent) {
		if (intent.getAction().equals(Intent.ACTION_NEW_OUTGOING_CALL)) {
			// TODO
			userInfo = (UserInfo) ctx.getApplicationContext();
			httpUrl = ctx.getString(R.string.httpUrl);
			preferences = ctx.getSharedPreferences(AppUtil.UN_UPLOAD,
					ctx.getApplicationContext().MODE_PRIVATE);

			// TODO
			String tel_num = intent.getStringExtra(Intent.EXTRA_PHONE_NUMBER);
			// TODO
			TelephonyManager _tm = (TelephonyManager) ctx
					.getSystemService(Service.TELEPHONY_SERVICE);
			// TODO
			if (null == listener)
				listener = new OnePhoneStateListener(ctx);
			// TODO
			listener.setTel_num(tel_num);
			listener.setCall_time(new Date());
			_tm.listen(listener, PhoneStateListener.LISTEN_CALL_STATE);
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
			case ServiceAction.COMMIT_TASK:
				commitTask(msg);
				break;
			default:
				break;
			}
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
				if (!_jo.getBoolean("success"))
					return;

				// TODO
				Editor editor = preferences.edit();
				editor.remove("id");
				editor.commit();
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
	};

	private void commitTask(String tel_num, long talk_time, int talk_time_len) {
		if (null == tel_num
				|| !tel_num.equals(userInfo.getCallInfo().getTel_num())
				|| talk_time_len < userInfo.getCallInfo().getTalk_time_len())
			return;

		HashMap<String, String> _params = new HashMap<String, String>();
		// TODO
		_params.put("command", "commitTask");
		long _ts = (new Date()).getTime() + userInfo.getTs();
		_params.put("ts", Long.toString(_ts));

		// TODO
		try {
			_params.put("apikey",
					URLEncoder.encode(userInfo.getApikey(), "UTF-8"));

			JSONObject _jo = new JSONObject();
			_jo.put("id", userInfo.getCallInfo().getHandtask_id());
			_jo.put("TALK_TIME_LEN", talk_time_len);
			_jo.put("TALK_TIME", talk_time);
			_jo.put("TEL_NUM", tel_num);

			// TODO
			String _data = _jo.toString();
			_params.put("data", URLEncoder.encode(_data, "UTF-8"));

			String _paramStr = URLEncoder.encode(
					"apikey=" + userInfo.getApikey()
							+ "&command=commitTask&data=" + _data + "&ts="
							+ _ts, "UTF-8");
			_params.put("signature",
					RestUtil.standard(_paramStr, userInfo.getSeckey()));

			// TODO
			Editor editor = preferences.edit();
			editor.putString("id", userInfo.getCallInfo().getHandtask_id());
			editor.putInt("TALK_TIME_LEN", talk_time_len);
			editor.putLong("TALK_TIME", talk_time);
			editor.putString("TEL_NUM", tel_num);
			editor.commit();
		} catch (Exception e) {
			e.printStackTrace();
			return;
		} finally {
			userInfo.setCallInfo(null);
		}

		// TODO
		HttpUtil _hu = new HttpUtil(ServiceAction.COMMIT_TASK, handler, httpUrl
				+ "api", RequestMethod.POST, _params);
		Thread _t = new Thread(_hu);
		_t.start();
	}

	private void findLast(Context ctx, String tel_num, long call_time) {
		Cursor _cursor = null;
		// TODO
		try {
			_cursor = ctx.getContentResolver().query(
					Calls.CONTENT_URI,
					porjection,
					Calls.TYPE + "=" + Calls.OUTGOING_TYPE + " AND "
							+ Calls.NUMBER + "=? AND " + Calls.DATE + ">"
							+ call_time + " AND 0<" + Calls.DURATION,
					new String[] { tel_num }, "DATE DESC LIMIT 1");
			// TODO
			if (_cursor.moveToFirst()) {
				Log.i(TAG,
						"===========" + _cursor.getString(0) + ","
								+ _cursor.getString(1) + ","
								+ _cursor.getString(2) + ","
								+ _cursor.getString(3));

				commitTask(_cursor.getString(1), _cursor.getLong(2),
						_cursor.getInt(3));
			} else {
				Log.i(TAG, "===========");
			}
		} catch (Exception e) {
			Log.e(TAG, e.getMessage());
		} finally {
			if (null != _cursor)
				_cursor.close();
		}
	}

	private class OnePhoneStateListener extends PhoneStateListener {
		private String tel_num;
		private Date call_time;
		private Context ctx;

		public OnePhoneStateListener(Context ctx) {
			this.ctx = ctx;
		}

		public void setTel_num(String tel_num) {
			this.tel_num = tel_num;
		}

		public void setCall_time(Date call_time) {
			this.call_time = call_time;
		}

		@Override
		public void onCallStateChanged(int state, String incomingNumber) {
			super.onCallStateChanged(state, incomingNumber);
			switch (state) {
			case TelephonyManager.CALL_STATE_IDLE: // 挂断
				findLast(ctx, tel_num, call_time.getTime());
				break;
			case TelephonyManager.CALL_STATE_OFFHOOK: // 接听
				break;
			case TelephonyManager.CALL_STATE_RINGING: // 响铃
				break;
			}
		}
	};
}
