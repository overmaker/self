/**
 * SmsOperatorImpServiceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.kepu.self.commons.util.sms;

public class SmsOperatorImpServiceLocator extends org.apache.axis.client.Service implements cn.kepu.self.commons.util.sms.SmsOperatorImpService {

    public SmsOperatorImpServiceLocator() {
    }


    public SmsOperatorImpServiceLocator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public SmsOperatorImpServiceLocator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for SmsOperatorImpPort
    private java.lang.String SmsOperatorImpPort_address = "http://service.12302.cn:8080/ema/webService/smsOper";
//    private java.lang.String SmsOperatorImpPort_address = "http://127.0.0.1:8080/ctc-emassh60/webService/smsOper";

    public java.lang.String getSmsOperatorImpPortAddress() {
        return SmsOperatorImpPort_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String SmsOperatorImpPortWSDDServiceName = "SmsOperatorImpPort";

    public java.lang.String getSmsOperatorImpPortWSDDServiceName() {
        return SmsOperatorImpPortWSDDServiceName;
    }




    public cn.kepu.self.commons.util.sms.ISmsOperator getSmsOperatorImpPort(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            cn.kepu.self.commons.util.sms.SmsOperatorImpServiceSoapBindingStub _stub = new cn.kepu.self.commons.util.sms.SmsOperatorImpServiceSoapBindingStub(portAddress, this);
            _stub.setPortName(getSmsOperatorImpPortWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }
    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://sms.jwsserver.server.ema.ctc.com/", "SmsOperatorImpService");
    }

   


}
