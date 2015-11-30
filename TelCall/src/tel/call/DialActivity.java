package tel.call;

import android.app.Activity;
import android.content.Intent;
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

	private final static String TAG = "DialActivity";

	private EditText text_tel;
	private EditText text_hint;
	private Button btn_dial;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.dial_main);
	}

	@Override
	public void onStart() {
		Log.d(TAG, "onStart() starting.");
		super.onStart();
		findView();
		bind();
	}

	private void findView() {
		text_tel = (EditText) findViewById(R.id.text_tel);
		text_hint = (EditText) findViewById(R.id.text_hint);
		btn_dial = (Button) findViewById(R.id.btn_dial);
		// TODO
		text_tel.setText("13837186852");
		text_hint
				.setText("要抢就抢地铁微豪宅，【郑东商业中心-云朵公寓】4.8米层高31-59㎡复式精装公寓，省府旁地铁3、5号线上盖，保值升值赚不停87089999");
	}

	private void bind() {
		// click
		btn_dial.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				String tel_num = text_tel.getText().toString();
				// 用intent启动拨打电话
				Intent intent = new Intent(Intent.ACTION_CALL, Uri.parse("tel:"
						+ tel_num));
				startActivity(intent);
			}
		});
	}
}
