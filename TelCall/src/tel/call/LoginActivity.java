package tel.call;

import java.util.Timer;
import java.util.TimerTask;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
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

		text_username.setText("3203317@qq.com");
	}

	private void bind() {
		// click
		btn_login.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				if ("".equals(text_userpass.getText().toString().trim())) {
					Toast.makeText(getApplicationContext(),
							R.string.valiate_userpass, Toast.LENGTH_SHORT)
							.show();
					return;
				}

				Intent intent = new Intent(LoginActivity.this,
						MainActivity.class);
				startActivity(intent);
				finish();
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
				Log.d(TAG, "clicked register link.");
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
