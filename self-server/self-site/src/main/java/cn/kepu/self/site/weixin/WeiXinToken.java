package cn.kepu.self.site.weixin;

import cn.kepu.self.site.service.WeiXinService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 *
 * @author 劉一童
 */
@Component("weixinToken")
public class WeiXinToken {
    
    private final WeiXinService weiXinService = WeiXinService.INSTANCE;
    
    public WeiXinToken () {
        //testJob();
    }

//    @Scheduled(cron = "0/5 * * * * ?")
//    public void testJob() {
//        weiXinService.putConfig();
//    }
}
