package cn.kepu.self.commons.jersey.provider;

import java.io.IOException;
import javax.inject.Inject;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.ext.Provider;
import org.glassfish.grizzly.http.server.Request;

/**
 *
 * @author 劉一童
 */
@Provider
@RemoteIP
public class RemoteIPFilter implements ContainerRequestFilter {

    @Inject
    private javax.inject.Provider<Request> grizzlyRequest;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String remoteIpAddress = grizzlyRequest.get().getRemoteAddr();
        requestContext.getHeaders().add("remote-ip", remoteIpAddress);
    }
}
