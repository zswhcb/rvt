package tel.call;

import java.util.Timer;
import java.util.TimerTask;

import org.json.JSONException;
import org.json.JSONObject;

import tel.call.util.HttpUtil;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.telephony.TelephonyManager;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

/**
 * 
 * @author huangxin (3203317@qq.com)
 * 
 */
public class LoginActivity extends Activity {

	private final static String TAG = "LoginActivity";

	private EditText text_username;
	private EditText text_userpass;
	private TextView link_register;
	private Button btn_showpass;
	private Button btn_login;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.login_main);
	}

	@Override
	public void onStart() {
		Log.d(TAG, "onStart() starting.");
		super.onStart();
		findView();
		bind();
	}

	private void findView() {
		text_username = (EditText) findViewById(R.id.text_username);
		text_userpass = (EditText) findViewById(R.id.text_userpass);
		link_register = (TextView) findViewById(R.id.link_register);
		btn_showpass = (Button) findViewById(R.id.btn_showpass);
		btn_login = (Button) findViewById(R.id.btn_login);
		// TODO
		text_username.setText(getMobileNum().replaceAll("\\+86", ""));
	}

	@SuppressLint("HandlerLeak")
	private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			switch (msg.what) {
			case HttpAction.LOGIN:
				try {
					if (null == msg.obj) {
						Toast.makeText(getApplicationContext(),
								R.string.login_failure, Toast.LENGTH_SHORT)
								.show();
						btn_login.setEnabled(true);
						return;
					}
					JSONObject j = new JSONObject((String) msg.obj);
					// TODO
					if (!j.getBoolean("success")) {
						Toast.makeText(getApplicationContext(),
								R.string.login_failure, Toast.LENGTH_SHORT)
								.show();
						btn_login.setEnabled(true);
						return;
					}
					Log.i(TAG, j.getString("success"));
				} catch (JSONException e) {
					e.printStackTrace();
				}
				break;
			default:
				break;
			}
		}
	};

	private void login(final String user_name, final String user_pass) {
		// TODO
		new Thread(new Runnable() {
			@Override
			public void run() {
				int what = HttpAction.LOGIN;
				JSONObject json = new JSONObject();
				try {
					json.put("USER_NAME", user_name);
					json.put("USER_PASS", user_pass);
				} catch (JSONException e) {
					Message msg = new Message();
					msg.what = what;
					msg.obj = null;
					handler.sendMessage(msg);
				}
				// TODO
				String url = getString(R.string.httpUrl) + "api";
				Log.i(TAG, url);
				Message msg = HttpUtil.get(url, what);
				handler.sendMessage(msg);
			}
		}).start();
	}

	/**
	 * 获取手机号
	 * 
	 * @return
	 */
	public String getMobileNum() {
		TelephonyManager tm = (TelephonyManager) this
				.getSystemService(Context.TELEPHONY_SERVICE);
		return tm.getLine1Number();
	}

	private void bind() {
		// click
		btn_login.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				btn_login.setEnabled(false);
				// TODO
				String user_name = text_username.getText().toString().trim();
				String user_pass = text_userpass.getText().toString().trim();
				// TODO
				if ("".equals(user_name)) {
					Toast.makeText(getApplicationContext(),
							R.string.valiate_userpass, Toast.LENGTH_SHORT)
							.show();
					btn_login.setEnabled(true);
					return;
				}
				if ("".equals(user_pass)) {
					Toast.makeText(getApplicationContext(),
							R.string.valiate_userpass, Toast.LENGTH_SHORT)
							.show();
					btn_login.setEnabled(true);
					return;
				}

				login(user_name, user_pass);

				// Intent intent = new Intent(LoginActivity.this,
				// MainActivity.class);
				// startActivity(intent);
				// finish();
			}
		});

		// click
		btn_showpass.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				if (getString(R.string.login_main_btn_show).equals(
						btn_showpass.getText())) {
					text_userpass
							.setTransformationMethod(HideReturnsTransformationMethod
									.getInstance());
					btn_showpass.setText(R.string.login_main_btn_hide);
				} else {
					text_userpass
							.setTransformationMethod(PasswordTransformationMethod
									.getInstance());
					btn_showpass.setText(R.string.login_main_btn_show);
				}
			}
		});

		// click
		link_register.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				Uri uri = Uri.parse(getString(R.string.httpUrl)
						+ "user/register");
				Intent intent = new Intent(Intent.ACTION_VIEW, uri);
				startActivity(intent);
			}
		});

		// timer
		Timer timer = new Timer();
		timer.schedule(new TimerTask() {
			public void run() {
				popKeyboard();
			}

			/**
			 * 弹出软键盘
			 */
			private void popKeyboard() {
				InputMethodManager manager = (InputMethodManager) text_username
						.getContext().getSystemService(
								Context.INPUT_METHOD_SERVICE);
				manager.showSoftInput(text_username, 0);
			}
		}, 1000 * 1);
	}
}
