
package cn.kepu.self.commons.service;

public interface ISmsOperator extends java.rmi.Remote {
//    public cn.kepu.self.commons.service.MoMessageRes getSms(java.lang.String arg0, java.lang.String arg1) throws java.rmi.RemoteException;
//    public cn.kepu.self.commons.service.ReportMessageRes getReport(java.lang.String arg0, java.lang.String arg1) throws java.rmi.RemoteException;
    public cn.kepu.self.commons.service.MtMessageRes sendSms(java.lang.String arg0, java.lang.String arg1, java.lang.String arg2, cn.kepu.self.commons.service.MtMessage arg3) throws java.rmi.RemoteException;
//    public cn.kepu.self.commons.service.BalanceRes getBalance(java.lang.String arg0, java.lang.String arg1) throws java.rmi.RemoteException;
}
