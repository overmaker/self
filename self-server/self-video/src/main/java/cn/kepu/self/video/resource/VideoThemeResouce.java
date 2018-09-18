package cn.kepu.self.video.resource;

import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import cn.kepu.self.video.entity.VideoTheme;
import cn.kepu.self.video.service.VideoThemeService;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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
import static javax.ws.rs.core.Response.Status.CONFLICT;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.NO_CONTENT;
import static javax.ws.rs.core.Response.Status.NOT_FOUND;

/**
 * 视频主题
 *
 * @author 马亚星
 */
@Path("video-theme")
@Singleton
public class VideoThemeResouce {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final VideoThemeService videoThemeService = VideoThemeService.INSTANCE;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addVideoTheme(final VideoTheme videoTheme,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoThemeService.addVideoTheme(videoTheme), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result == 0) {
                            asyncResponse.resume(Response.status(NO_CONTENT).build());
                        } else if (result == 1) {
                            asyncResponse.resume(Response.status(CONFLICT).build());
                        } else if (result == 2) {
                            asyncResponse.resume(Response.status(BAD_REQUEST).build());
                        } else {
                            asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                        }
                    }
                }, ioThreadPool);
    }

    @DELETE
    @Path("{id}")
    public void delVideoTheme(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoThemeService.delVideoTheme(id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result) {
                            asyncResponse.resume(Response.status(NO_CONTENT).build());
                        } else {
                            asyncResponse.resume(Response.status(CONFLICT).build());
                        }
                    }
                }, ioThreadPool);
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateVideoTheme(final VideoTheme videoTheme,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoThemeService.updateVideoTheme(videoTheme), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result == 0) {
                            asyncResponse.resume(Response.status(NO_CONTENT).build());
                        } else if (result == 1) {
                            asyncResponse.resume(Response.status(CONFLICT).build());
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
    public void searchVideoTheme(@QueryParam("name") final String name,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoThemeService.searchVideoTheme(name, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("finds")
    @Produces(MediaType.APPLICATION_JSON)
    public void findVideoTheme(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoThemeService.findByAll(), ioThreadPool).
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
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void findById(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoThemeService.findById(id), ioThreadPool).
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
    @Path("order")
    @Produces(MediaType.APPLICATION_JSON)
    public void findByOrder(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoThemeService.findByOrder(), ioThreadPool).
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

}
