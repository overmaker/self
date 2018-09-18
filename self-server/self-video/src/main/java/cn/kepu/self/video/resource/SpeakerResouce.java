package cn.kepu.self.video.resource;

import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import cn.kepu.self.video.entity.Speaker;
import cn.kepu.self.video.service.SpeakerService;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.validation.constraints.Past;
import javax.ws.rs.Consumes;
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
import static javax.ws.rs.core.Response.Status.NOT_FOUND;
import static javax.ws.rs.core.Response.Status.NO_CONTENT;

/**
 * 演讲者管理
 *
 * @author 马亚星
 */
@Path("speaker")
@Singleton
public class SpeakerResouce {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final SpeakerService spearkerService = SpeakerService.INSTANCE;

    /**
     *
     * @param speaker
     * @param asyncResponse
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addSpeaker(final Speaker speaker,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> spearkerService.addOrUpdateSpeaker(speaker), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);

    }

    @POST
    @Path("/admin/")
    @Consumes(MediaType.APPLICATION_JSON)
    public void addAdminSpeaker(final Speaker speaker,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> spearkerService.addOrUpdateAdminSpeaker(speaker), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);

    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateSpearker(final Speaker speaker,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> spearkerService.upSpearker(speaker), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);

    }

    @PUT
    @Path("/admin/")
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateAdminSpearker(final Speaker speaker,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> spearkerService.upAdminSpearker(speaker), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);

    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void searchVideoAlbum(@QueryParam("offset") final int offset,
            @QueryParam("count") final int pageSize,
            @QueryParam("name") final String name,
            @QueryParam("enable") final Boolean enable,
            @QueryParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> spearkerService.selSpeaker(offset, pageSize, name, enable, id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("/admin/")
    @Produces(MediaType.APPLICATION_JSON)
    public void searchAdminVideoAlbum(@QueryParam("offset") final int offset,
            @QueryParam("count") final int pageSize,
            @QueryParam("name") final String name,
            @QueryParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> spearkerService.selAdminSpeaker(offset, pageSize, name, id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("find/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void selvideoSpeaker(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> spearkerService.selvideoSpeaker(id), ioThreadPool)
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

    @GET
    @Path("findby/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void selSpeakerById(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> spearkerService.selSpeakerById(id), ioThreadPool)
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
}
