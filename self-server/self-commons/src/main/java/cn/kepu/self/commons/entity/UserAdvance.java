package cn.kepu.self.commons.entity;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 用户高级
 *
 * @author 马亚星
 */
@XmlRootElement(name = "user-advance")
public final class UserAdvance extends BaseEntity {

    /**
     * 身份证号
     */
    @XmlElement(name = "identification")
    private String identification;

    /**
     * 身份图片存放份的相对路径
     */
    @XmlElement(name = "identification-pic")
    private String identificationPic;

    /**
     * 资质证书存放的相对路径
     */
    @XmlElement(name = "qualification-pic")
    private String qualificationPic;

    /**
     * 用户自我介绍
     */
    @XmlElement(name = "introduction")
    private String introduction;

    /**
     * 用户真实姓名
     */
    @XmlElement(name = "name")
    private String name;

    public String getIdentification() {
        return identification;
    }

    public void setIdentification(String identification) {
        this.identification = identification;
    }

    public String getIdentificationPic() {
        return identificationPic;
    }

    public void setIdentificationPic(String identificationPic) {
        this.identificationPic = identificationPic;
    }

    public String getQualificationPic() {
        return qualificationPic;
    }

    public void setQualificationPic(String qualificationPic) {
        this.qualificationPic = qualificationPic;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
