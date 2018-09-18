package cn.kepu.self.activity.resource;

import cn.kepu.self.activity.entity.ActivityTemplate;
import cn.kepu.self.activity.service.ActivityTemplateService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
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
import static javax.ws.rs.core.Response.Status.NOT_FOUND;
import static javax.ws.rs.core.Response.Status.NO_CONTENT;

/**
 * 活动模板
 *
 * @author 周林敏
 */
@Path("activity-template")
@Singleton
public class ActivityTemplateResouce {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private ActivityTemplateService activityTemplateService = ActivityTemplateService.INSTANCE;

//新增活动模板
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void insertActivityTemplate(final ActivityTemplate activityTemplate,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.runAsync(() -> activityTemplateService.insertActivityTemplate(activityTemplate), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);

    }

//修改活动模板
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateActivityTemplate(final ActivityTemplate activityTemplate,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> activityTemplateService.updateActivityTemplate(activityTemplate), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }

//查找活动模板
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void searchActivityTemplate(
            @QueryParam("name") final String name,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityTemplateService.searchActivityTemplate(name, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void findById(
            @PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> activityTemplateService.findById(id), ioThreadPool)
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

    //删除活动模板
    @DELETE
    @Path("{id}")
    public void deleteActivityTemplate(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityTemplateService.deleteActivityTemplate(id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (null == result) {
                            asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                        } else {
                            switch (result) {
                                case 0:
                                    asyncResponse.resume(Response.status(NO_CONTENT).build());
                                    break;
                                case 2:
                                    asyncResponse.resume(Response.status(BAD_REQUEST).build());
                                    break;
                                default:
                                    asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                                    break;
                            }
                        }
                    }
                }, ioThreadPool);
    }
}
