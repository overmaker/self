package cn.kepu.self.others.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 李成志
 */
@XmlRootElement(name = "donation")
public class Donation extends BaseEntity {
    
    /**
     * 捐赠者或企业/机构名称
     */
    @XmlElement(name = "name")
    private String name;
    
    /**
     * 捐赠者身份证号或企业营业执照号码
     */
    @XmlElement(name = "no")
    private String no;
    
    /**
     * 捐赠金额
     */
    @XmlElement(name = "amount")
    private Integer amount;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }
    
}
