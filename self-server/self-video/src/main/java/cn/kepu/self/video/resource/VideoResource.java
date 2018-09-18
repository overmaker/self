package cn.kepu.self.video.resource;

import cn.kepu.self.commons.jersey.provider.RemoteIP;
import cn.kepu.self.commons.service.MailService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import cn.kepu.self.video.entity.Video;
import cn.kepu.self.video.entity.VideoSearch;
import cn.kepu.self.video.service.VideoService;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
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
 * 视频管理
 *
 * @author 马亚星
 */
@Path("video")
@Singleton
public class VideoResource {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final VideoService videoService = VideoService.INSTANCE;
    private final MailService mailService = MailService.INSTANCE;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addVideo(final Video video, @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> videoService.addVideo(video), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }

    @PUT
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public void upVideo(final Video video, @PathParam("id") Long id, @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> video.setId(id), cpuThreadPool).
                thenRunAsync(() -> videoService.upVideo(video), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }

    @PUT
    @Path("check/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateVideoCheck(final Video video, @PathParam("id") Long id, @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.runAsync(() -> video.setId(id), cpuThreadPool)
                .thenRunAsync(() -> videoService.updateVideoCheck(video), ioThreadPool).whenCompleteAsync((result, err) -> {
            if (err != null) {
                asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
            } else {
                asyncResponse.resume(Response.status(NO_CONTENT).build());
            }
        }, ioThreadPool);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void searchVideo(
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @QueryParam("title") final String title,
            @QueryParam("isVip") final Boolean isVip,
            @QueryParam("isRecommend") final Boolean isRecommend,
            @QueryParam("isEnable") final Boolean isEnable,
            @QueryParam("type") final Long type,
            @QueryParam("album") final Long album,
            @Suspended final AsyncResponse asyncResponse) {

        CompletableFuture.
                supplyAsync(() -> videoService.selVideo(offset, count, title, isVip, isRecommend, isEnable, type, album), ioThreadPool).
                whenCompleteAsync((result, err) -> {
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

    /*微纪录*/
    @GET
    @Path("micro")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectMicro(
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            final Video video,
            @Suspended final AsyncResponse asyncResponse) {

        CompletableFuture.
                supplyAsync(() -> videoService.selectMicro(offset, count, video), ioThreadPool).
                whenCompleteAsync((result, err) -> {
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

    /*煮酒论道*/
    @GET
    @Path("dao")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectDao(
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            final Video video,
            @Suspended final AsyncResponse asyncResponse) {

        CompletableFuture.
                supplyAsync(() -> videoService.selectDao(offset, count, video), ioThreadPool).
                whenCompleteAsync((result, err) -> {
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
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @RemoteIP
    public void selByIdVideo(
            @PathParam("id") final Long id,
            @HeaderParam("remote-ip") final String remoteIp,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.selByIdVideo(id), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result == null) {
                            asyncResponse.resume(Response.status(NOT_FOUND).build());
                        } else {
                            asyncResponse.resume(result);
                        }
                    }
                }, ioThreadPool);
    }

    @PUT
    @Path("search")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void complexSearch(
            final VideoSearch videoSearch,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.complexSearch(videoSearch), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @PUT
    @Path("advance")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void advanceSearch(
            final VideoSearch videoSearch,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.advanceSearch(videoSearch), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @Path("copy")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public void copyVideo(@FormParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.runAsync(() -> videoService.copyVideo(id), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.ok().build());
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("time")
    @Produces(MediaType.APPLICATION_JSON)
    public void timeSearch(
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.TimeSearch(offset, count), ioThreadPool)
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
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.FeeSearch(offset, count), ioThreadPool)
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
    @Path("find/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void sameTimeSearch(@PathParam("id") final Long id,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.SameTimeSearch(id, offset, count), ioThreadPool)
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
    @Path("speaker/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectBySpeaker(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.selectBySpeaker(id), ioThreadPool)
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
    @Path("activity/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectByActivity(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.selectByActivity(id), ioThreadPool)
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

    //后台视频审核
    @PUT
    @Path("admincheck")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectByAdmin(final Video video,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.selectByAdmin(video), ioThreadPool)
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
    @Path("admintime")
    @Produces(MediaType.APPLICATION_JSON)
    public void admintimeCheck(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.selectByTime0(), ioThreadPool)
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

    //     后台视频管理排序1-6
    @GET
    @Path("admin1")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectByAdmin1(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.selectByAdmin1(), ioThreadPool)
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
    @Path("admin2")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectByAdmin2(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.selectByAdmin2(), ioThreadPool)
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
    @Path("admin3")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectByAdmin3(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.selectByAdmin3(), ioThreadPool)
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
    @Path("admin4")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectByAdmin4(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.selectByAdmin4(), ioThreadPool)
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
    @Path("admin5")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectByAdmin5(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.selectByAdmin5(), ioThreadPool)
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
    @Path("admin6")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectByAdmin6(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoService.selectByAdmin6(), ioThreadPool)
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

    //    删除视频关系表1-10
    @DELETE
    @Path("{id}")
    public void delVideo(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> videoService.delVideo(id), ioThreadPool).
                whenCompleteAsync((Void, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }
}
