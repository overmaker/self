package cn.kepu.self.site.service;

import com.google.gson.Gson;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Map;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpConnectionManagerParams;
import org.apache.commons.httpclient.params.HttpMethodParams;
//import org.apache.log4j.Logger;

/**
 *
 * @author zhou
 * @version 1.0
 */
public class SendSmsClient {

    /**
     * log4J
     */
//    private static final Logger log = Logger.getLogger(SendSmsClient.class);
    public static Authorize sendSms(String url, Map<String, String> params) {
        PostMethod postMethod = null;
        try {
            postMethod = new PostMethod(url);
            postMethod.getParams().setParameter(
                    HttpMethodParams.HTTP_CONTENT_CHARSET, "UTF-8");
            postMethod.addParameter("appid", params.get("appid"));
            postMethod.addParameter("secret", params.get("secret"));
            postMethod.addParameter("code", params.get("code"));
            postMethod.addParameter("grant_type", params.get("grant_type"));
            HttpClient httpClient = new HttpClient();
            HttpConnectionManagerParams managerParams = httpClient
                    .getHttpConnectionManager().getParams();
            managerParams.setConnectionTimeout(60000);
            managerParams.setSoTimeout(120000);
            httpClient.executeMethod(postMethod);
            int code = postMethod.getStatusCode();
            String _sedrespContent = null;
            if (code == HttpStatus.SC_OK) {
                InputStream resStream = postMethod.getResponseBodyAsStream();
                BufferedReader br = new BufferedReader(new InputStreamReader(
                        resStream, "utf-8"));
                StringBuffer resBuffer = new StringBuffer();
                String resTemp = "";
                while ((resTemp = br.readLine()) != null) {
                    resBuffer.append(resTemp);
                }
                _sedrespContent = resBuffer.toString();
            }
            if (_sedrespContent != null) {
//                log.info("\n\n Send Res:" + _sedrespContent);
//                JSONObject obj = new JSONObject().fromObject(_sedrespContent);//将json字符串转换为json对象
//                Authorize jb = (Authorize) JSONObject.toBean(obj, Authorize.class);//将建json对象转换为JAVA对象
                Authorize job = new Gson().fromJson(_sedrespContent, Authorize.class);
                return job;
            }
        } catch (Exception e) {
            e.printStackTrace();
//            log.error("e :" + e);
        } finally {

            if (postMethod != null) {
                postMethod.releaseConnection();
            }

        }
        return null;

    }
}