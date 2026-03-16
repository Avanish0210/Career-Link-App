package com.example.User_Services.utils;

import org.mindrot.jbcrypt.BCrypt;

public class PasswordUtil {


    public static String hasPassword(String plainTextPassword){
        return BCrypt.hashpw(plainTextPassword, BCrypt.gensalt());
    }

    public static boolean checkPassword(String plainTextPassword, String hashedPassword) {
        return BCrypt.checkpw(plainTextPassword, hashedPassword);
    }
}
