package cn.kepu.self.site.resource;

import cn.kepu.self.site.entity.BecomeVip;
import cn.kepu.self.site.service.BecomeVipService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.json.Json;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
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
 * @author
 */
@Path("becomeVippay")
@Singleton
public final class BecomeVipResource {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final BecomeVipService becomeVipService = BecomeVipService.INSTANCE;

    @Path("vipnotify")
    @POST
    public void payNotify(String xml,
            @Suspended final AsyncResponse asyncResponse) throws Exception {
        CompletableFuture.supplyAsync(() -> becomeVipService.payNotidy(xml), ioThreadPool).
                whenCompleteAsync((returnStr, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(returnStr);
                    }
                }, ioThreadPool);
    }

    @Path("vippay")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void pay(final BecomeVip becomeVip,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> becomeVipService.pay(becomeVip), ioThreadPool).
                whenCompleteAsync((map, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        String return_code = map.get("return_code");
                        String result_code = map.get("result_code");
                        JsonObjectBuilder obj = Json.createObjectBuilder();
                        obj.add("return_code", return_code);
                        obj.add("result_code", result_code);
                        if (return_code.equals("SUCCESS") && result_code.equals("SUCCESS")) {
                            obj.add("prepay_id", map.get("prepay_id"));
                            obj.add("code_url", map.get("code_url"));
                        } else if (return_code.equals("SUCCESS")) {
                            obj.add("err_code", map.get("err_code"));
                            obj.add("err_code_des", map.get("err_code_des"));
                        }
                        asyncResponse.resume(obj.build().toString());
                    }
                }, ioThreadPool);
    }

    @Path("qr-code")
    @GET
    @Produces("image/png")
    public void genQRCode(@QueryParam("data") final String data,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> becomeVipService.generateQRCode(data), cpuThreadPool).
                whenCompleteAsync((bufferedImage, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(bufferedImage);
                    }
                }, ioThreadPool);
    }
}
