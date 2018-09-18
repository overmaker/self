package cn.kepu.self.activity.resource;

import cn.kepu.self.activity.entity.Activity;
import cn.kepu.self.activity.service.ActivityService;
import cn.kepu.self.commons.service.ActivityJoinQRCodeService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
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
import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.NOT_FOUND;
import static javax.ws.rs.core.Response.Status.NO_CONTENT;

/**
 *
 * @author 李成志
 */
@Path("activity")
@Singleton
public final class ActivityResource {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final ActivityService activityService = ActivityService.INSTANCE;

    private final ActivityJoinQRCodeService activityJoinQRCodeService = ActivityJoinQRCodeService.INSTANCE;

    //新增活动
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public void addActivity(
            final Activity activity,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.runAsync(() -> activityService.addActivity(activity), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.ok().entity(activity.getId()).build());
                    }
                }, ioThreadPool);
    }

    //修改活动
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateActivityById(
            final Activity activity,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> activityService.updateActivityById(activity), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("/find/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void findActivity(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityService.findById(id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else if (result == null) {
                        asyncResponse.resume(Response.status(NOT_FOUND).build());
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("finds")
    @Produces(MediaType.APPLICATION_JSON)
    public void findActivityAll(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityService.findByAll(), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    /**
     * 活动首页展示的最新活动
     *
     * @param asyncResponse
     */
    @GET
    @Path("newest")
    @Produces(MediaType.APPLICATION_JSON)
    public void newestActivity(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityService.newestActivity(), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    /**
     * 活动首页展示的往期活动
     *
     * @param asyncResponse
     */
    @GET
    @Path("past")
    @Produces(MediaType.APPLICATION_JSON)
    public void pastActivity(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityService.pastActivity(), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    /*活动首页2018-6-25版本*/
    @PUT
    @Path("search625")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void complexSearch(final Activity activity,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityService.complexSearch(offset, count, activity), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @PUT
    @Path("search")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void selectActivity(final Activity activity,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityService.selectActivity(activity, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void selectActivity(@QueryParam("title") final String title,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityService.selectActivity(title, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @Path("qr-code")
    @GET
    @Produces("image/png")
    public void genQRCode(
            @QueryParam("title") final String title,
            @QueryParam("id") final Long activityId,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityJoinQRCodeService.generateQRContent(activityId), cpuThreadPool).
                thenApplyAsync(qrContent -> activityJoinQRCodeService.generateQRCode(title, qrContent), cpuThreadPool).
                whenCompleteAsync((bufferedImage, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(bufferedImage);
                    }
                }, ioThreadPool);
    }

    @Path("copy")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public void copyActivity(@FormParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.runAsync(() -> activityService.copyActivity(id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.ok().build());
                    }
                }, ioThreadPool);
    }

//    最新和最热
    @GET
    @Path("time")
    @Produces(MediaType.APPLICATION_JSON)
    public void timeSearch(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> activityService.TimeSearch(), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result == null) {
                            asyncResponse.resume(Response.status(BAD_REQUEST).build());
                        } else {
                            asyncResponse.resume(result);
                        }
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("fee")
    @Produces(MediaType.APPLICATION_JSON)
    public void FeeSearch(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> activityService.FeeSearch(), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result == null) {
                            asyncResponse.resume(Response.status(BAD_REQUEST).build());
                        } else {
                            asyncResponse.resume(result);
                        }
                    }
                }, ioThreadPool);
    }

    //    直播活动首页123
    @GET
    @Path("futureLive")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectFutureLive(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityService.selectFutureLive(), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("living")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectLiving(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityService.selectLiving(), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("pastLive")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectPastLive(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityService.selectPastLive(), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    //    通过id查询直播活动
    @GET
    @Path("/livefind/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectLiveById(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityService.selectLiveById(id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else if (result == null) {
                        asyncResponse.resume(Response.status(NOT_FOUND).build());
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    /*  self+往期活动*/
    @PUT
    @Path("pastSelf")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void selectPastSelf(Activity activity,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityService.selectPastSelf(activity, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @PUT
    @Path("list")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void selectActivityList(final Activity activity,
            @QueryParam("is-joining") final Boolean joinning,
            @QueryParam("is-over") final Boolean over,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityService.getActivityList(activity, joinning, over, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
    
}
