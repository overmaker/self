package cn.kepu.self.video.resource;

import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import cn.kepu.self.video.service.VideoLikesService;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.NOT_FOUND;

/**
 * 视频点赞
 *
 * @author 马亚星
 */
@Path("video-likes")
@Singleton
public class VideoLikesResouce {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final VideoLikesService videoLikesService = VideoLikesService.INSTANCE;

    @PUT
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void putVideoLikes(
            @FormParam("user") final Long user,
            @FormParam("video") final Long video,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> videoLikesService.setVideoLikes(user, video), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.noContent().build());
                    }
                }, ioThreadPool);;
    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public void getVideoLikes(
            @QueryParam("user") final Long user,
            @QueryParam("video") final Long video,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoLikesService.getVideoLikes(user, video), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result == null) {
                            asyncResponse.resume(Response.status(NOT_FOUND).build());
                        } else {
                            asyncResponse.resume(result.getRoll());
                        }
                    }
                }, ioThreadPool);
    }

}
