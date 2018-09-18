package cn.kepu.self.site.resource;

import cn.kepu.self.site.service.WeiXinService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
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
@Path("weixin")
@Singleton
public final class WeiXinResource {

    private final WeiXinService weiXinService = WeiXinService.INSTANCE;
    
    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void getConfig(@Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> weiXinService.getConfig(), cpuThreadPool).
                whenCompleteAsync((config, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(config);
                    }
                }, cpuThreadPool);
    }
}
