package cn.kepu.self.commons.jersey.provider;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyWriter;
import javax.ws.rs.ext.Provider;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

/**
 *
 * @author 劉一童
 */
@Provider
public final class ExcelMessageBodyWriter implements MessageBodyWriter<HSSFWorkbook> {

    @Override
    public boolean isWriteable(Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {
        return type == HSSFWorkbook.class;
    }

    @Override
    public void writeTo(HSSFWorkbook t, Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType, MultivaluedMap<String, Object> httpHeaders, OutputStream entityStream) throws IOException, WebApplicationException {
        t.write(entityStream);
    }

}
