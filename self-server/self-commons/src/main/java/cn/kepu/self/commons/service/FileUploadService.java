package cn.kepu.self.commons.service;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 *
 * @author 劉一童
 */
public enum FileUploadService {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private FileUploadService() {}

    public static FileUploadService getInstance() {
        return INSTANCE;
    }
    
    private final Logger logger = LogManager.getLogger("cn.kepu.self");
    
    private String uploadPath;
    
    private String serverAddress;

    public void setUploadPath(String uploadPath) {
        this.uploadPath = uploadPath;
    }

    public void setServerAddress(String serverAddress) {
        if (!serverAddress.endsWith("/")) {
            serverAddress = (serverAddress + "/");
        }
        this.serverAddress = serverAddress;
    }
    
    private static String generateRandom() {
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
                r.nextInt(16)).
                map(Integer::toHexString).collect(Collectors.joining("")).toUpperCase();
    }

    public String upload(final InputStream uploadedInputStream, String subPath, String fileName) {

        Path dir = Paths.get(uploadPath, "upload", subPath);
        String randomFileName = new StringBuilder(generateRandom()).append('_').append(fileName).toString();
        Path filePath = Paths.get(uploadPath, "upload", subPath, randomFileName);

        try (InputStream input = uploadedInputStream) {
            Files.createDirectories(dir);
            Files.copy(input, filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (final Throwable e) {
            logger.error("上传文件时异常", e);
            throw new RuntimeException(e);
        }
        return new StringBuilder(serverAddress).append("upload/").append(subPath).append('/').append(randomFileName).toString();
    }

}
