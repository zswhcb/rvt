package tel.call.broadcast;

import java.util.Date;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
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
	private static final String TAG = "PhoneBroadcastReceiver";

	private static final String[] porjection = new String[] { Calls.TYPE,
			Calls.NUMBER, Calls.DATE, Calls.DURATION };

	private OnePhoneStateListener listener;

	@Override
	public void onReceive(Context ctx, Intent intent) {
		if (intent.getAction().equals(Intent.ACTION_NEW_OUTGOING_CALL)) {
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
			} else {
				Log.i(TAG, "===========no");
			}
		} catch (Exception e) {
			Log.e(TAG, e.getMessage());
			if (null != cursor)
				cursor.close();
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
