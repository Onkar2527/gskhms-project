package com.codecraft.master.configs;

public class UserContext {

    private static final ThreadLocal<String> currentUser = new ThreadLocal<>();
    private static final ThreadLocal<Integer> hospital = new ThreadLocal<>();

    public static String getCurrentUser() {
        return currentUser.get();
    }

    public static void setCurrentUser(String user) {
        currentUser.set(user);
    }

    public static Integer getHospitalId() {
        return hospital.get();
    }

    public static void setHospitalId(Integer hospitalId) {
        hospital.set(hospitalId);
    }

    public static void clear() {
        currentUser.remove();
        hospital.remove();
    }

}
