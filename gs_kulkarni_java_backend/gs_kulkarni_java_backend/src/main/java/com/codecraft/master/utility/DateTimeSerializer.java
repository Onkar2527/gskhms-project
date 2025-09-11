package com.codecraft.master.utility;

import com.codecraft.master.constant.MasterConstant;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class DateTimeSerializer extends JsonSerializer<Date> {

	@Override
	public void serialize(Date date, JsonGenerator gen, SerializerProvider serializers) throws IOException {

		gen.writeString(formatStringToDate(date, MasterConstant.DATE_TIME_FORMAT_YYYY_MM_DD_HH_MM_SS));

	}

	private String formatStringToDate(Date date, String formatter) {
		if (date != null) {
			SimpleDateFormat dateFormatter = new SimpleDateFormat(formatter);
			dateFormatter.setTimeZone(TimeZone.getDefault());
			return dateFormatter.format(date);
		}
		return null;
	}

	public static boolean isValidDateRange(Date startDate, Date endDate, boolean equalOK) {
		// false if either value is null
		if (startDate == null || endDate == null) {
			return false;
		}

		if (equalOK) {
			// true if they are equal
			if (startDate.equals(endDate)) {
				return true;
			}
		}

		// true if endDate after startDate
		if (endDate.after(startDate)) {
			return true;
		}

		return false;
	}
}
