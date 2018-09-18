package cn.kepu.self.commons.resource;

import cn.kepu.self.commons.entity.UserInfo;
import cn.kepu.self.commons.service.UserInfoService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;

/**
 * 用户基本信息
 *
 * @author 马亚星
 */
@Path("user-info")
@Singleton
public class UserInfoResouce {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final UserInfoService userInfoService = UserInfoService.INSTANCE;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void searchUserInfo(
            @QueryParam("name") final String name,
            @QueryParam("nickname") final String nickname,
            @QueryParam("mobile") final String mobile,
            @QueryParam("email") final String email,
            @QueryParam("isVolunteer") final Boolean isVolunteer,
            @QueryParam("isVip") final Boolean isVip,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> userInfoService.selectUserInfo(offset, count, name, nickname, mobile, email, isVolunteer, isVip), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectById(
            @PathParam("id") final Long userId,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> userInfoService.selectUserInfoById(userId), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @PUT
    @Path("isvip/{id}")
    public void updateUserInfoIsVip(@PathParam("id") final Long userId,
            @FormParam("vip") final boolean vip,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> userInfoService.updateUserInfoIsVip(userId, vip), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.noContent().build());
                    }
                }, ioThreadPool);
    }

    @PUT
    @Path("volunteer/{id}")
    public void updateUserInfoIsVolunteer(@PathParam("id") final Long userId,
            @FormParam("volunteer") final boolean volunteer,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> userInfoService.updateUserInfoIsVolunteer(userId, volunteer), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.noContent().build());
                    }
                }, ioThreadPool);
    }

    @POST
    public void insertOrUpdateUserInfo(final UserInfo userInfo,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> userInfoService.insertOrUpdateUserInfo(userInfo), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.noContent().build());
                    }
                }, ioThreadPool);
    }
}
