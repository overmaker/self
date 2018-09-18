package cn.kepu.self.util.threadpool;

import java.util.concurrent.ExecutorService;

/**
 *
 * @author 劉一童
 */
public enum SelfThreadPoolCollection {
    INSTANCE;

    /**
     * 禁用实例化
     */
    private SelfThreadPoolCollection() {}

    public static SelfThreadPoolCollection getInstance() {
        return INSTANCE;
    }

    private volatile SelfThreadPool cpuThreadPool;
    private volatile SelfThreadPool ioThreadPool;

    public SelfThreadPool getCpuThreadPool() {
        return cpuThreadPool;
    }

    public void setCpuThreadPool(SelfThreadPool cpuThreadPool) {
        this.cpuThreadPool = cpuThreadPool;
    }

    public SelfThreadPool getIoThreadPool() {
        return ioThreadPool;
    }

    public void setIoThreadPool(SelfThreadPool ioThreadPool) {
        this.ioThreadPool = ioThreadPool;
    }

    public void shutdownNow() {
        final ExecutorService localCpuThreadPool = cpuThreadPool;
        final ExecutorService localIoThreadPool = ioThreadPool;
        cpuThreadPool = null;
        ioThreadPool = null;

        if (localCpuThreadPool != null) {
            localCpuThreadPool.shutdownNow();
        }

        if (localIoThreadPool != null) {
            localIoThreadPool.shutdownNow();
        }
    }
}
