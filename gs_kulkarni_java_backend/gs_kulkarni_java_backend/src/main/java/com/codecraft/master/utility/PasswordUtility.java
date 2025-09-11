package com.codecraft.master.utility;

import org.jasypt.util.password.StrongPasswordEncryptor;
import org.springframework.stereotype.Component;

@Component
public class PasswordUtility {

	public String encryptPassword(String inputPassword) {
		StrongPasswordEncryptor encryptor = new StrongPasswordEncryptor();
		return encryptor.encryptPassword(inputPassword);
	}

	public boolean checkPassword(String inputPassword, String encryptedStoredPassword) {
		StrongPasswordEncryptor encryptor = new StrongPasswordEncryptor();
		return encryptor.checkPassword(inputPassword, encryptedStoredPassword);
	}

}
