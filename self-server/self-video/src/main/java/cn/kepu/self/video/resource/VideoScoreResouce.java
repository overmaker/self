package cn.kepu.self.video.resource;

import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import cn.kepu.self.video.service.VideoScoreService;
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
 * 视频评分
 *
 * @author 马亚星
 */
@Path("video-score")
@Singleton
public class VideoScoreResouce {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private VideoScoreService videoScoreService = VideoScoreService.INSTANCE;

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addVideoScore(@FormParam("user") final Long user,
            @FormParam("video") final Long video,
            @FormParam("score") final int score,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.runAsync(() -> videoScoreService.addVideoScore(user,video,score), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);

    }

    @DELETE
    @Path("{id}")
    public void delVideoScore(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoScoreService.delVideoScore(id), ioThreadPool).
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

    @PUT
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void upVideoScore(@FormParam("user") final Long user,
            @FormParam("video") final Long video,
            @FormParam("score") final int score,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoScoreService.upVideoScore(user, video, score), ioThreadPool).
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
    public void selTJVideoScore(@QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @QueryParam("video") final Long video,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoScoreService.selTJVideoScore(offset, count, video), ioThreadPool).
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
    @Path("research")
    @Produces(MediaType.TEXT_PLAIN)
    public void searVideoScore(@QueryParam("user") final Long user,
    		@QueryParam("video") final Long video,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoScoreService.searVideoScore(user, video), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
             
                            asyncResponse.resume(result);
                        
                    }
                }, ioThreadPool);
    }
}
