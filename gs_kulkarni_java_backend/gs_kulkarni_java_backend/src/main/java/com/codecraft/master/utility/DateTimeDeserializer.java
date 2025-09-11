package com.codecraft.master.utility;

import com.codecraft.master.constant.MasterConstant;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateTimeDeserializer extends JsonDeserializer<Date> {

	private static Logger logger = LoggerFactory.getLogger(DateTimeDeserializer.class);

	@Override
	public Date deserialize(JsonParser paramJsonParser, DeserializationContext ctxt) throws IOException {
		try {
			String timeStamp = StringUtils.trim(paramJsonParser.getText());
			if (StringUtils.isNotBlank(timeStamp)) {
				return formatStringToDate(timeStamp, MasterConstant.DATE_TIME_FORMAT_YYYY_MM_DD_HH_MM_SS);
			}
		} catch (IOException e) {
			logger.error("Excecption occured in DateParseDeserializer");
		}
		return null;

	}

	private Date formatStringToDate(String str, String formatter) {
		try {
			SimpleDateFormat dateFormatter = new SimpleDateFormat(formatter);
			// dateFormatter.setTimeZone(TimeZone.getDefault());
			return dateFormatter.parse(str);
		} catch (ParseException exeption) {
			exeption.printStackTrace();
		}
		return null;
	}

}
