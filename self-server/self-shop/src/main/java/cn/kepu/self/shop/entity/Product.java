package cn.kepu.self.shop.entity;

import cn.kepu.self.commons.entity.BaseEntity;

/**
 *
 * @author 李成志
 */
public class Product extends BaseEntity {
    
    /**
     * 商品编号
     */
    private String sn;
    
    /**
     * 商品名称
     */
    private String name;
    
    /**
     * 商品介绍
     */
    private String introduction;
    
    /**
     * 商品缩略图存放相对路径
     */
    private String thumbnail;
    
    /**
     * 商品大图存放相对路径
     */
    private String image;
    
    /**
     * 商品价格
     */
    private Double price;
    
    /**
     * 商品重量
     */
    private Double weight;
    
    /**
     * 商品积分
     */
    private Integer score;
    
    /**
     * 首页显示
     */
    private Integer is_recommend;
    
    /**
     * 是否启用
     */
    private Integer is_enable;
    
    /**
     * 商品分类
     */
    private ProductType type;
    
    /**
     * 商品信息
     */
    private ProductInfo pinfo;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getIs_recommend() {
        return is_recommend;
    }

    public void setIs_recommend(Integer is_recommend) {
        this.is_recommend = is_recommend;
    }

    public Integer getIs_enable() {
        return is_enable;
    }

    public void setIs_enable(Integer is_enable) {
        this.is_enable = is_enable;
    }

    public ProductType getType() {
        return type;
    }

    public void setType(ProductType type) {
        this.type = type;
    }

    public ProductInfo getPinfo() {
        return pinfo;
    }

    public void setPinfo(ProductInfo pinfo) {
        this.pinfo = pinfo;
    }
    
}
