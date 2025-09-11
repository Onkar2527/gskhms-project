package com.codecraft.master.utility;

import com.codecraft.master.constant.MasterConstant;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class DateSerializer extends JsonSerializer<Date> {

	@Override
	public void serialize(Date date, JsonGenerator gen, SerializerProvider serializers) throws IOException {

		gen.writeString(formatStringToDate(date, MasterConstant.DATE_FORMAT_YYYY_MM_DD));

	}

	private String formatStringToDate(Date date, String formatter) {
		if (date != null) {
			SimpleDateFormat dateFormatter = new SimpleDateFormat(formatter);
			dateFormatter.setTimeZone(TimeZone.getDefault());
			return dateFormatter.format(date);
		}
		return null;
	}

}
