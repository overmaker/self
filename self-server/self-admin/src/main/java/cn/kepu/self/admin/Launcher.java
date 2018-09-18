package cn.kepu.self.admin;

import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 *
 * @author 劉一童
 */
public final class Launcher {

    public static void main(String[] args) {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[]{"/cn/kepu/self/admin/launcher.xml"});
    }
}
