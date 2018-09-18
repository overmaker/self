package cn.kepu.self.commons.resource;

import cn.kepu.self.commons.entity.Module;
import cn.kepu.self.commons.entity.Role;
import cn.kepu.self.commons.service.ModuleService;
import cn.kepu.self.commons.service.RoleService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
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
import static javax.ws.rs.core.Response.Status.CREATED;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.NO_CONTENT;

/**
 *
 * @author 劉一童
 */
@Path("roles")
@Singleton
public final class RoleResource {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();
    
    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();    

    private final RoleService roleService = RoleService.INSTANCE;

    private final ModuleService moduleService = ModuleService.INSTANCE;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void getRoles(@QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @QueryParam("name") final String name,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> roleService.getRoleList(offset, count, name), ioThreadPool).
                whenCompleteAsync((url, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(url);
                    }
                }, ioThreadPool);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addRole(Role role,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> roleService.addRole(role), ioThreadPool).
                whenCompleteAsync((Void, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(CREATED).build());
                    }
                }, ioThreadPool);
    }
    
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateRole(Role role,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> roleService.updateRole(role), ioThreadPool).
                whenCompleteAsync((Void, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }

    @Path("{role-id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void getRole(@PathParam("role-id") final Long roleId,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> roleService.getRole(roleId), ioThreadPool).
                thenCombineAsync(CompletableFuture.
                        supplyAsync(() -> moduleService.getModulesByRoleId(roleId), ioThreadPool),
                        (role, modules) -> {
                            role.setModules(modules.toArray(new Module[0]));
                            return role;
                        }, cpuThreadPool).
                whenCompleteAsync((role, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(role);
                    }
                }, ioThreadPool);
    }
}
