package cn.kepu.self.activity.resource;

import cn.kepu.self.activity.entity.UserTicket;
import cn.kepu.self.activity.service.UserTicketService;
import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.util.List;
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
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.Status.NO_CONTENT;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.util.CellRangeAddress;

/**
 *
 * @author 周林敏
 */
@Path("activity-userTicket")
@Singleton
public final class UserTicketResource {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final UserTicketService userTicketService = UserTicketService.INSTANCE;

    /*报名成功时的微信回调*/
    @Path("wxnotify")
    @POST
    public void payNotify(String xml,
            @Suspended final AsyncResponse asyncResponse) throws Exception {
        CompletableFuture.supplyAsync(() -> userTicketService.payNotidy(xml), ioThreadPool).
                whenCompleteAsync((returnStr, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(returnStr);
                    }
                }, ioThreadPool);
    }

    /*移动端报名成功时的微信回调*/
    @Path("mobileNotify")
    @POST
    public void notifymobile(String xml,
            @Suspended final AsyncResponse asyncResponse) throws Exception {
        CompletableFuture.supplyAsync(() -> userTicketService.notifymobile(xml), ioThreadPool).
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
    public void addUserTicket(final UserTicket userTicket,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> userTicketService.pay(userTicket), ioThreadPool).
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

    /*移动端通过code获取oppenid*/
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public void getOppenid(
            @QueryParam("code") final String code,
            @Suspended final AsyncResponse asyncResponse) {

        CompletableFuture.
                supplyAsync(() -> userTicketService.Openid(code), ioThreadPool).
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
    public void pay2(final UserTicket userTicket,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.runAsync(() -> {
            try {
                userTicketService.getPrepayId(userTicket);
            } catch (Exception ex) {
                Logger.getLogger(UserTicketResource.class.getName()).log(Level.SEVERE, null, ex);
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

    /*报名生成二维码*/
    @Path("qr-code")
    @GET
    @Produces("image/png")
    public void genQRCode(@QueryParam("data") final String data,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> userTicketService.generateQRCode(data), cpuThreadPool).
                whenCompleteAsync((bufferedImage, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(bufferedImage);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("listManagement")
    @Produces(MediaType.APPLICATION_JSON)
    public void selectUserTicket(@QueryParam("id") final Long id,
            @QueryParam("name") final String name,
            @QueryParam("mobile") final String mobile,
            @QueryParam("email") final String email,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> userTicketService.selectUserTicket(id, name, mobile, email, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("listManagement/email")
    @Produces(MediaType.APPLICATION_JSON)
    public void sendEmail(@QueryParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) throws Exception {
        CompletableFuture.
                runAsync(() -> {
                    try {
                        userTicketService.sendEmail(id);
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                }, ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("listManagement/mobile")
    @Produces(MediaType.APPLICATION_JSON)
    public void sendMobile(@QueryParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> userTicketService.sendMobile(id), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("listManagement/export")
    @Produces("application/vnd.ms-excel")
    public HSSFWorkbook Export(@QueryParam("id") final Long id,
            @QueryParam("name") final String name,
            @QueryParam("mobile") final String mobile,
            @QueryParam("email") final String email) {
        BinaryPair<List<UserTicket>, Long> listUserTicket = userTicketService.selectUserTicket(id, name, mobile, email, 0, 10000);

        //第一步，创建一个webbook，对应一个Excel文件
        HSSFWorkbook wb = new HSSFWorkbook();
        try {
            //第二步，在webbook中添加一个sheet,对应Excel文件中的sheet
            HSSFSheet sheet = wb.createSheet("sheet");

            for (int j = 0; j < 3; j++) {
                sheet.setColumnWidth(j, 4000);
            }
            //第三步，在sheet中添加表头第0行,注意老版本poi对Excel的行数列数有限制short
            HSSFRow row = sheet.createRow(0);
            // 设置行高   
            row.setHeight((short) 400);
            CellRangeAddress range = new CellRangeAddress(0, 0, 0, 2);
            sheet.addMergedRegion(range);
            HSSFCell cell = row.createCell(0);
            cell.setCellValue(new HSSFRichTextString("活动名单情况导出"));
            HSSFCellStyle style2 = wb.createCellStyle();  //Execl列明样式：背景色为灰色，字体居中。

            style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);
            HSSFFont font2 = wb.createFont();
            font2.setFontHeightInPoints((short) 18);
            font2.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
            font2.setColor(HSSFFont.COLOR_NORMAL);
            style2.setFont(font2);

            //第四步，创建单元格，并设置值表头  设置表头居中
            HSSFCellStyle style1 = wb.createCellStyle();  //Execl列明样式：背景色为灰色，字体居中。
            style1.setAlignment(HSSFCellStyle.ALIGN_CENTER);
            HSSFFont font = wb.createFont();
            font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
            font.setColor(HSSFFont.COLOR_NORMAL);
            style1.setFont(font);  //黑色粗体

            row = sheet.createRow(1);
            cell = row.createCell(0);
            //循环列头
            cell.setCellValue("序号");
            cell.setCellStyle(style1);

            cell = row.createCell(1);
            cell.setCellValue("姓名");
            cell.setCellStyle(style1);

            cell = row.createCell(2);
            cell.setCellValue("手机号");
            cell.setCellStyle(style1);

            cell = row.createCell(3);
            cell.setCellValue("邮箱");
            cell.setCellStyle(style1);

            cell = row.createCell(4);
            cell.setCellValue("状态");
            cell.setCellStyle(style1);

            cell = row.createCell(5);
            cell.setCellValue("票状态");
            cell.setCellStyle(style1);
            //第五步，写入实体数据 实际应用中这些数据从数据库得到，
            int rownum = 2;
            int k = 1;

            for (int i = 0; i < listUserTicket.getV1().size(); i++) {
                row = sheet.createRow(rownum);
                cell = row.createCell(0);
                cell.setCellValue(k);
                cell.setCellStyle(style1);

                cell = row.createCell(1);
                cell.setCellValue(listUserTicket.getV1().get(i).getName());
                cell.setCellStyle(style1);

                cell = row.createCell(2);
                cell.setCellValue(listUserTicket.getV1().get(i).getMobile());
                cell.setCellStyle(style1);

                cell = row.createCell(3);
                cell.setCellValue(listUserTicket.getV1().get(i).getEmail());
                cell.setCellStyle(style1);

                cell = row.createCell(4);
                cell.setCellValue(listUserTicket.getV1().get(i).getStatus() == true ? "已签到" : "未签到");
                cell.setCellStyle(style1);

                cell = row.createCell(5);
                cell.setCellValue(listUserTicket.getV1().get(i).getEnable() == true ? "已生效" : "未生效");
                cell.setCellStyle(style1);
                rownum++;
                k++;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return wb;
    }

    /*签到*/
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateTicket(
            final UserTicket userTicket,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> userTicketService.signIn(userTicket), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }

    /*验证签到手机号是否存在*/
    @POST
    @Path("check")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void danmuCheck(
            final UserTicket userTicket,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> userTicketService.phoneNumberCheck(userTicket), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

}
