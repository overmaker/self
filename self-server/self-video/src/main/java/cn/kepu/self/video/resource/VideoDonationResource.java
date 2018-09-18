package cn.kepu.self.video.resource;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import cn.kepu.self.video.entity.VideoDonation;
import cn.kepu.self.video.service.VideoDonationService;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
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
 * @author 李成志
 */
@Path("video-donation")
@Singleton
public class VideoDonationResource {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final VideoDonationService videoDonationService = VideoDonationService.INSTANCE;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addVideoDonation(final VideoDonation videoDonation,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> videoDonationService.addVideoDonation(videoDonation), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);

    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateVideoDonation(final VideoDonation videoDonation,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> videoDonationService.updateVideoDonation(videoDonation), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("statistics")
    @Produces(MediaType.APPLICATION_JSON)
    public void countVideoDonation1(@QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoDonationService.countVideoDonation(offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("statistics1")
    @Produces(MediaType.APPLICATION_JSON)
    public void countVideoDonation(@QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoDonationService.countVideoDonation1(offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("statistics2")
    @Produces(MediaType.APPLICATION_JSON)
    public void countVideoDonation2(@QueryParam("video") final Long video,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoDonationService.countVideoDonation2(video, offset, count), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("export")
    @Produces("application/vnd.ms-excel")
    public HSSFWorkbook Export(@QueryParam("video") final Long video) {
        BinaryPair<List<VideoDonation>, Long> videoDonation = null;
        BinaryPair<List<VideoDonation>, Long> videoDonation1 = null;
        if (video != null) {
            videoDonation = videoDonationService.countVideoDonation2(video, 0, 10);
        } else {
            videoDonation = videoDonationService.countVideoDonation(0, 10);
            videoDonation1 = videoDonationService.countVideoDonation1(0, 10);
        }
        
        //第一步，创建一个webbook，对应一个Excel文件
        HSSFWorkbook wb = new HSSFWorkbook();
        try {
            if (video != null) {
                //第二步，在webbook中添加一个sheet,对应Excel文件中的sheet
                HSSFSheet sheet = wb.createSheet("sheet");

                for (int j = 0; j < 2; j++) {
                    sheet.setColumnWidth(j, 4000);
                }
                //第三步，在sheet中添加表头第0行,注意老版本poi对Excel的行数列数有限制short
                HSSFRow row0 = sheet.createRow(0);
                // 设置行高   
                row0.setHeight((short) 400);
                CellRangeAddress range = new CellRangeAddress(0, 0, 0, 2);
                sheet.addMergedRegion(range);
                HSSFCell cell0 = row0.createCell(0);
                cell0.setCellValue(new HSSFRichTextString("统计数据导出表"));
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

                HSSFRow row = sheet.createRow(1);
                HSSFCell cell = row.createCell(0);
                //循环列头

                cell.setCellValue("序号");
                cell.setCellStyle(style1);

                cell = row.createCell(1);
                cell.setCellValue("用户昵称");
                cell.setCellStyle(style1);

                cell = row.createCell(2);
                cell.setCellValue("打赏金额");
                cell.setCellStyle(style1);

                //第五步，写入实体数据 实际应用中这些数据从数据库得到，
                int rownum = 2;
                int k = 1;

                row = sheet.createRow(rownum);
                cell = row.createCell(0);
                cell.setCellValue(k);
                cell.setCellStyle(style1);

                cell = row.createCell(1);
                cell.setCellValue(videoDonation.getV1().get(0).getUser().getUserName());
                cell.setCellStyle(style1);

                cell = row.createCell(2);
                cell.setCellValue(videoDonation.getV1().get(0).getTotal_fee());
                cell.setCellStyle(style1);
            } else {
                //第二步，在webbook中添加一个sheet,对应Excel文件中的sheet
                HSSFSheet sheet = wb.createSheet("sheet");
                HSSFSheet sheet1 = wb.createSheet("sheet1");

                for (int j = 0; j < 2; j++) {
                    sheet.setColumnWidth(j, 4000);
                    sheet1.setColumnWidth(j, 4000);
                }
                //第三步，在sheet中添加表头第0行,注意老版本poi对Excel的行数列数有限制short
                HSSFRow row0 = sheet.createRow(0);
                HSSFRow row1 = sheet1.createRow(0);
                // 设置行高   
                row0.setHeight((short) 400);
                CellRangeAddress range = new CellRangeAddress(0, 0, 0, 2);
                sheet.addMergedRegion(range);
                HSSFCell cell0 = row0.createCell(0);
                cell0.setCellValue(new HSSFRichTextString("统计数据导出表"));
                HSSFCellStyle style2 = wb.createCellStyle();  //Execl列明样式：背景色为灰色，字体居中。

                style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);
                HSSFFont font2 = wb.createFont();
                font2.setFontHeightInPoints((short) 18);
                font2.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
                font2.setColor(HSSFFont.COLOR_NORMAL);
                style2.setFont(font2);
                
                row1.setHeight((short) 400);
                CellRangeAddress range1 = new CellRangeAddress(0, 0, 0, 2);
                sheet1.addMergedRegion(range1);
                HSSFCell cell1 = row1.createCell(0);
                cell1.setCellValue(new HSSFRichTextString("统计数据导出表"));
                HSSFCellStyle style3 = wb.createCellStyle();  //Execl列明样式：背景色为灰色，字体居中。

                style3.setAlignment(HSSFCellStyle.ALIGN_CENTER);
                HSSFFont font3 = wb.createFont();
                font3.setFontHeightInPoints((short) 18);
                font3.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
                font3.setColor(HSSFFont.COLOR_NORMAL);
                style3.setFont(font3);
                //第四步，创建单元格，并设置值表头  设置表头居中
                HSSFCellStyle style1 = wb.createCellStyle();  //Execl列明样式：背景色为灰色，字体居中。
                style1.setAlignment(HSSFCellStyle.ALIGN_CENTER);
                HSSFFont font = wb.createFont();
                font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
                font.setColor(HSSFFont.COLOR_NORMAL);
                style1.setFont(font);  //黑色粗体
                
                HSSFCellStyle style4 = wb.createCellStyle();  //Execl列明样式：背景色为灰色，字体居中。
                style4.setAlignment(HSSFCellStyle.ALIGN_CENTER);
                HSSFFont font1 = wb.createFont();
                font1.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
                font1.setColor(HSSFFont.COLOR_NORMAL);
                style4.setFont(font1);  //黑色粗体

                HSSFRow row = sheet.createRow(1);
                HSSFCell cell = row.createCell(0);
                
                HSSFRow row2 = sheet1.createRow(1);
                HSSFCell cell2 = row2.createCell(0);
                //循环列头
                cell.setCellValue("序号");
                cell.setCellStyle(style1);

                cell = row.createCell(1);
                cell.setCellValue("视频名称");
                cell.setCellStyle(style1);

                cell = row.createCell(2);
                cell.setCellValue("打赏金额");
                cell.setCellStyle(style1);

                cell2.setCellValue("序号");
                cell2.setCellStyle(style4);

                cell2 = row1.createCell(1);
                cell2.setCellValue("用户昵称");
                cell2.setCellStyle(style4);

                cell2 = row1.createCell(2);
                cell2.setCellValue("打赏金额");
                cell2.setCellStyle(style4);

                //第五步，写入实体数据 实际应用中这些数据从数据库得到，
                int rownum = 2;
                int k = 1;
                
                for (int i = 0; i < videoDonation.getV1().size(); i++) {
                    row = sheet.createRow(rownum);
                    cell = row.createCell(0);
                    cell.setCellValue(k);
                    cell.setCellStyle(style1);
                
                    cell = row.createCell(1);
                    cell.setCellValue(videoDonation.getV1().get(i).getVideo().getTitle());
                    cell.setCellStyle(style1);
                    
                    cell = row.createCell(2);
                    cell.setCellValue(videoDonation.getV1().get(i).getTotal_fee());
                    cell.setCellStyle(style1);
                    
                    rownum++;
                    k++;
                }
                
                rownum = 2;
                k = 1;
                
                for (int j = 0; j < videoDonation1.getV1().size(); j++) {
                    row2 = sheet1.createRow(rownum);
                    cell2 = row2.createCell(0);
                    cell2.setCellValue(k);
                    cell2.setCellStyle(style4);
                
                    cell2 = row2.createCell(j+1);
                    cell2.setCellValue(videoDonation1.getV1().get(j).getUser().getUserName());
                    cell2.setCellStyle(style1);

                    cell2 = row2.createCell(j+2);
                    cell2.setCellValue(videoDonation1.getV1().get(j).getTotal_fee());
                    cell2.setCellStyle(style4);
                    
                    rownum++;
                    k++;
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return wb;
    }

}
