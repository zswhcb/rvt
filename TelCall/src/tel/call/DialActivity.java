package tel.call;

import tel.call.broadcast.PhoneBroadcastReceiver;
import android.app.Activity;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
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

	private PhoneBroadcastReceiver receiver;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.dial_main);
		registerListener();
	}

	private void registerListener() {
		receiver = new PhoneBroadcastReceiver();
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
		// TODO
		Bundle _bundle = this.getIntent().getExtras();
		text_task_name.setText("任务名称：" + _bundle.getString("TASK_NAME"));
		text_task_tel_num.setText("电话号码：" + _bundle.getString("TEL_NUM"));
		text_task_intro.setText(_bundle.getString("TASK_INTRO"));
		text_task_talk_timeout.setText("通话超时：还剩"
				+ _bundle.getString("TALK_TIMEOUT") + "（秒）过期");
		text_task_talk_time_len.setText("通话时长：不能少于"
				+ _bundle.getString("TALK_TIME_LEN") + "（秒）");
		text_sms_intro.setText(_bundle.getString("SMS_INTRO"));

		// TODO
	}

	private void bind() {
		// click
		btn_dial.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				String tel_num = text_task_tel_num.getText().toString();
				// 用intent启动拨打电话
				Intent intent = new Intent(Intent.ACTION_CALL, Uri.parse("tel:"
						+ tel_num));
				DialActivity.this.startActivity(intent);
			}
		});
	}

	@Override
	public void onDestroy() {
		unregisterReceiver(receiver);
		super.onDestroy();
	}
}
