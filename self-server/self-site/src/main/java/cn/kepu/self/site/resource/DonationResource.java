package cn.kepu.self.site.resource;

import cn.kepu.self.site.entity.Donation;
import cn.kepu.self.site.service.DonationService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.logging.Level;
import java.util.logging.Logger;
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
@Path("donationpay")
@Singleton
public final class DonationResource {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final DonationService donationService = DonationService.INSTANCE;

    @Path("wxnotify")
    @POST
    public void payNotify(String xml,
            @Suspended final AsyncResponse asyncResponse) throws Exception {
        CompletableFuture.supplyAsync(() -> donationService.payNotidy(xml), ioThreadPool).
                whenCompleteAsync((returnStr, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(returnStr);
                    }
                }, ioThreadPool);
    }

    @Path("mobileNotify")
    @POST
    public void notifymobile(String xml,
            @Suspended final AsyncResponse asyncResponse) throws Exception {
        CompletableFuture.supplyAsync(() -> donationService.notifymobile(xml), ioThreadPool).
                whenCompleteAsync((returnStr, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(returnStr);
                    }
                }, ioThreadPool);
    }

    @Path("wxpay")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void pay(final Donation donation,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> donationService.pay(donation), ioThreadPool).
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

    /*通过code获取oppenid*/
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void getOppenid(
            @QueryParam("code") final String code,
            @Suspended final AsyncResponse asyncResponse) {

        CompletableFuture.
                supplyAsync(() -> donationService.getAuthorize(code), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        err.printStackTrace();
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @Path("mobileWxpay")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void pay2(final Donation donation,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.runAsync(() -> {
            try {
                donationService.getPrepayId(donation);
            } catch (Exception ex) {
                Logger.getLogger(DonationResource.class.getName()).log(Level.SEVERE, null, ex);
            }
        }, ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        err.printStackTrace();
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @Path("qr-code")
    @GET
    @Produces("image/png")
    public void genQRCode(@QueryParam("data") final String data,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> donationService.generateQRCode(data), cpuThreadPool).
                whenCompleteAsync((bufferedImage, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(bufferedImage);
                    }
                }, ioThreadPool);
    }
}
