package cn.kepu.self.others.entity;

import cn.kepu.self.commons.entity.BaseEntity;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 李成志
 */
@XmlRootElement(name = "cooperation")
public class Cooperation extends BaseEntity {
    
    /**
     * 合作机构标题
     */
    @XmlElement(name = "title")
    private String title;
    
    /**
     * 合作机构图片
     */
    @XmlElement(name = "image")
    private String image;
    
    /**
     * 组织机构代码证编号
     */
    @XmlElement(name = "business-license-no")
    private String business_license_no;
    
    /**
     * 组织机构代码证扫描件
     */
    @XmlElement(name = "business-license-pic")
    private String business_license_pic;
    
    /**
     * 合作机构内容
     */
    @XmlElement(name = "introduction")
    private String introduction;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getBusiness_license_no() {
        return business_license_no;
    }

    public void setBusiness_license_no(String business_license_no) {
        this.business_license_no = business_license_no;
    }

    public String getBusiness_license_pic() {
        return business_license_pic;
    }

    public void setBusiness_license_pic(String business_license_pic) {
        this.business_license_pic = business_license_pic;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

}
