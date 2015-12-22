package tel.call;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import tel.call.action.ServiceAction;
import tel.call.adapter.CurrentTasksAdapter;
import tel.call.util.DateUtil;
import tel.call.util.HttpUtil;
import tel.call.util.HttpUtil.RequestMethod;
import tel.call.util.RestUtil;
import tel.call.util.UserInfo;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

/**
 * 
 * @author huangxin (3203317@qq.com)
 * 
 */
public class MainActivity extends ActionBarActivity {

	private final static String TAG = MainActivity.class.getSimpleName();

	// TODO
	private Button btn_sync;
	private ListView grid_items;
	private EditText text_sel_date;
	// TODO
	// private DBManager dbMgr;
	// TODO
	private UserInfo app;

	private Toast toast;

	private void showToast(String msg) {
		if (null == toast)
			toast = Toast.makeText(getApplicationContext(), msg,
					Toast.LENGTH_SHORT);
		else
			toast.setText(msg);
		toast.show();
	}

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		if (checkLogin())
			return;
		Log.d(TAG, "onCreate() starting.");
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		if (savedInstanceState == null) {
			getSupportFragmentManager().beginTransaction()
					.add(R.id.container, new PlaceholderFragment()).commit();
		}
		// TODO
		// dbMgr = new DBManager(this);
		app = (UserInfo) getApplication();
	}

	@Override
	protected void onDestroy() {
		// if (null != dbMgr)
		// dbMgr.close();
		super.onDestroy();
	}

	/**
	 * 检测登陆状态，否则并跳转
	 */
	private boolean checkLogin() {
		return false;
	}

	@Override
	public void onStart() {
		super.onStart();
		findView();
		bind();
		loadData();
	}

	@SuppressLint("HandlerLeak")
	private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			switch (msg.what) {
			case ServiceAction.GET_CURRENTTASKS:
				getCurrentTasks(msg);
				break;
			case ServiceAction.APPLYTASK:
				applyTask(msg);
			default:
				break;
			}
		}

		private void applyTask(Message msg) {
			// TODO
			if (null == msg.obj) {
				showToast(getString(msg.arg1));
				grid_items.setEnabled(true);
				return;
			}

			Bundle _bundle = null;
			// TODO
			try {
				JSONObject _jo = new JSONObject((String) msg.obj);
				// TODO
				if (!_jo.getBoolean("success")) {
					showToast(_jo.getJSONArray("msg").getString(0));
					grid_items.setEnabled(true);
					return;
				}
				// TODO
				JSONObject _jdata = _jo.getJSONObject("data");

				// TODO
				_bundle = new Bundle();
				_bundle.putString("HANDTASK_ID",
						_jdata.getString("HANDTASK_ID"));
				_bundle.putString("TEL_NUM", _jdata.getString("TEL_NUM"));
				_bundle.putString("TASK_NAME", _jdata.getString("TASK_NAME"));
				_bundle.putString("TASK_INTRO", _jdata.getString("TASK_INTRO"));
				// TODO
				_bundle.putString("TALK_TIMEOUT",
						_jdata.getString("TALK_TIMEOUT"));
				_bundle.putString("TALK_TIME_LEN",
						_jdata.getString("TALK_TIME_LEN"));
				_bundle.putString("SMS_INTRO", _jdata.getString("SMS_INTRO"));
				_bundle.putString("HANDTASK_CREATE_TIME",
						_jdata.getString("HANDTASK_CREATE_TIME"));
			} catch (JSONException e) {
				e.printStackTrace();
				showToast(e.getMessage());
				return;
			} finally {
				grid_items.setEnabled(true);
			}
			// TODO
			Intent intent = new Intent(MainActivity.this, DialActivity.class);
			intent.putExtras(_bundle);
			startActivity(intent);
		}

		private void getCurrentTasks(Message msg) {
			// TODO
			if (null == msg.obj) {
				showToast(getString(msg.arg1));
				setBtnLoginStatus(true);
				return;
			}
			// TODO
			try {
				JSONObject _jo = new JSONObject((String) msg.obj);
				// TODO
				if (!_jo.getBoolean("success")) {
					showToast(_jo.getJSONArray("msg").getString(0));
					setBtnLoginStatus(true);
					return;
				}
				// TODO
				JSONArray _jdata = _jo.getJSONArray("data");
				// TODO
				CurrentTasksAdapter _adapter = new CurrentTasksAdapter(
						R.layout.fragment_main_datagrid, MainActivity.this,
						_jdata);
				grid_items.setAdapter(_adapter);
			} catch (JSONException e) {
				e.printStackTrace();
				showToast(e.getMessage());
			} finally {
				setBtnLoginStatus(true);
			}
		}
	};

	/**
	 * 获取当前可接的任务
	 */
	private void refreshRemoteData() {
		HashMap<String, String> _params = new HashMap<String, String>();
		// TODO
		_params.put("apikey", app.getApikey());
		_params.put("command", "getCurrentTasks");
		long ts = (new Date()).getTime() + app.getTs();
		_params.put("ts", Long.toString(ts));

		// TODO
		try {
			JSONObject jo = new JSONObject();
			String data = jo.toString();
			_params.put("data", URLEncoder.encode(data, "UTF-8"));
			// TODO
			String params = URLEncoder.encode("apikey=" + app.getApikey()
					+ "&command=getCurrentTasks&data=" + data + "&ts=" + ts,
					"UTF-8");
			_params.put("signature", RestUtil.standard(params, app.getSeckey()));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			showToast(e.getMessage());
			setBtnLoginStatus(true);
			return;
		}

		// TODO
		HttpUtil _hu = new HttpUtil(ServiceAction.GET_CURRENTTASKS, handler,
				getString(R.string.httpUrl) + "api", RequestMethod.POST,
				_params);
		Thread _t = new Thread(_hu);
		_t.start();
	}

	private void loadData_grid() {
		refreshRemoteData();
	}

	private void loadData() {
		loadData_grid();
	}

	private void findView() {
		btn_sync = (Button) findViewById(R.id.btn_sync);
		grid_items = (ListView) findViewById(R.id.grid_items);
		text_sel_date = (EditText) findViewById(R.id.text_sel_date);
		// TODO
		text_sel_date.setText(DateUtil.getFormat2());
		text_sel_date.setEnabled(false);
	}

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
			showToast(e.getMessage());
			grid_items.setEnabled(true);
			return;
		}

		// TODO
		HttpUtil _hu = new HttpUtil(ServiceAction.APPLYTASK, handler,
				getString(R.string.httpUrl) + "api", RequestMethod.POST,
				_params);
		Thread _t = new Thread(_hu);
		_t.start();
	}

	private void setBtnLoginStatus(boolean status) {
		btn_sync.setEnabled(status);
		grid_items.setEnabled(status);
		btn_sync.setText(status ? getString(R.string.fragment_main_btn_sync)
				: "正在刷新");
	}

	private void bind() {
		// click
		btn_sync.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				setBtnLoginStatus(false);
				refreshRemoteData();
			}
		});

		// TODO
		grid_items.setOnItemClickListener(new OnItemClickListener() {
			@Override
			public void onItemClick(AdapterView<?> av, View v, int position,
					long id) {
				grid_items.setEnabled(false);
				// TODO
				JSONObject _jo = (JSONObject) grid_items
						.getItemAtPosition(position);
				// TODO
				try {
					String TASK_ID = _jo.getString("id");
					// TODO
					applyTask(TASK_ID);
				} catch (JSONException e) {
					e.printStackTrace();
					showToast(e.getMessage());
					grid_items.setEnabled(true);
				}
			}
		});
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {

		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		switch (item.getItemId()) {
		case R.id.action_changePwd: {
			Uri uri = Uri.parse(getString(R.string.httpUrl) + "u/changePwd");
			Intent intent = new Intent(Intent.ACTION_VIEW, uri);
			startActivity(intent);
			break;
		}
		case R.id.action_taskHistory: {
			Uri uri = Uri.parse(getString(R.string.httpUrl) + "u/task/");
			Intent intent = new Intent(Intent.ACTION_VIEW, uri);
			startActivity(intent);
			break;
		}
		case R.id.action_settings: {
			Uri uri = Uri.parse(getString(R.string.httpUrl) + "u/");
			Intent intent = new Intent(Intent.ACTION_VIEW, uri);
			startActivity(intent);
			break;
		}
		default:
			return true;
		}
		return super.onOptionsItemSelected(item);
	}

	/**
	 * A placeholder fragment containing a simple view.
	 */
	public static class PlaceholderFragment extends Fragment {

		public PlaceholderFragment() {
			// TODO
		}

		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container,
				Bundle savedInstanceState) {
			View rootView = inflater.inflate(R.layout.fragment_main, container,
					false);
			return rootView;
		}
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (0 == requestCode && RESULT_OK == resultCode) {
			setResult(RESULT_OK);
			finish();
		}
	}
}