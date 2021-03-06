package cn.kepu.self.video.resource;

import cn.kepu.self.util.BinaryPair;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import cn.kepu.self.video.entity.VideoComment;
import cn.kepu.self.video.service.VideoCommentService;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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
import static javax.ws.rs.core.Response.Status.NOT_FOUND;
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
 * 视频评论
 *
 * @author 马亚星
 */
@Path("video-comment")
@Singleton
public class VideoCommentResouce {

    private final Executor cpuThreadPool = SelfThreadPoolCollection.INSTANCE.getCpuThreadPool();

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final VideoCommentService videoCommentService = VideoCommentService.INSTANCE;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addVideoComment(final VideoComment videoComment,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                runAsync(() -> videoCommentService.addVideComment(videoComment), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(Response.status(NO_CONTENT).build());
                    }
                }, ioThreadPool);

    }

    @DELETE
    @Path("{id}")
    public void delVideoComment(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoCommentService.delVideoComment(id), ioThreadPool).
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
    public void selectVideoComment(
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @QueryParam("user-id") final Long userId,
            @QueryParam("video-id") final Long videoId,
            @QueryParam("video-title") final String videoTitle,
            @QueryParam("comment") final String comment,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoCommentService.selectVideoComment(offset, count, userId, videoId, videoTitle, comment), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Path("/count")
    @Produces(MediaType.TEXT_PLAIN)
    public void selVideoCommentCount(@QueryParam("video") final Long videoId,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoCommentService.selVideoCommentCount(videoId), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
//    后台审核

    @GET
    @Path("admin")
    @Produces(MediaType.APPLICATION_JSON)
    public void adminVideoComment(
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @QueryParam("user-id") final Long userId,
            @QueryParam("video-id") final Long videoId,
            @QueryParam("video-title") final String videoTitle,
            @QueryParam("comment") final String comment,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoCommentService.adminVideoComment(offset, count, userId, videoId, videoTitle, comment), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @PUT
    @Path("{id}")
    public void adminChangeComment(@PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoCommentService.adminChangeComment(id), ioThreadPool).
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
    @Path("admin")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void adminComment(final VideoComment videoComment,
            @QueryParam("offset") final int offset,
            @QueryParam("count") final int count,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoCommentService.adminComment(offset, count, videoComment), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }
//参与情况统计

    @GET
    @Path("count2")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void count2(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoCommentService.count2(), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    //参与情况统计柱状图
    @GET
    @Path("count20")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void count20(
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.
                supplyAsync(() -> videoCommentService.count20(), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        asyncResponse.resume(result);
                    }
                }, ioThreadPool);
    }

    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("export3")
    @Produces("application/vnd.ms-excel")
    public HSSFWorkbook Export3() {
        BinaryPair<List<VideoComment>, Long> videoComment1 = null;
        videoComment1 = videoCommentService.count2();

        //第一步，创建一个webbook，对应一个Excel文件
        HSSFWorkbook wb = new HSSFWorkbook();
        try {
            if (videoComment1 != null) {
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
                cell.setCellValue("用户名称");
                cell.setCellStyle(style1);

                cell = row.createCell(2);
                cell.setCellValue("评论数量");
                cell.setCellStyle(style1);

                //第五步，写入实体数据 实际应用中这些数据从数据库得到，
                int rownum = 2;
                int k = 1;

                for (int i = 0; i < videoComment1.getV1().size(); i++) {
                    row = sheet.createRow(rownum);
                    cell = row.createCell(0);
                    cell.setCellValue(k);
                    cell.setCellStyle(style1);

                    cell = row.createCell(1);
                    cell.setCellValue(videoComment1.getV1().get(i).getUser().getUserName());
                    cell.setCellStyle(style1);

                    cell = row.createCell(2);
                    cell.setCellValue(videoComment1.getV1().get(i).getVideo().getCommentNum());
                    cell.setCellStyle(style1);

                    rownum++;
                    k++;
                }

            } else {
                //第二步，在webbook中添加一个sheet,对应Excel文件中的sheet
                HSSFSheet sheet = wb.createSheet("sheet");
                HSSFSheet sheet1 = wb.createSheet("sheet1");

                for (int j = 0; j < 3; j++) {
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
                cell.setCellValue("用户名称");
                cell.setCellStyle(style1);

                cell = row.createCell(2);
                cell.setCellValue("评论数量");
                cell.setCellStyle(style1);

                //第五步，写入实体数据 实际应用中这些数据从数据库得到，
                int rownum = 2;
                int k = 1;

                for (int i = 0; i < videoComment1.getV1().size(); i++) {
                    row = sheet.createRow(rownum);
                    cell = row.createCell(0);
                    cell.setCellValue(k);
                    cell.setCellStyle(style1);

                    cell = row.createCell(1);
                    cell.setCellValue(videoComment1.getV1().get(i).getUser().getUserName());
                    cell.setCellStyle(style1);

                    cell = row.createCell(2);
                    cell.setCellValue(videoComment1.getV1().get(i).getVideo().getCommentNum());
                    cell.setCellStyle(style1);

                    rownum++;
                    k++;
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return wb;
    }

    //    视屏评论详情页
    @GET
    @Path("commentview/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void adminCommentView(
            @PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoCommentService.adminCommentView(id), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result == null) {
                            asyncResponse.resume(Response.status(NOT_FOUND).build());
                        } else {
                            asyncResponse.resume(result);
                        }
                    }
                }, ioThreadPool);
    }
    //    视屏评论详情页1

    @GET
    @Path("commentview1/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void adminCommentView1(
            @PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoCommentService.adminCommentView1(id), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result == null) {
                            asyncResponse.resume(Response.status(NOT_FOUND).build());
                        } else {
                            asyncResponse.resume(result);
                        }
                    }
                }, ioThreadPool);
    }
    //    视屏评论详情页2

    @GET
    @Path("commentview2/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public void adminCommentView2(
            @PathParam("id") final Long id,
            @Suspended final AsyncResponse asyncResponse) {
        CompletableFuture.supplyAsync(() -> videoCommentService.adminCommentView2(id), ioThreadPool)
                .whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        if (result == null) {
                            asyncResponse.resume(Response.status(NOT_FOUND).build());
                        } else {
                            asyncResponse.resume(result);
                        }
                    }
                }, ioThreadPool);
    }

}
