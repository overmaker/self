package cn.kepu.self.activity.resource;

import cn.kepu.self.activity.entity.ActivityReport;
import cn.kepu.self.activity.service.ActivityReportService;
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
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.NO_CONTENT;

/**
 *
 * @author 李成志
 */
@Path("activity-report")
@Singleton
public class ActivityReportResource {
    
    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final ActivityReportService activityReportService = ActivityReportService.INSTANCE;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void insertActivityReport(final ActivityReport activityReport,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> activityReportService.insertActivityReport(activityReport), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.ok().build());
                    }
                }, ioThreadPool);
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateActivityReport(final ActivityReport activityReport,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> activityReportService.updateActivityReport(activityReport), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }

    @DELETE
    @Path("{id}")
    public void deleteActivityReport(@PathParam("id") final Long id,//分类id
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> activityReportService.deleteActivityReport(id), ioThreadPool).
                whenCompleteAsync((voidValue, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.noContent().build());
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("/find/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void findActivityReport(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityReportService.findById(id), ioThreadPool).
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
    public void selectActivityReport(@QueryParam("title") final String title,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityReportService.selectActivityReport(title, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
    
    @GET
    @Path("/page/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectActivityReport1(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> activityReportService.selectActivityReport1(id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
}
