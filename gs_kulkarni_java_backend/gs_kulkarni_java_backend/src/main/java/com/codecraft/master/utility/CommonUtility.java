package com.codecraft.master.utility;

import lombok.extern.slf4j.Slf4j;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;


@Slf4j
public class CommonUtility {


	/**
	 * This Method will log query information
	 * @param start
	 * @param end
	 * @param queryName
	 * @param rowReturned
	 */
	public static void logQueryInformation(Date start, Date end, String queryName, Integer rowReturned) {
		long timeOfQueryMilisecond = end.getTime() - start.getTime();
		log.info("QUERYNAME:{},TimeOfQueryMiliseconds:{},RowsReturned:{}", queryName, timeOfQueryMilisecond, rowReturned);
	}
	
	/**
	 * This method will log query information
	 * @param start
	 * @param end
	 * @param queryName
	 */
	public static void logQueryInformation(Date start, Date end, String queryName) {
		long timeOfQueryMilisecond = end.getTime() - start.getTime();
		log.info("QUERYNAME:{},TimeOfQueryMiliseconds:{}", queryName, timeOfQueryMilisecond);
	}
	

	/**
	 * This Method will return server Ip address 
	 * @return
	 */
	public static InetAddress getIpAddress() {
		try {
			return InetAddress.getLocalHost();
		} catch (UnknownHostException e) {
			log.error("Error occured while getting server ip address exception ", e);
		}
		return null;
	}
	
	
}
