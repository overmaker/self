package cn.kepu.self.commons.http;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.charset.Charset;
import java.util.List;
import java.util.logging.LogManager;
import javax.net.ssl.SSLContext;
import javax.ws.rs.core.UriBuilder;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.grizzly.http.server.StaticHttpHandler;
import org.glassfish.grizzly.http.util.MimeType;
import org.glassfish.grizzly.ssl.SSLEngineConfigurator;
import org.glassfish.jersey.SslConfigurator;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;

/**
 *
 * @author 劉一童
 */
public final class SelfHttpServer {

    static {
        try (final InputStream input = ClassLoader.getSystemResourceAsStream("grizzly-server.properties")) {
            LogManager.getLogManager().readConfiguration(input);
        } catch (final IOException ioe) {
            System.err.println(ioe.getMessage());
            System.exit(1);
        }
    }

    private final HttpServer server;

    public SelfHttpServer(String host, int port, String context, String storeFile, String keyStorePassword, boolean isDebug, List<String> packages) throws IOException {
        SSLContext sslContext = SslConfigurator.newInstance().
                keyStoreFile(storeFile).
                keyStorePassword(keyStorePassword).
                createSSLContext();

        SSLEngineConfigurator sslConfig = new SSLEngineConfigurator(sslContext).
                setClientMode(false).
                setNeedClientAuth(false);

        URI uri = UriBuilder.fromPath(context).
                scheme("https").
                host(host).
                port(port).build();

        ResourceConfig resourceConfig = new ResourceConfig()
                .packages(packages.toArray(new String[0]))
                .register(MultiPartFeature.class);

        server = GrizzlyHttpServerFactory.createHttpServer(uri, resourceConfig, true, sslConfig);

        if (isDebug) {
            MimeType.add("woff", "application/x-font-woff");
            MimeType.add("woff2", "application/x-font-woff2");
            MimeType.add("eot", "application/vnd.ms-fontobject");
            MimeType.add("ttf", "application/x-font-ttf");
            MimeType.add("mp4", "video/mp4");
            MimeType.add("m3u8", "application/x-mpegURL");
            MimeType.add("wmv", "video/x-ms-wmv");
            MimeType.add("flv", "video/x-flv");
            MimeType.add("3gp", "video/3gpp");
            MimeType.add("m4v", "video/x-m4v");

            final String[] extensions = {"*.html", "*.htm", "*.js", "*.css",
                "*.jpeg", "*.jpg", "*.png", "*.gif", "*.ico", "*.pdf",
                "*.eot", "*.svg", "*.ttf", "*.woff", "*.woff2",
                "*.mp4", "*.mov", "*.m3u8", "*.avi", "*.wmv", "*.flv", "*.3gp", "*.m4v",
                "*.srt", "*.vtt"};

            StaticHttpHandler staticHttpHandler = new StaticHttpHandler("webclient");
            staticHttpHandler.setFileCacheEnabled(false);
            staticHttpHandler.setRequestURIEncoding(Charset.forName("UTF-8"));
            server.getServerConfiguration().addHttpHandler(staticHttpHandler, extensions);
        }

    }

    public void start() throws IOException {
        server.start();
    }

    public void stop() {
        server.shutdownNow();
    }
}
