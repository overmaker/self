package cn.kepu.self.commons.resource;

import cn.kepu.self.commons.entity.UserAdvance;
import cn.kepu.self.commons.service.UserAdvanceService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.NO_CONTENT;

/**
 * 用户证书
 *
 * @author 马亚星
 */
@Path("user-advance")
@Singleton
public class UserAdvanceResouce {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final UserAdvanceService userAdvanceService = UserAdvanceService.INSTANCE;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addUserAdvance(UserAdvance userAdvance,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> userAdvanceService.addOrUpdateUserAdvance(userAdvance), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);

    }

    @DELETE
    @Path("{uid}")
    public void deleteUserAdvance(@PathParam("uid") final Long uid,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> userAdvanceService.delUserAdvance(uid), ioThreadPool).
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

    @Path("{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void searchUserAdvance(
            @PathParam("id") final Long uid,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> userAdvanceService.selectUserAdvance(uid), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
}
