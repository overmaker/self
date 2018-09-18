package cn.kepu.self.commons.resource;

import cn.kepu.self.commons.service.AuthService;
import cn.kepu.self.commons.service.UserService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import cn.kepu.self.util.Util;
import static cn.kepu.self.util.Util.isMobileDevice;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.CookieParam;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import static javax.ws.rs.core.Cookie.DEFAULT_VERSION;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import static javax.ws.rs.core.NewCookie.DEFAULT_MAX_AGE;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.UNAUTHORIZED;

/**
 *
 * @author 劉一童
 */
@Path("auth")
@Singleton
public final class AuthResource {

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final AuthService authService = AuthService.INSTANCE;
    private final UserService userService = UserService.INSTANCE;

    @GET
    @Path("url")
    @Produces(MediaType.TEXT_PLAIN)
    public void getAuthURL(
            @HeaderParam("user-agent") String userAgent,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> userAgent.toLowerCase(), cpuThreadPool).
                thenApplyAsync(ua -> isMobileDevice(ua), cpuThreadPool).
                thenApplyAsync(mobile -> mobile ? authService.getMobileClientAuthURL() : authService.getPCClientAuthURL(), cpuThreadPool).
                whenCompleteAsync((url, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(url);
                    }
                }, ioThreadPool);
    }

    @GET
    public void auth(@QueryParam("state") final String state,
            @QueryParam("code") final String code,
            @Suspended final AsyncResponse asyncResponse) {
        if (code != null) {
            CompletableFuture.
                    supplyAsync(() -> authService.getToken(code), ioThreadPool).
                    thenApplyAsync(token -> authService.getUserInfo(token), ioThreadPool).
                    thenApplyAsync(pair -> userService.addOrUpdateUser(pair.getV1(), pair.getV2()), ioThreadPool).
                    thenApplyAsync(user -> authService.generateToken(user.getUid()), ioThreadPool).
                    whenCompleteAsync((token, err) -> {
                        if (err != null) {
                            asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                        } else {
                            NewCookie cookies = new NewCookie("token", token, "/", null, DEFAULT_VERSION, null, DEFAULT_MAX_AGE, null, false, false);
                            asyncResponse.resume(Response.temporaryRedirect(Util.getURI(authService.getSuccessCallbackURL())).cookie(cookies).build());
                        }
                    }, ioThreadPool);
        } else {
            CompletableFuture.
                    runAsync(() -> asyncResponse.resume(Response.temporaryRedirect(Util.getURI(authService.getSuccessCallbackURL())).build()), ioThreadPool);
        }
    }
    
    /**
     * 通过科普统一登录平台登录
     * @param userName
     * @param password
     * @param asyncResponse 
     */
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void loginByKepu(
            @FormParam("user-name") final String userName,
            @FormParam("password") final String password,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> authService.getToken(userName, password), ioThreadPool).
                thenApplyAsync(token -> authService.getUserInfo(token), ioThreadPool).
                thenApplyAsync(pair -> userService.addOrUpdateUser(pair.getV1(), pair.getV2()), ioThreadPool).
                thenApplyAsync(user -> authService.generateToken(user.getUid()), ioThreadPool).
                whenCompleteAsync((token, err) -> {
                    if (err != null) {
                        if (err.getCause() instanceof IllegalArgumentException) {
                            asyncResponse.resume(Response.status(UNAUTHORIZED).build());
                        } else {
                            asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                        }
                    } else {
                        NewCookie cookies = new NewCookie("token", token, "/", null, DEFAULT_VERSION, null, DEFAULT_MAX_AGE, null, false, false);
                        asyncResponse.resume(Response.noContent().cookie(cookies).build());
                    }
                }, ioThreadPool);
    }
    
    /**
     * 通过self平台登录
     * @param userName
     * @param password
     * @param asyncResponse 
     */
    @Path("self")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void loginBySelf(
            @FormParam("user-name") final String userName,
            @FormParam("password") final String password,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> authService.login(userName, password), ioThreadPool).
                whenCompleteAsync((token, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (token == null) {
                            asyncResponse.resume(Response.status(UNAUTHORIZED).build());
                        } else {
                            NewCookie cookies = new NewCookie("token", token, "/", null, DEFAULT_VERSION, null, DEFAULT_MAX_AGE, null, false, false); // 生成无限期会话
                            asyncResponse.resume(Response.noContent().cookie(cookies).build());
                        }
                    }
                }, ioThreadPool);
    }

    @DELETE
    public void logout(@CookieParam("token") final String token,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> authService.logout(token), ioThreadPool).
                whenCompleteAsync((user, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        NewCookie cookies = new NewCookie("token", null, "/", null, DEFAULT_VERSION, null, 0, null, false, false);
                        asyncResponse.resume(Response.noContent().cookie(cookies).build());
                    }
                }, ioThreadPool);
    }
}
