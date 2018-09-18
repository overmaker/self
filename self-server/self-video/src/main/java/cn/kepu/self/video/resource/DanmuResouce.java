package cn.kepu.self.video.resource;

import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import cn.kepu.self.video.entity.Danmu;
import cn.kepu.self.video.service.DanmuService;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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
import static javax.ws.rs.core.Response.Status.NO_CONTENT;

/**
 * 视频弹幕
 *
 * @author 周
 */
@Path("danmu")
@Singleton
public class DanmuResouce {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final DanmuService danmuService = DanmuService.INSTANCE;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addDanmu(final Danmu danmu,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> danmuService.addDanmu(danmu), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);

    }

    @DELETE
    @Path("{id}")
    public void delDanmu(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> danmuService.delDanmu(id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result == 0) {
                            asyncResponse.resume(Response.status(NO_CONTENT).build());
                        } else if (result == 2) {
                            asyncResponse.resume(Response.status(BAD_REQUEST).build());
                        } else {
                            asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                        }
                    }
                }, ioThreadPool);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void selectDanmu(
            @QueryParam("user-id") final Long userId,
            @QueryParam("video-id") final Long videoId,
            @QueryParam("during-time-start") final Double duringTimeStart,
            @QueryParam("during-time-end") final Double duringTimeEnd,
            @QueryParam("content") final String content,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> danmuService.selectDanmu(userId, videoId, duringTimeStart, duringTimeEnd, content), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

//    @GET
//    @Path("/count")
//    @Produces(MediaType.TEXT_PLAIN)
//    public void selDanmuCount(@QueryParam("video") final Long videoId,
//            @Suspended final AsyncResponse asyncResponse) {
//        CompletableFuture.
//                supplyAsync(() -> danmuService.selDanmuCount(videoId), ioThreadPool).
//                whenCompleteAsync((result, err) -> {
//                    if (err != null) {
//                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
//                    } else {
//                        asyncResponse.resume(result);
//                    }
//                }, ioThreadPool);
//    }
    //    后台审核
    @GET
    @Path("admin")
    @Produces(MediaType.APPLICATION_JSON)
    public void adminVideoDanmu(
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @QueryParam("user-id") final Long userId,
            @QueryParam("video-id") final Long videoId,
            @QueryParam("video-title") final String videoTitle,
            @QueryParam("comment") final String comment,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> danmuService.adminVideoDanmu(offset, count, userId, videoId, videoTitle, comment), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @PUT
    @Path("{id}")
    public void adminChangeDanmu(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> danmuService.adminChangeDanmu(id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result == 0) {
                            asyncResponse.resume(Response.status(NO_CONTENT).build());
                        } else if (result == 2) {
                            asyncResponse.resume(Response.status(BAD_REQUEST).build());
                        } else {
                            asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                        }
                    }
                }, ioThreadPool);
    }

    //    即时弹幕审核
    @POST
    @Path("check")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public void danmuCheck(@FormParam("content") final String content,
            @Suspended final AsyncResponse asyncResponse) {
        System.out.println(content);
        CompletableFuture.
                supplyAsync(() -> danmuService.danmuCheck(content), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
        System.out.println(content);
    }

}
