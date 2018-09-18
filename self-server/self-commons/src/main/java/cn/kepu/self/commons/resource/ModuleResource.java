package cn.kepu.self.commons.resource;

import cn.kepu.self.commons.service.ModuleService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.MediaType;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;

/**
 *
 * @author 劉一童
 */
@Path("modules")
@Singleton
public final class ModuleResource {

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final ModuleService moduleService = ModuleService.INSTANCE;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void getModules(@Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> moduleService.getAllModule(), ioThreadPool).
                whenCompleteAsync((list, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(list);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("users/{user-id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void getModules(
            @PathParam("user-id") final Long userId,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> moduleService.getModulesByUserId(userId), ioThreadPool).
                whenCompleteAsync((list, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(list);
                    }
                }, ioThreadPool);
    }
}
