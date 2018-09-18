package cn.kepu.self.commons.aop;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.aspectj.lang.JoinPoint;

/**
 *
 * @author 劉一童
 */
public final class DAOAspect {

    public static final Logger LOGGER = LogManager.getLogger("cn.kepu.self");
    public static final boolean DEBUG_ENABLED = LOGGER.isDebugEnabled();

    public void before(final JoinPoint joinPoint) {
        if (DEBUG_ENABLED) {
            LOGGER.debug("Before " + joinPoint.toLongString());
        }
    }

    public void afterReturning(final JoinPoint joinPoint) {
        if (DEBUG_ENABLED) {
            LOGGER.debug("AfterReturning " + joinPoint.toLongString());
        }
    }

    public void afterThrowing(final JoinPoint joinPoint, final Throwable err) throws Throwable {
        try {
            LOGGER.error("AfterThrowing " + joinPoint.toLongString(), err);
        } finally {
            throw err;
        }
    }
}
