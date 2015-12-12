package tel.call.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import android.annotation.SuppressLint;

/**
 * 
 * @author huangxin (3203317@qq.com)
 * 
 */
@SuppressLint("SimpleDateFormat")
public class DateUtil {

	private static final SimpleDateFormat sdf_1 = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss");

	private static final SimpleDateFormat sdf_2 = new SimpleDateFormat(
			"MM/dd/HH");

	private static final SimpleDateFormat sdf_3 = new SimpleDateFormat(
			"yyyy-MM-dd");

	public static String dateToStr(Date date) {
		String str = sdf_1.format(date);
		return str;
	}

	public static Date strToDate(String date) {
		Date d = null;
		try {
			d = sdf_1.parse(date);
		} catch (ParseException e) {
			e.printStackTrace();
		} finally {
			if (null == d)
				d = new Date();
		}
		return d;
	}

	public static String dateToShortStr(Date date) {
		String str = sdf_2.format(date);
		return str;
	}

	public static String getShortDate() {
		return sdf_3.format(new Date());
	}
}
