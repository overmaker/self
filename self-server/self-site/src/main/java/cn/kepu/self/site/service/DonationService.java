package cn.kepu.self.site.service;

import cn.kepu.self.site.dao.DonationDAO;
import cn.kepu.self.site.entity.Donation;
import com.github.wxpay.sdk.WXPayConstants;
import com.github.wxpay.sdk.WXPayConstants.SignType;
import com.github.wxpay.sdk.WXPayUtil;
import static com.github.wxpay.sdk.WXPayUtil.generateSignature;
import static com.github.wxpay.sdk.WXPayUtil.generateSignedXml;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.net.ssl.HttpsURLConnection;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 *
 * @author
 */
public enum DonationService {
    INSTANCE;

    private static final Map<RenderingHints.Key, Object> RENDERING_HINTS = new HashMap();
    private static final Map<EncodeHintType, Object> QR_RENDERING_HINTS = new HashMap();

    static {
        RENDERING_HINTS.put(RenderingHints.KEY_ALPHA_INTERPOLATION, RenderingHints.VALUE_ALPHA_INTERPOLATION_QUALITY);
        RENDERING_HINTS.put(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        RENDERING_HINTS.put(RenderingHints.KEY_COLOR_RENDERING, RenderingHints.VALUE_COLOR_RENDER_QUALITY);
        RENDERING_HINTS.put(RenderingHints.KEY_DITHERING, RenderingHints.VALUE_DITHER_DISABLE);
        RENDERING_HINTS.put(RenderingHints.KEY_FRACTIONALMETRICS, RenderingHints.VALUE_FRACTIONALMETRICS_ON);
        RENDERING_HINTS.put(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        RENDERING_HINTS.put(RenderingHints.KEY_STROKE_CONTROL, RenderingHints.VALUE_STROKE_PURE);
        RENDERING_HINTS.put(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        QR_RENDERING_HINTS.put(EncodeHintType.CHARACTER_SET, "utf-8");
        QR_RENDERING_HINTS.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        QR_RENDERING_HINTS.put(EncodeHintType.MARGIN, 1);
    }

    private DonationService() {
    }

    private String appId;
    private String mchId;
    private String apiKey;
    private String notifyURL;
    private DonationDAO donationDAO;
    String timeStamp = Long.toString(WXPayUtil.getCurrentTimestamp());

    public static DonationService getInstance() {
        return INSTANCE;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public void setMchId(String mchId) {
        this.mchId = mchId;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public void setNotifyURL(String notifyURL) {
        this.notifyURL = notifyURL;
    }

    public void setDonationDAO(DonationDAO donationDAO) {
        this.donationDAO = donationDAO;
    }

    /*移动端微信支付*/
 /*移动端微信支付-获取oppenid*/
    public Authorize getAuthorize(String code) {
        Authorize authorize = null;
        try {
//		HttpClient hc = new HttpClient();
            Map<String, String> params = new HashMap<String, String>();
            params.put("appid", "wx077c19da2c0ddefa");
            params.put("secret", "2dd77414d4288eab283e950f29ea1e76");
            params.put("code", code);
            params.put("grant_type", "authorization_code");
            String url = "https://api.weixin.qq.com/sns/oauth2/access_token";
            //	authorize =  hc.post(url, params, new JsonParser<Authorize>(Authorize.class));
            authorize = SendSmsClient.sendSms(url, params);
        } catch (Exception e) {
//			log.error("getOpenid erro message:" + e.getMessage(), e);
        }
        return authorize;
    }

    /**
     * 调用微信统一下单接口，得到prepay_id
     */
    private Map<String, String> getWXPrepay2(Donation donation) throws Exception {
        Double totalFee = donation.getTotal_fee();
        final String sn = generateSN();
        String openid = donation.getUser().getUserName();
        String remoteIP = "192.168.1.111";
        String nonce_str = WXPayUtil.generateUUID();
        String timeStamp = Long.toString(WXPayUtil.getCurrentTimestamp());
        Map<String, String> mp = new HashMap<>();
        mp.put("appid", appId);
        mp.put("mch_id", mchId);
        mp.put("device_info", "WEB");
        mp.put("nonce_str", nonce_str);
        mp.put("body", "test");
        mp.put("out_trade_no", sn);
        mp.put("fee_type", "CNY");
        mp.put("timeStamp", timeStamp);

        BigDecimal price = new BigDecimal(totalFee);
        price = price.multiply(new BigDecimal("100")); // 单位元转换为分

        mp.put("total_fee", Integer.toString(price.intValue()));
        mp.put("spbill_create_ip", remoteIP);
        mp.put("notify_url", notifyURL);
        mp.put("trade_type", "JSAPI");
        mp.put("sign_type", "MD5");
        mp.put("openid", openid);

        String signXML = generateSignedXml(mp, apiKey, WXPayConstants.SignType.MD5);

        String URL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
        HttpsURLConnection con = (HttpsURLConnection) new URL(URL).openConnection();
        con.setRequestProperty("Host", "api.mch.weixin.qq.com");
        con.setDoOutput(true);
        con.setRequestMethod("POST");
        con.setConnectTimeout(10 * 1000);
        con.setReadTimeout(10 * 1000);
        con.connect();

        try (OutputStream outputStream = con.getOutputStream();) {
            outputStream.write(signXML.getBytes("utf-8"));
            outputStream.flush();
        }

        try (InputStream input = con.getInputStream();) {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            dbf.setValidating(false);
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(input);

            NodeList nodeList = doc.getChildNodes().item(0).getChildNodes();

            String return_code = null;
            String result_code = null;
            String prepay_id = null;
            for (int i = 0, len = nodeList.getLength(); i < len; i++) {
                Node node = nodeList.item(i);

                if (node.getNodeName().equalsIgnoreCase("return_code")) {
                    return_code = node.getTextContent();
                }
                if (node.getNodeName().equalsIgnoreCase("result_code")) {
                    result_code = node.getTextContent();
                }
                if (node.getNodeName().equalsIgnoreCase("prepay_id")) {
                    prepay_id = node.getTextContent();
                }
            }

            Map<String, String> result = new HashMap<>();
            if (return_code.equalsIgnoreCase("SUCCESS") && result_code.equalsIgnoreCase("SUCCESS") && prepay_id != null) {
                result.put("prepay_id", prepay_id);
                return result;
            } else {
                return null;
            }
        }
    }

    /**
     * 通过getPrepayId 下单支付
     */
    public String getPrepayId(Donation donation) throws Exception {

        Map<String, String> mp = getWXPrepay2(donation);
        String sn = mp.get("out_trade_no");
        if (mp == null) {
            return "{\"sn\": \"" + sn + "\", \"prepay_id\": null, \"code\":500}";
        } else {
            String prepay_id = mp.get("prepay_id");
            /* 写入数据库 */
            donation.setSn(sn);
            addOrder(donation);
            String nonce_str_2 = WXPayUtil.generateUUID();
            Map<String, String> resultmap = new HashMap<>();
            resultmap.put("appId", appId);
            resultmap.put("timeStamp", timeStamp);
            resultmap.put("nonceStr", nonce_str_2);
            resultmap.put("package", "prepay_id=" + prepay_id);
            resultmap.put("signType", "MD5");
            String paySign = generateSignature(resultmap, apiKey, SignType.MD5);
            String str = "{\"package\":\"" + ("prepay_id=" + mp.get("prepay_id")) + "\",\"paySign\":\"" + paySign + "\",\"nonceStr\":\"" + nonce_str_2 + "\",\"timeStamp\":\"" + timeStamp + "\",\"code\":200}";
            return str;
        }

    }

    /*回调地址*/
    public String notifymobile(String xml) {
        boolean signValid = false;
        String app_id = null;
        String mch_id = null;
        String sn = null;
        try {
            Map<String, String> mp = WXPayUtil.xmlToMap(xml);
            signValid = WXPayUtil.isSignatureValid(xml, apiKey);
            app_id = mp.get("appid");
            mch_id = mp.get("mch_id");
            sn = mp.get("out_trade_no");
        } catch (final Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        if (signValid && app_id.equals(appId) && mch_id.equals(mchId) && sn != null) {
            donationDAO.paymentSuccess(sn);
        }
        String returnStr = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
        return returnStr;
    }

    public String payNotidy(String xml) {
        boolean signValid = false;
        String app_id = null;
        String mch_id = null;
        String sn = null;
        try {
            Map<String, String> mp = WXPayUtil.xmlToMap(xml);
            signValid = WXPayUtil.isSignatureValid(xml, apiKey);
            app_id = mp.get("appid");
            mch_id = mp.get("mch_id");
            sn = mp.get("out_trade_no");
        } catch (final Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        if (signValid && app_id.equals(appId) && mch_id.equals(mchId) && sn != null) {
            donationDAO.paymentSuccess(sn);
        }
        String returnStr = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
        return returnStr;
    }

    private void addOrder(Donation donation) {
        donationDAO.addOrder(donation);
    }

    private static final SimpleDateFormat DATETIME_FORMAT = new SimpleDateFormat("yyyyMMddHHmmss");

    /**
     * 生成订单号
     *
     * @return
     */
    private static String generateSN() {
        Random r = new Random();
        return DATETIME_FORMAT.format(new Date()) + Stream.of(
                (long) r.nextInt(10),
                (long) r.nextInt(10),
                (long) r.nextInt(10),
                (long) r.nextInt(10),
                (long) r.nextInt(10)).
                map(n -> Long.toHexString(n)).collect(Collectors.joining("")).toUpperCase();
    }

    private Map<String, String> getWXPrepay(Donation donation) throws Exception {
        Map<String, String> resultMap = new HashMap();
        Double totalFee = donation.getTotal_fee();
        final String sn = generateSN();
        String nonce_str = WXPayUtil.generateUUID();
        String timeStamp = Long.toString(WXPayUtil.getCurrentTimestamp());
        String spbill_create_ip = "192.168.1.111";

        Map<String, String> mp = new HashMap<>();
        mp.put("appid", appId);
        mp.put("mch_id", mchId);
        mp.put("device_info", "WEB");
        mp.put("nonce_str", nonce_str);
        mp.put("body", "视频打赏");
        mp.put("out_trade_no", sn);
        mp.put("fee_type", "CNY");
        mp.put("timeStamp", timeStamp);

        BigDecimal price = new BigDecimal(String.valueOf(totalFee));
        price = price.multiply(new BigDecimal("100")); // 单位元转换为分

        mp.put("total_fee", Integer.toString(price.intValue()));
        mp.put("spbill_create_ip", spbill_create_ip);
        mp.put("notify_url", notifyURL);
        mp.put("trade_type", "NATIVE");
        mp.put("sign_type", "MD5");

        String signXML = generateSignedXml(mp, apiKey, WXPayConstants.SignType.MD5);

        String URL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
        HttpsURLConnection con = (HttpsURLConnection) new URL(URL).openConnection();
        con.setRequestProperty("Host", "api.mch.weixin.qq.com");
        con.setDoOutput(true);
        con.setRequestMethod("POST");
        con.setConnectTimeout(10 * 1000);
        con.setReadTimeout(10 * 1000);
        con.connect();

        try (OutputStream outputStream = con.getOutputStream();) {
            outputStream.write(signXML.getBytes("utf-8"));
            outputStream.flush();
        }

        String return_code = null;
        String result_code = null;
        String prepay_id = null;
        String code_url = null;
        try (InputStream input = con.getInputStream();) {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            dbf.setValidating(false);
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(input);

            NodeList nodeList = doc.getChildNodes().item(0).getChildNodes();

            for (int i = 0, len = nodeList.getLength(); i < len; i++) {
                Node node = nodeList.item(i);
                resultMap.put(node.getNodeName(), node.getTextContent());
                if (node.getNodeName().equals("return_code")) {
                    return_code = node.getTextContent();
                }
                if (node.getNodeName().equals("result_code")) {
                    result_code = node.getTextContent();
                }
                if (node.getNodeName().equals("prepay_id")) {
                    prepay_id = node.getTextContent();
                }
                if (node.getNodeName().equals("code_url")) {
                    code_url = node.getTextContent();
                }
            }
        }
        if (return_code.equals("SUCCESS") && result_code.equals("SUCCESS")) {
            donation.setSn(sn);
            addOrder(donation);
        }

        return resultMap;
    }

    public Map<String, String> pay(Donation donation) {
        try {
            Map<String, String> map = getWXPrepay(donation);
            return map;
        } catch (final Exception e) {
            e.printStackTrace();
            return Collections.EMPTY_MAP;
        }
    }

    public BufferedImage generateQRCode(String data) {
        System.out.println(data);
        if (data == null) {
            throw new IllegalArgumentException("title or qrContent invalid.");
        }
        try {
            BitMatrix bitMatrix = new QRCodeWriter().encode(data, BarcodeFormat.QR_CODE, 200, 200, QR_RENDERING_HINTS);
            BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
            return qrImage;

        } catch (WriterException e) {
            throw new RuntimeException(e);
        }
    }
}
