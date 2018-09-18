package cn.kepu.self.shop.resource;

import cn.kepu.self.shop.service.ProductService;
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

/**
 *
 * @author 李成志
 */
@Path("product")
@Singleton
public class ProductResource {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final ProductService productService = ProductService.INSTANCE;

    //新增商品
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addProduct(@FormParam("name") final String name,//商品名称
            @FormParam("introduction") final String introduction,//商品介绍
            @FormParam("thumbnail") final String thumbnail,//商品缩略图存放相对路径
            @FormParam("image") final String image,//商品大图存放相对路径
            @FormParam("sn") final String sn,//商品编号
            @FormParam("price") final Double price,//商品价格
            @FormParam("weight") final Double weight,//商品重量
            @FormParam("score") final Integer score,//商品积分
            @FormParam("is_recommend") final Boolean is_recommend,//首页显示
            @FormParam("is_enable") final Boolean is_enable,//是否启用
            @FormParam("type") final Long type,//商品分类
            @FormParam("stock") final Integer stock,//商品库存
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> productService.addProduct(name, introduction, thumbnail, image, sn, price, weight, score, is_recommend, is_enable, type, stock), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }

    //修改商品
    @PUT
    @Path("/update/{id}")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void updateProduct(@FormParam("name") final String name,//商品名称
            @FormParam("introduction") final String introduction,//商品介绍
            @FormParam("thumbnail") final String thumbnail,//商品缩略图存放相对路径
            @FormParam("image") final String image,//商品大图存放相对路径
            @FormParam("sn") final String sn,//商品编号
            @FormParam("price") final Double price,//商品价格
            @FormParam("weight") final Double weight,//商品重量
            @FormParam("score") final Integer score,//商品积分
            @FormParam("is_recommend") final Boolean is_recommend,//首页显示
            @FormParam("is_enable") final Boolean is_enable,//是否启用
            @FormParam("type") final Long type,//商品分类
            @FormParam("stock") final Integer stock,//商品库存
            @PathParam("id") final Long id,//商品id
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> productService.updateProduct(id, name, introduction, thumbnail, image, sn, price, weight, score, is_recommend, is_enable, type, stock), ioThreadPool).
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
    @Path("/findProduct")
    @Produces(MediaType.APPLICATION_JSON)
    public void findProduct(@QueryParam("offset") final int offset, @QueryParam("count") final int count,
            @QueryParam("type") final Long type,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> productService.findByType(offset, count, type), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("/find/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void findById(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {

        CompletableFuture.
                supplyAsync(() -> productService.findById(id), ioThreadPool).
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
    public void selectProduct(@QueryParam("name") final String name,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> productService.selectProduct(name, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @Path("copy")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public void copyActivity(@FormParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.runAsync(() -> productService.copyProcuct(id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.ok().build());
                    }
                }, ioThreadPool);
    }
}
