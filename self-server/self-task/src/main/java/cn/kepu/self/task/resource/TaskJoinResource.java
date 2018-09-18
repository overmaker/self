package cn.kepu.self.task.resource;

import cn.kepu.self.task.service.TaskJoinService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
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
import static javax.ws.rs.core.Response.Status.NO_CONTENT;
import static javax.ws.rs.core.Response.Status.CONFLICT;

/**
 * 领取任务
 *
 * @author 马亚星
 */
@Path("task-join")
@Singleton
public class TaskJoinResource {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final TaskJoinService taskJoinService = TaskJoinService.INSTANCE;

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addTaskJoin(@FormParam("user") final Long user,
            @FormParam("task") final Long task,
            @FormParam("mobile") final String mobile,
            @FormParam("email") final String email,
            @FormParam("status") final Integer status,
            @FormParam("score") final int score,
            @FormParam("name") final String name,
            @Suspended final AsyncResponse asyncResponse) {
        System.out.println("111");
        CompletableFuture.
                supplyAsync(() -> taskJoinService.addTaskJoin(user, task, mobile, email, status, name, score), ioThreadPool).
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

    @PUT
    @Path("{id}")
    public void updateTaskJoin(@FormParam("user") final Long type,
            @FormParam("task") final Long task,
            @FormParam("mobile") final String mobile,
            @FormParam("email") final String email,
            @FormParam("status") final Integer status,
            @FormParam("score") final Integer score,
            @FormParam("name") final String name,
            @PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> taskJoinService.updateTaskJoin(id, task, mobile, email, status, name, score, id), ioThreadPool).
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

    @PUT
    @Path("/update-status/{id}")
    public void updateTaskJoinByStatus(@FormParam("status") final Integer status,
            @PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> taskJoinService.updateTaskJoinByStatus(status, id), ioThreadPool).
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
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void searchTaskJoin(@QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @QueryParam("status") final Integer status,
            @QueryParam("email") final String email,
            @QueryParam("name") final String name,
            @QueryParam("mobile") final String mobile,
            @Suspended final AsyncResponse asyncResponse) {

        CompletableFuture.
                supplyAsync(() -> taskJoinService.selTaskJoin(offset, count, status, email, name, mobile), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
    
    @GET
    @Path("/count/{task}")
    public void countTaskJoin(@PathParam("task") final Long task,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> taskJoinService.countTaskJoin(task), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
}
