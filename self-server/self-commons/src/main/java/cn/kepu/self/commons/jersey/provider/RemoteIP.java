package cn.kepu.self.commons.jersey.provider;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import javax.ws.rs.NameBinding;

/**
 *
 * @author 劉一童
 */
@NameBinding
@Retention(RetentionPolicy.RUNTIME)
public @interface RemoteIP {}
