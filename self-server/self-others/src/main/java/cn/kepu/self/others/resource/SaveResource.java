package cn.kepu.self.others.resource;

import cn.kepu.self.others.entity.Save;
import cn.kepu.self.others.service.SaveService;
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
 * @author 周林敏
 */
@Path("save")
@Singleton
public final class SaveResource {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final SaveService saveService = SaveService.INSTANCE;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addSave(final Save save,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> saveService.addSave(save), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }
//
//    @PUT
//    @Consumes(MediaType.APPLICATION_JSON)
//    public void updateSave(final Save save,
//            @Suspended final AsyncResponse asyncResponse) {
//        CompletableFuture.
//                runAsync(() -> saveService.updateSave(save), ioThreadPool).
//                whenCompleteAsync((result, err) -> {
//                    if (err != null) {
//                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
//                    } else {
//                        asyncResponse.resume(Response.status(NO_CONTENT).build());
//                    }
//                }, ioThreadPool);
//    }
//
//    //删除收藏
//    @DELETE
//    @Path("{id}")
//    public void deleteSave(@PathParam("id") final Long id,//分类id
//            @Suspended final AsyncResponse asyncResponse) {
//        CompletableFuture.
//                runAsync(() -> saveService.deleteSave(id), ioThreadPool).
//                whenCompleteAsync((voidValue, err) -> {
//                    if (err != null) {
//                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
//                    } else {
//                        asyncResponse.resume(Response.noContent().build());
//                    }
//                }, ioThreadPool);
//    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void selectSaveAll(@QueryParam("id") final Long id,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> saveService.selectByUser(id, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    /*收藏验证*/
    @PUT
    @Path("check")
    @Consumes(MediaType.APPLICATION_JSON)
    public void saveCheck(final Save save,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> saveService.saveCheck(save), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
}
