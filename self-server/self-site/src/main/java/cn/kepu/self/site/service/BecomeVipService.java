package cn.kepu.self.site.service;

import cn.kepu.self.site.dao.BecomeVipDAO;
import cn.kepu.self.site.entity.BecomeVip;
import com.github.wxpay.sdk.WXPayConstants;
import com.github.wxpay.sdk.WXPayUtil;
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
public enum BecomeVipService {
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

    private BecomeVipService() {
    }

    private String appId;
    private String mchId;
    private String apiKey;
    private String notifyURL;
    private BecomeVipDAO becomeVipDAO;

    public static BecomeVipService getInstance() {
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

    public void setBecomeVipDAO(BecomeVipDAO becomeVipDAO) {
        this.becomeVipDAO = becomeVipDAO;
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
            becomeVipDAO.paymentSuccess(sn);
        }
        String returnStr = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
        return returnStr;
    }

    private void addOrder(BecomeVip becomeVip) {
        becomeVipDAO.addOrder(becomeVip);
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

    private Map<String, String> getWXPrepay(BecomeVip becomeVip) throws Exception {
        Map<String, String> resultMap = new HashMap();
        Double totalFee = becomeVip.getTotal_fee();
        final String sn = generateSN();
        String nonce_str = WXPayUtil.generateUUID();
        String timeStamp = Long.toString(WXPayUtil.getCurrentTimestamp());
        String spbill_create_ip = "192.168.1.111";

        Map<String, String> mp = new HashMap<>();
        mp.put("appid", appId);
        mp.put("mch_id", mchId);
        mp.put("device_info", "WEB");
        mp.put("nonce_str", nonce_str);
        mp.put("body", "成为vip");
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
            becomeVip.setSn(sn);
            addOrder(becomeVip);
        }

        return resultMap;
    }

    public Map<String, String> pay(BecomeVip becomeVip) {
        try {
            Map<String, String> map = getWXPrepay(becomeVip);
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
