package cn.kepu.self.commons.service;

import cn.kepu.self.commons.util.Util;
import com.google.zxing.WriterException;
import java.awt.image.BufferedImage;
import java.io.IOException;
import javax.json.Json;
import javax.json.JsonObjectBuilder;

/**
 *
 * @author 劉一童
 */
public enum ActivityJoinQRCodeService {
    INSTANCE;

    private ActivityJoinQRCodeService() {
    }

    public static ActivityJoinQRCodeService getInstance() {
        return INSTANCE;
    }

    public String generateQRContent(Long activityId) {
        if (activityId == null) {
            throw new IllegalArgumentException("activityId invalid.");
        }
        JsonObjectBuilder obj = Json.createObjectBuilder();
        obj.add("id", activityId);

        String url = "http://114.115.149.5/signIn.html?id=" + activityId;
        return url;
    }

    public BufferedImage generateQRCode(String title, String qrContent) {
        if (title == null || qrContent == null) {
            throw new IllegalArgumentException("title or qrContent invalid.");
        }
        try {
            return Util.generateQRCode(title, qrContent);
        } catch (WriterException | IOException e) {
            throw new RuntimeException(e);
        }
    }
}
