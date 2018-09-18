package cn.kepu.self.video.resource;

import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import cn.kepu.self.video.entity.VideoAlbum;
import cn.kepu.self.video.service.VideoAlbumService;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.CONFLICT;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.NO_CONTENT;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

/**
 *
 * @author 马亚星
 */
@Path("video-album")
@Singleton
public class VideoAlbumResource {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final VideoAlbumService videoAlbumService = VideoAlbumService.INSTANCE;

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addVideoAlbum(@FormParam("name") final String name,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoAlbumService.addVideoAlbum(name), ioThreadPool).
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
    public void delVideoAlbum(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoAlbumService.delVideoAlbum(id), ioThreadPool).
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
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void updateVideoAlbum(
            @FormParam("name") final String name,
            @PathParam("id") Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoAlbumService.updateVideoAlbum(name, id), ioThreadPool).
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
    public void searchVideoAlbum(@QueryParam("name") final String name,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        VideoAlbum videoAlbum = new VideoAlbum();
        videoAlbum.setName(name);
        CompletableFuture.
                supplyAsync(() -> videoAlbumService.selVideoAlbum(videoAlbum, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
}
