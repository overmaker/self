package cn.kepu.self.commons.resource;

import cn.kepu.self.commons.entity.Role;
import cn.kepu.self.commons.service.AdminService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.json.Json;
import javax.json.JsonObjectBuilder;
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
import static javax.ws.rs.core.Response.Status.CONFLICT;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.NO_CONTENT;

/**
 *
 * @author 李成志
 */
@Path("admins")
@Singleton
public class AdminResource {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final AdminService adminService = AdminService.INSTANCE;

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addAdmin(
            @FormParam("user-name") String userName,
            @FormParam("password") String password,
            @FormParam("name") String name,
            @FormParam("role") Long roleId,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> adminService.addAdmin(userName, password, name, roleId), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result == true) {
                            asyncResponse.resume(Response.status(NO_CONTENT).build());
                        } else {
                            asyncResponse.resume(Response.status(CONFLICT).build());
                        }
                    }
                }, ioThreadPool);
    }
    
    @Path("{id}")
    @PUT
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void updateAdmin(
            @PathParam("id") Long id,
            @FormParam("password") String password,
            @FormParam("name") String name,
            @FormParam("role") Long roleId,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> adminService.updateAdmin(id, password, name, roleId), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }

    @Path("{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void getAdmin(
            @PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> adminService.getAdmin(id), ioThreadPool).
                whenCompleteAsync((pair, err) -> {
                    if (err != null) {
                        err.printStackTrace();
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        JsonObjectBuilder obj = Json.createObjectBuilder();
                        obj.add("user-name", pair.getV1().getUserName());
                        obj.add("password", pair.getV1().getPassword());
                        String name = pair.getV2().getName();
                        obj.add("name", name == null ? "" : name);
                        Role role = pair.getV1().getRole();
                        if (role != null) {
                            obj.add("role-id", pair.getV1().getRole().getId());
                            obj.add("role-name", pair.getV1().getRole().getName());
                        }
                        asyncResponse.resume(obj.build().toString());
                    }
                }, ioThreadPool);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void selectAdminAll(@QueryParam("name") final String name,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> adminService.selectAdmin(name, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
}
