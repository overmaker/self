package cn.kepu.self.commons.service;

public interface SmsOperatorImpService extends javax.xml.rpc.Service {
    public java.lang.String getSmsOperatorImpPortAddress();

    public cn.kepu.self.commons.service.ISmsOperator getSmsOperatorImpPort() throws javax.xml.rpc.ServiceException;

    public cn.kepu.self.commons.service.ISmsOperator getSmsOperatorImpPort(java.net.URL portAddress) throws javax.xml.rpc.ServiceException;
}
