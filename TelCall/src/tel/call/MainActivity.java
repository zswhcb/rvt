package tel.call;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import tel.call.db.DBManager;
import tel.call.model.Task;
import tel.call.util.DateUtil;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.TextView;

/**
 * 
 * @author huangxin (3203317@qq.com)
 * 
 */
public class MainActivity extends ActionBarActivity {

	private final static String TAG = "MainActivity";

	public static final String[] DATAGRID_TITLES_FROM = new String[] { "no",
			"task_name", "issued_time", "status" };
	private static final int[] DATAGRID_TITLES_TO = new int[] { R.id.no,
			R.id.task_name, R.id.issued_time, R.id.status };

	// TODO
	private Button btn_sync;
	private ListView grid_items;
	private EditText text_sel_date;
	// TODO
	private List<HashMap<String, Object>> grid_data;
	// TODO
	private DBManager dbMgr;

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
		dbMgr = new DBManager(this);
	}

	@Override
	protected void onDestroy() {
		if (null != dbMgr)
			dbMgr.close();
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

	private void loadData_grid() {
		List<Task> list = dbMgr.queryTasks();
		// TODO
		grid_data = new ArrayList<HashMap<String, Object>>();
		for (int i = 0, j = list.size(); i < j; i++) {
			Task task = list.get(i);
			// TODO
			HashMap<String, Object> item = new HashMap<String, Object>();
			item.put(DATAGRID_TITLES_FROM[0], i + 1);
			item.put(DATAGRID_TITLES_FROM[1], task.getTask_name());
			item.put(DATAGRID_TITLES_FROM[2],
					DateUtil.dateToShortStr(task.getIssued_time()));
			item.put(DATAGRID_TITLES_FROM[3], task.getStatus());
			grid_data.add(item);
		}
		// TODO
		SimpleAdapter adapter = new OneSimpleAdapter(this, grid_data,
				R.layout.fragment_main_datagrid, DATAGRID_TITLES_FROM,
				DATAGRID_TITLES_TO);
		// 实现列表的显示
		grid_items.setAdapter(adapter);
	}

	private void loadData() {
		loadData_grid();
	}

	private void findView() {
		btn_sync = (Button) findViewById(R.id.btn_sync);
		grid_items = (ListView) findViewById(R.id.grid_items);
		text_sel_date = (EditText) findViewById(R.id.text_sel_date);
		// TODO
		text_sel_date.setText("2015-01-01");
	}

	private void bind() {
		// click
		btn_sync.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				Intent intent = new Intent(MainActivity.this,
						DialActivity.class);
				startActivity(intent);
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

	/**
	 * 
	 * @author huangxin (3203317@qq.com)
	 * 
	 */
	class OneSimpleAdapter extends SimpleAdapter {

		public OneSimpleAdapter(Context context,
				List<? extends Map<String, ?>> data, int resource,
				String[] from, int[] to) {
			super(context, data, resource, from, to);
		}

		public View getView(int position, View convertView, ViewGroup parent) {
			// TODO
			ViewHolder viewHolder = null;
			if (null == convertView) {
				viewHolder = new ViewHolder();
				LayoutInflater inflater = MainActivity.this.getLayoutInflater();
				convertView = inflater.inflate(R.layout.fragment_main_datagrid,
						null);
				// TODO
				viewHolder.no = (TextView) convertView.findViewById(R.id.no);
				viewHolder.task_name = (TextView) convertView
						.findViewById(R.id.task_name);
				viewHolder.issued_time = (TextView) convertView
						.findViewById(R.id.issued_time);
				viewHolder.status = (TextView) convertView
						.findViewById(R.id.status);
				// TODO
				convertView.setTag(viewHolder);
			} else {
				viewHolder = (ViewHolder) convertView.getTag();
			}

			if (null != grid_data) {
				// TODO
				viewHolder.no.setText(grid_data.get(position)
						.get(DATAGRID_TITLES_FROM[0]).toString());
				viewHolder.task_name.setText(grid_data.get(position)
						.get(DATAGRID_TITLES_FROM[1]).toString());
				viewHolder.issued_time.setText(grid_data.get(position)
						.get(DATAGRID_TITLES_FROM[2]).toString());

				// TODO
				int status = Integer.valueOf(grid_data.get(position)
						.get(DATAGRID_TITLES_FROM[3]).toString());
				viewHolder.status.setText(4 == status ? "查看" : "同步");
				// TODO
				if (2 == position) {
					viewHolder.task_name.setTextColor(Color.GREEN);
				}
			}
			// TODO
			return convertView;
		}

		/**
		 * 
		 * @author huangxin (3203317@qq.com)
		 * 
		 */
		class ViewHolder {
			public TextView no;
			public TextView task_name;
			public TextView issued_time;
			public TextView status;
		}
	}
}
