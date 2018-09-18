package cn.kepu.self.others.resource;

import cn.kepu.self.others.entity.Advertisement;
import cn.kepu.self.others.service.AdvertisementService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
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
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.NO_CONTENT;

/**
 *
 * @author 李成志
 */
@Path("advertisement")
@Singleton
public final class AdvertisementResource {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final AdvertisementService advertisementService = AdvertisementService.INSTANCE;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addAdvertisement(final Advertisement advertisement,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> advertisementService.addAdvertisement(advertisement), ioThreadPool).
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
    public void updateAdvertisement(final Advertisement advertisement,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> advertisementService.updateAdvertisement(advertisement), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }

    //删除活动分类
    @DELETE
    @Path("{id}")
    public void deleteAdvertisement(@PathParam("id") final Long id,//分类id
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> advertisementService.deleteAdvertisement(id), ioThreadPool).
                whenCompleteAsync((voidValue, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.noContent().build());
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void findCooperation(
            @PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> advertisementService.findById(id), ioThreadPool).
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
    public void selectAdvertisementAll(@QueryParam("title") final String title,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> advertisementService.selectAdvertisement(title, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
}
