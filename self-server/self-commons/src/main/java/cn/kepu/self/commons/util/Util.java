package cn.kepu.self.commons.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.Shape;
import java.awt.font.TextLayout;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.imageio.ImageIO;

/**
 *
 * @author 劉一童
 */
public final class Util {

    /**
     * 为self平台自维护用户生成用户UID
     *
     * @return 用户UID
     */
    public static String generateUid() {
        Random r = new Random();
        return "self_"
                + Stream.of(
                        r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16),
                        r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16),
                        r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16), r.nextInt(16),
                        r.nextInt(16), r.nextInt(16)).
                        map(Integer::toHexString).collect(Collectors.joining("")).toLowerCase();
    }

    /**
     * 生成20位16进制小写字符串作为用户登录令牌
     *
     * @return 20位16进制小写字符串
     */
    public static String generateToken() {
        Random r = new Random();
        return Stream.of(
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16),
                r.nextInt(16)).
                map(Integer::toHexString).collect(Collectors.joining("")).toLowerCase();
    }

    private static final BufferedImage LOGO = getLogo();
    private static final int LOGO_WIDTH = LOGO.getWidth();
    private static final int LOGO_HEIGHT = LOGO.getHeight();

    private static final int QR_WIDTH = 320;
    private static final int QR_HEIGHT = 320;

    private static final int TITLE_HEIGHT = 20;

    private static final int X = (QR_WIDTH - LOGO_WIDTH) >> 1;
    private static final int Y = ((QR_HEIGHT - LOGO_HEIGHT) >> 1) + TITLE_HEIGHT;

    private static final Map<RenderingHints.Key, Object> RENDERING_HINTS = new HashMap();
    private static final Map<EncodeHintType, Object> QR_RENDERING_HINTS = new HashMap();

    private static final Font DEFAULT_FONT = Font.decode("Dialog-PLAIN-12");

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

    private static BufferedImage getLogo() {
        try {
            return ImageIO.read(ClassLoader.getSystemResourceAsStream("cn/kepu/self/commons/icon/logo.png"));
        } catch (final Throwable e) {
            System.err.println(e.getMessage());
            return new BufferedImage(50, 50, BufferedImage.TYPE_INT_ARGB);
        }
    }

    public static BufferedImage generateQRCode(String title, String qrContent) throws WriterException, IOException {

        BitMatrix bitMatrix = new QRCodeWriter().encode(qrContent, BarcodeFormat.QR_CODE, QR_WIDTH, QR_HEIGHT, QR_RENDERING_HINTS);
        BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
        BufferedImage image = new BufferedImage(QR_WIDTH, QR_HEIGHT + 50, BufferedImage.TYPE_INT_ARGB);

        Graphics2D g2d = (Graphics2D) image.getGraphics().create();
        g2d.setBackground(Color.WHITE);
        g2d.fillRect(0, 0, QR_WIDTH, QR_HEIGHT + TITLE_HEIGHT);
        FontMetrics fm = g2d.getFontMetrics(DEFAULT_FONT);

        /* 画二维码 */
        g2d.addRenderingHints(RENDERING_HINTS);
        g2d.drawImage(qrImage, 0, TITLE_HEIGHT, Color.white, null);

        /* 画logo图标 */
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.75f));
        g2d.drawImage(LOGO, X, Y, Color.white, null);

        /* 画标题 */
        TextLayout textLayout = new TextLayout(title, DEFAULT_FONT, g2d.getFontRenderContext());
        AffineTransform affineTransform = AffineTransform.getTranslateInstance((QR_WIDTH - fm.stringWidth(title)) >> 1, (TITLE_HEIGHT >> 1) + (fm.getHeight() >> 2));
        Shape textShape = textLayout.getOutline(affineTransform);
        g2d.setPaint(Color.black);
        g2d.fill(textShape);
        g2d.draw(textShape);

        g2d.dispose();
        return image;
    }

    public static void writeQRCode(BufferedImage bufferedImage, OutputStream output) throws IOException {
        ImageIO.write(bufferedImage, "png", output);
    }
}
