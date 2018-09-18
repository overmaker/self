package cn.kepu.self.commons.resource;

import cn.kepu.self.commons.entity.User;
import cn.kepu.self.commons.entity.UserInfo;
import cn.kepu.self.commons.jersey.provider.RemoteIP;
import cn.kepu.self.commons.service.IpService;
import cn.kepu.self.commons.service.UserService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.CookieParam;
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
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.CONFLICT;

import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.NO_CONTENT;

/**
 *
 * @author 劉一童
 */
@Path("user")
@Singleton
public final class UserResource {

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();
    private final UserService userService = UserService.INSTANCE;
    private final IpService ipService = IpService.INSTANCE;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void getUser(@CookieParam("token") final String token,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> userService.getUser(token), ioThreadPool).
                whenCompleteAsync((user, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (user != null) {
                            asyncResponse.resume(user);
                        } else {
                            asyncResponse.resume(Response.status(401).build());
                        }
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("ip")
    @RemoteIP
    @Produces(MediaType.APPLICATION_JSON)
    public void ipExistsInRange(
            @HeaderParam("remote-ip") final String remoteIp,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> ipService.ipExistsInRange(remoteIp), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result != null) {
                            asyncResponse.resume(result);
                        } else {
                            asyncResponse.resume(Response.status(401).build());
                        }
                    }
                }, ioThreadPool);
    }

    //注册用户
    @Path("register")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void registerUser(User user,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> userService.registerUser(user), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result == true) {
                            asyncResponse.resume(Response.status(NO_CONTENT).build());
                        } else {
                            asyncResponse.resume(Response.status(CONFLICT).build());
                        }
                    }
                }, ioThreadPool);

    }

    @Path("check3")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void check3(UserInfo userInfo,
            @Suspended final AsyncResponse asyncResponse) {
         System.out.println(0);
        CompletableFuture.
                supplyAsync(() -> userService.check3(userInfo), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        err.printStackTrace();
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result != null) {
                            asyncResponse.resume(Response.status(NO_CONTENT).build());
                        } else {
                            asyncResponse.resume(Response.status(CONFLICT).build());
                        }
                    }
                }, ioThreadPool);

    }

  @Path("checkCode")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void checkCode(UserInfo userInfo,
            @Suspended final AsyncResponse asyncResponse) {

        CompletableFuture.
                supplyAsync(() -> userService.checkCode(userInfo), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
        

    }
}
