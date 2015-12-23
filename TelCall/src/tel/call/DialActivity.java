package tel.call;

import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;

import org.json.JSONException;
import org.json.JSONObject;

import tel.call.action.ServiceAction;
import tel.call.broadcast.PhoneBroadcastReceiver;
import tel.call.util.DateUtil;
import tel.call.util.HttpUtil;
import tel.call.util.HttpUtil.RequestMethod;
import tel.call.util.RestUtil;
import tel.call.util.UserInfo;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;

/**
 * 
 * @author huangxin (3203317@qq.com)
 * 
 */
public class DialActivity extends Activity {

	private final static String TAG = DialActivity.class.getSimpleName();

	private EditText text_task_name;
	private EditText text_task_tel_num;
	private EditText text_task_talk_timeout;
	private EditText text_task_intro;
	private EditText text_task_talk_time_len;
	private EditText text_sms_intro;

	private Button btn_dial;
	private UserInfo app;

	private PhoneBroadcastReceiver receiver;

	private AlertDialog.Builder alertDialog;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.dial_main);
		// TODO
		app = (UserInfo) getApplication();
	}

	private void registerListener() {
		receiver = new PhoneBroadcastReceiver(handtask_id);
		IntentFilter filter = new IntentFilter();
		filter.addAction(Intent.ACTION_NEW_OUTGOING_CALL);
		filter.setPriority(Integer.MAX_VALUE);
		registerReceiver(receiver, filter);
	}

	@Override
	public void onStart() {
		Log.d(TAG, "onStart() starting.");
		super.onStart();
		findView();
		bind();
		loadData();
	}

	private void loadData() {
		Bundle _bundle = getIntent().getExtras();
		applyTask(_bundle.getString("TASK_ID"));
	}

	private String handtask_id;

	@SuppressLint("HandlerLeak")
	private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			switch (msg.what) {
			case ServiceAction.APPLYTASK:
				applyTask(msg);
			default:
				break;
			}
		}

		private void applyTask(Message msg) {
			// TODO
			if (null == msg.obj) {
				errorBack(getString(msg.arg1));
				return;
			}

			// TODO
			try {
				JSONObject _jo = new JSONObject((String) msg.obj);
				// TODO
				if (!_jo.getBoolean("success")) {
					errorBack(_jo.getJSONArray("msg").getString(0));
					return;
				}

				// TODO
				JSONObject _jdata = _jo.getJSONObject("data");

				// TODO
				text_task_name.setText("任务名称：" + _jdata.getString("TASK_NAME"));
				text_task_tel_num
						.setText("电话号码：" + _jdata.getString("TEL_NUM"));
				text_task_intro.setText(_jdata.getString("TASK_INTRO"));
				text_task_talk_timeout.setText("任务过期："
						+ DateUtil.getFormat4(
								_jdata.getString("HANDTASK_CREATE_TIME"),
								_jdata.getInt("TALK_TIMEOUT")));
				text_task_talk_time_len.setText("通话时长：不能少于 "
						+ _jdata.getString("TALK_TIME_LEN") + " 秒");
				text_sms_intro.setText(_jdata.getString("SMS_INTRO"));

				// TODO
				handtask_id = _jdata.getString("HANDTASK_ID");
				// TODO
				btn_dial.setEnabled(true);
			} catch (JSONException e) {
				e.printStackTrace();
				errorBack(e.getMessage());
			}
		}
	};

	private void applyTask(String task_id) {
		HashMap<String, String> _params = new HashMap<String, String>();
		// TODO
		_params.put("apikey", app.getApikey());
		_params.put("command", "applyTask");
		long ts = (new Date()).getTime() + app.getTs();
		_params.put("ts", Long.toString(ts));

		// TODO
		try {
			JSONObject jo = new JSONObject();
			jo.put("TASK_ID", task_id);
			String data = jo.toString();
			_params.put("data", URLEncoder.encode(data, "UTF-8"));

			String params = URLEncoder.encode("apikey=" + app.getApikey()
					+ "&command=applyTask&data=" + data + "&ts=" + ts, "UTF-8");
			_params.put("signature", RestUtil.standard(params, app.getSeckey()));
		} catch (Exception e) {
			e.printStackTrace();
			errorBack(e.getMessage());
			return;
		}

		// TODO
		HttpUtil _hu = new HttpUtil(ServiceAction.APPLYTASK, handler,
				getString(R.string.httpUrl) + "api", RequestMethod.POST,
				_params);
		Thread _t = new Thread(_hu);
		_t.start();
	}

	private void errorBack(String msg) {
		alertDialog.setMessage(msg);
		alertDialog.show();
	}

	private void findView() {
		// TODO
		text_task_name = (EditText) findViewById(R.id.text_task_name);
		text_task_tel_num = (EditText) findViewById(R.id.text_task_tel_num);
		text_task_intro = (EditText) findViewById(R.id.text_task_intro);
		text_task_talk_timeout = (EditText) findViewById(R.id.text_task_talk_timeout);
		text_task_talk_time_len = (EditText) findViewById(R.id.text_task_talk_time_len);
		text_sms_intro = (EditText) findViewById(R.id.text_sms_intro);
		btn_dial = (Button) findViewById(R.id.btn_dial);

		alertDialog = new AlertDialog.Builder(this);
	}

	private void bind() {
		// click
		btn_dial.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				Bundle _bundle = getIntent().getExtras();
				String tel_num = _bundle.getString("TEL_NUM");
				registerListener();
				// 用intent启动拨打电话
				Intent intent = new Intent(Intent.ACTION_CALL, Uri.parse("tel:"
						+ tel_num));
				DialActivity.this.startActivity(intent);
			}
		});

		// TODO
		alertDialog.setPositiveButton("确定",
				new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialoginterface, int i) {
						DialActivity.this.finish();
					}
				});
	}

	@Override
	public void onDestroy() {
		unregisterReceiver(receiver);
		super.onDestroy();
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0) {
			DialActivity.this.finish();
			return true;
		}
		return super.onKeyDown(keyCode, event);
	}
}
