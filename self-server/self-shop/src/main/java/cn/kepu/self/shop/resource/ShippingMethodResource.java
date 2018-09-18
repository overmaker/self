package cn.kepu.self.shop.resource;

import cn.kepu.self.shop.service.ShippingMethodService;
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
import static javax.ws.rs.core.Response.Status.NO_CONTENT;

/**
 *
 * @author 李成志
 */
@Path("shipping-method")
@Singleton
public final class ShippingMethodResource {
    
    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final ShippingMethodService shippingMethodService = ShippingMethodService.INSTANCE;
    
    //新增配送方式
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addShippingMethod(@FormParam("name") final String name,//配送方式名称
            @FormParam("logistics_company") final String logistics_company,//物流公司
            @FormParam("first_weight") final int first_weight,//首重量
            @FormParam("continue_weight") final int continue_weight,//续重量
            @FormParam("first_price") final Double first_price,//首重价格
            @FormParam("continue_price") final Double continue_price,//续重价格
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> shippingMethodService.addShippingMethod(name, logistics_company, first_weight, continue_weight, first_price, continue_price), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }
    
    //修改配送方式
    @PUT
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void updateShippingMethod(@FormParam("name") final String name,//配送方式名称
            @FormParam("logistics_company") final String logistics_company,//物流公司
            @FormParam("first_weight") final int first_weight,//首重量
            @FormParam("continue_weight") final int continue_weight,//续重量
            @FormParam("first_price") final Double first_price,//首重价格
            @FormParam("continue_price") final Double continue_price,//续重价格
            @PathParam("id") final Long id,//配送方式id
            @Suspended final AsyncResponse asyncResponse){
        CompletableFuture.
                supplyAsync(() -> shippingMethodService.updateShippingMethod(name, logistics_company, first_weight, continue_weight, first_price, continue_price, id), ioThreadPool).
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
    
    //删除配送方式
    @DELETE
    @Path("{id}")
    public void deleteShippingMethod(@PathParam("id") final Long id,//分类id
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> shippingMethodService.deleteShippingMethod(id), ioThreadPool).
                whenCompleteAsync((voidValue, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.noContent().build());
                    }
                }, ioThreadPool);
    }
    
    //查询配送方式
    @GET
    @Path("/find/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void findShippingMethod(
            @PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> shippingMethodService.findById(id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
    
    //查询所有的配送方式
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void selectShippingMethod(
            @QueryParam("name") final String name,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> shippingMethodService.selectShippingMethod(name, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
}
