package cn.kepu.self.others.resource;

import cn.kepu.self.others.service.FriendshipLinkService;
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
@Path("friendship-link")
@Singleton
public class FriendshipLinkResource {
    
    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final FriendshipLinkService friendshipLinkService = FriendshipLinkService.INSTANCE;
    
    //新增合作机构
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addFriendshipLink(@FormParam("tooltip") final String tooltip,
            @FormParam("image") final String image,
            @FormParam("linkUrl") final String linkUrl,   
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> friendshipLinkService.addFriendshipLink(tooltip, image, linkUrl), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }
    
    //修改合作机构
    @PUT
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void updateFriendshipLink(@FormParam("tooltip") final String tooltip,
            @FormParam("image") final String image,
            @FormParam("linkUrl") final String linkUrl, 
            @PathParam("id") final Long id,//分类id
            @Suspended final AsyncResponse asyncResponse){
        CompletableFuture.
                runAsync(() -> friendshipLinkService.updateFriendshipLink(tooltip, image, linkUrl, id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }
    
    //删除合作机构
    @DELETE
    @Path("{id}")
    public void deleteFriendshipLink(@PathParam("id") final Long id,//分类id
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> friendshipLinkService.deleteFriendshipLink(id), ioThreadPool).
                whenCompleteAsync((voidValue, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.noContent().build());
                    }
                }, ioThreadPool);
    }
    
    //查询合作机构
    @GET
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void findFriendshipLink(
            @PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> friendshipLinkService.findById(id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
    
    //查询所有的合作机构
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void selectFriendshipLinkAll(
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> friendshipLinkService.selectFriendshipLink(offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
}
