package cn.kepu.self.commons.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.Arrays;

public class ToString {

    public static void ToString(String[] args) {
        String FileName = "F:/SVN/kepu-self/self-server/self-commons/src/main/java/cn/kepu/self/commons/util/sendMail.html";
        File myFile = new File(FileName);
        if (!myFile.exists()) {
            System.err.println("Can't Find " + FileName);
        }

        try {
            BufferedReader in = new BufferedReader(new FileReader(myFile));
            String str;
            while ((str = in.readLine()) != null) {
                System.out.println(str);
            }
            in.close();
        } catch (IOException e) {
            e.getStackTrace();
        }
    }

    public static boolean ToString2(String qdpPath, String appPath) throws Exception {
        //读取test.txt内容为字符串，将其中abc替换为def  
        String filePath = ("F:/SVN/kepu-self/self-server/self-commons/src/main/java/cn/kepu/self/commons/util/sendMail.html");
        byte[] fileBuffer;
        try (FileInputStream fileIn = new FileInputStream(filePath)) {
            int fileSize = fileIn.available();
            fileBuffer = new byte[fileSize];
            fileIn.read(fileBuffer);
//            System.out.println(Arrays.toString(fileBuffer));
        }
        String fileStr = new String(fileBuffer, "utf-8");//可能会出现中文乱码，因此加上utf-8，如果还是乱码，可以试下gb2312,gbk,iso8859-1等等  
        System.out.println(fileStr);
        fileStr = fileStr.replaceAll("abc", "def");

        //将字符串写入文件中  
        FileOutputStream ops = new FileOutputStream("C:\\test.txt");
        ops.write(fileStr.getBytes("utf-8"));
        ops.close();
        return true;
    }
//    public static void main(String[] args) {
//
//        String FileName = "F:/SVN/kepu-self/self-server/self-commons/src/main/java/cn/kepu/self/commons/util/sendMail.html";
//        File myFile = new File(FileName);
//        if (!myFile.exists()) {
//            System.err.println("Can't Find " + FileName);
//        }
//        try {
//            BufferedReader in = new BufferedReader(new FileReader(myFile));
//            String str;
//            while ((str = in.readLine()) != null) {
//                System.out.println(str);
//            }
//            in.close();
//        } catch (IOException e) {
//            e.getStackTrace();
//        }
//    }
}
