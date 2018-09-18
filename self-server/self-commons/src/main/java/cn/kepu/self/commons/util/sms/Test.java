package cn.kepu.self.commons.util.sms;

import java.net.URL;

import org.apache.commons.codec.digest.DigestUtils;

import cn.kepu.self.commons.service.UserService;

/**
 * 类描述：企信通6.0用户接口短信客户端
 *
 * @version: 1.0
 * @author: 8521
 * @date: 2012-9-4 上午09:51:42
 */
public class Test {

    private static final String URL = "http://service.12302.cn:8080/ema/webService/smsOper?wsdl";
    private static final String ACCOUNT = "904";
    private static final String PASSWORD = "kepu-904";

    public static void main(String[] args) throws Exception {
        UserService u = UserService.getInstance();
//        u.check3("15197227051");
//        u.checkCode("1", "vcode111");
//        u.checkCode("15197227051", "vcode2a8ce0");
//        u.smsCode("15197227051");
//		 System.out.println(2);
//	        SmsOperatorImpServiceLocator locator = new SmsOperatorImpServiceLocator();
//	        System.out.println(3);
//	        try {
//	            ISmsOperator ioperator = locator.getSmsOperatorImpPort(new URL(URL));
//	            System.out.println(4);
//	            System.out.println("------------------------发送下行短信------------------------");
//	            // 发送短信
//	            MtMessage msg = new MtMessage();
//	            msg.setContent("444441");
//	            msg.setSubCode("1456");
//	            String[] phoneNumber = new String[1];
////				phoneNumber[0] = "18501215121";
//	            phoneNumber[0] = "15197227051";
//	            msg.setPhoneNumber(phoneNumber);
//	            System.out.println(5);
//	            MtMessageRes mtMessageRes = ioperator.sendSms(ACCOUNT, DigestUtils.md5Hex(PASSWORD), "02", msg);
//	            System.out.println(6);
//	            if ("r:000".equals(mtMessageRes.getSubStat())) {
//	                System.out.println("请求成功：" + mtMessageRes.getSubStat()
//	                        + ";描述: " + mtMessageRes.getSubStatDes());
//	                System.out.println("本次提交短信流水号:" + mtMessageRes.getSmsId());
//	                for (MtMessageResDetail detail : mtMessageRes.getResDetail()) {
//	                    System.out.println("发送手机号:" + detail.getPhoneNumber()
//	                            + ";提交状态:" + detail.getStat() + ";状态描述:"
//	                            + detail.getStatDes());
//	                }
//	            } else {
//	                System.out.println("请求失败,错误码：" + mtMessageRes.getSubStat()
//	                        + ";错误描述: " + mtMessageRes.getSubStatDes());
//	            }
//	        } catch (Exception e) {
//	            e.printStackTrace();
//	        }

    }
}
