package cn.kepu.self.commons.resource;

import cn.kepu.self.commons.service.FileUploadService;
import cn.kepu.self.util.threadpool.SelfThreadPoolCollection;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import javax.inject.Singleton;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.CREATED;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

/**
 *
 * @author 劉一童
 */
@Path("wang-editor")
@Singleton
public final class WangEditorResource {

    private final Executor ioThreadPool = SelfThreadPoolCollection.INSTANCE.getIoThreadPool();

    private final FileUploadService fileUploadService = FileUploadService.INSTANCE;

    @Path("{sub-path}")
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public void upload(
            @PathParam("sub-path") final String subPath,
            @FormDataParam("file") final InputStream uploadedInputStream,
            @FormDataParam("file") final FormDataContentDisposition fileDetail,
            @Suspended final AsyncResponse asyncResponse) {
        if (subPath == null || subPath.isEmpty()) {
            asyncResponse.resume(Response.status(BAD_REQUEST).build());
            return;
        } else if (fileDetail == null || fileDetail.getFileName() == null || fileDetail.getFileName().isEmpty()) {
            asyncResponse.resume(Response.status(BAD_REQUEST).build());
            return;
        }
        final String fileName;
        try {
            fileName = new String(fileDetail.getFileName().getBytes("iso8859-1"), "UTF-8");
        } catch (final UnsupportedEncodingException e) {
            asyncResponse.resume(Response.status(INTERNAL_SERVER_ERROR).build());
            return;
        }

        CompletableFuture.
                supplyAsync(() -> fileUploadService.upload(uploadedInputStream, subPath, fileName), ioThreadPool).
                whenCompleteAsync((result, err) -> {
                    if (err != null) {
                        asyncResponse.resume(new WebApplicationException(err, INTERNAL_SERVER_ERROR));
                    } else {
                        JsonObjectBuilder obj = Json.createObjectBuilder();
                        JsonArrayBuilder array = Json.createArrayBuilder();
                        array.add(result);
                        obj.add("errno", 0);
                        obj.add("data", array);
                        asyncResponse.resume(Response.status(CREATED).entity(obj.build().toString()).build());
                    }
                }, ioThreadPool);
    }
}
