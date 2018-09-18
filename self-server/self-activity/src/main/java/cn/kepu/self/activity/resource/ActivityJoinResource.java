package cn.kepu.self.activity.resource;

import cn.kepu.self.activity.service.ActivityJoinService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.MediaType;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;

/**
 *
 * @author 劉一童
 */
@Path("activity-join")
@Singleton
public final class ActivityJoinResource {

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final ActivityJoinService activityJoinService = ActivityJoinService.INSTANCE;

    /* 我参加过的活动*/
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void myActivity(@QueryParam("id") final Long activityId,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityJoinService.myActivity(activityId, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
}
