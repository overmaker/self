package cn.kepu.self.commons.service;

import cn.kepu.self.commons.dao.UserDAO;
import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.entity.UserInfo;
import cn.kepu.self.commons.util.sms.ISmsOperator;
import cn.kepu.self.commons.util.sms.MtMessage;
import cn.kepu.self.commons.util.sms.MtMessageRes;
import cn.kepu.self.commons.util.sms.MtMessageResDetail;
import cn.kepu.self.commons.util.sms.SmsOperatorImpServiceLocator;

import static cn.kepu.self.commons.util.Util.generateUid;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.codec.digest.DigestUtils;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author 劉一童
 */
public enum UserService {
    INSTANCE;
//    private static final String URL = "http://service.12302.cn:8080/ema/webService/smsOper?wsdl";
//    private static final String ACCOUNT = "904";
//    private static final String PASSWORD = "kepu-904";
    Map<String, String> mp = new HashMap<>();

    /**
     * 禁用实例化
     */
    private UserService() {

    }
    private String URL;
    private String ACCOUNT;
    private String PASSWORD;

    public static UserService getInstance() {
        return INSTANCE;
    }

    public void setURL(String URL) {
        this.URL = URL;
    }

    public void setACCOUNT(String ACCOUNT) {
        this.ACCOUNT = ACCOUNT;
    }

    public void setPASSWORD(String PASSWORD) {
        this.PASSWORD = PASSWORD;
    }
    private UserDAO userDAO;

    public void setUserDAO(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public User addOrUpdateUser(User user, UserInfo userInfo) {
        userDAO.addOrUpdateUser(user, userInfo);
        return user;
    }

    public User getUser(String token) {
        return userDAO.getUser(token);
    }

    public boolean registerUser(User user) {
        user.setUid(generateUid());
        return userDAO.registerUser(user);
    }


    /* 随机生成短信验证码 */
    public static String generateVcode() {
        Random r = new Random();
        return "vcode" + Stream
                .of(r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16))
                .map(Integer::toHexString).collect(Collectors.joining("")).toLowerCase();
    }

    /* 验证码存储 */
    public Map<String, String> smsCode(String phoneNumber1) throws Exception {
        mp.put(phoneNumber1, generateVcode());
        return mp;
    }

    public String check3(UserInfo userInfo) {
        System.out.println(1);
        String phoneNumber1 = userInfo.getMobile();
        System.out.println(2);
        SmsOperatorImpServiceLocator locator = new SmsOperatorImpServiceLocator();
        try {
            ISmsOperator ioperator = locator.getSmsOperatorImpPort(new URL(URL));
            System.out.println(URL);
            System.out.println(ACCOUNT);
            System.out.println(PASSWORD);
            System.out.println("------------------------发送下行短信------------------------");
            // 发送短信
            String obj = smsCode(phoneNumber1).get(phoneNumber1);
            MtMessage msg = new MtMessage();
            msg.setContent(obj);
            String[] phoneNumber = new String[1];
            phoneNumber[0] = phoneNumber1;
            msg.setPhoneNumber(phoneNumber);
            System.out.println(5);
            MtMessageRes mtMessageRes = ioperator.sendSms(ACCOUNT, DigestUtils.md5Hex(PASSWORD), "02", msg);
            //mp.clear();
            if ("r:000".equals(mtMessageRes.getSubStat())) {
                System.out.println("请求成功：" + mtMessageRes.getSubStat() + ";描述: " + mtMessageRes.getSubStatDes());
                System.out.println("本次提交短信流水号:" + mtMessageRes.getSmsId());
                for (MtMessageResDetail detail : mtMessageRes.getResDetail()) {
                    System.out.println("发送手机号:" + detail.getPhoneNumber() + ";提交状态:" + detail.getStat() + ";状态描述:"
                            + detail.getStatDes());
                }
            } else {
                System.out.println("请求失败,错误码：" + mtMessageRes.getSubStat() + ";错误描述: " + mtMessageRes.getSubStatDes());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    
    public String check3(String mobile) {
        SmsOperatorImpServiceLocator locator = new SmsOperatorImpServiceLocator();
        try {
            ISmsOperator ioperator = locator.getSmsOperatorImpPort(new URL(URL));
            // 发送短信
            String obj = "aaaa";
            MtMessage msg = new MtMessage();
            msg.setContent(obj);
            String[] phoneNumber = new String[1];
            phoneNumber[0] = mobile;
            msg.setPhoneNumber(phoneNumber);
            MtMessageRes mtMessageRes = ioperator.sendSms(ACCOUNT, DigestUtils.md5Hex(PASSWORD), "02", msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /*短信验证码校验*/
    public Boolean checkCode(UserInfo userInfo) {
        String phoneNumber1 = userInfo.getMobile();
        String code = userInfo.getEmail();
        String SmsCheckCode = mp.get(phoneNumber1);
        try {
            if ((SmsCheckCode == null ? code != null : !SmsCheckCode.equals(code)) && !SmsCheckCode.equals(code)) {
                System.out.println("失败");
                return false;
            } else {
                System.out.println("成功");
                return true;
            }
        } catch (Exception e) {
            throw new RuntimeException("短信验证失败", e);
        }
    }
}
