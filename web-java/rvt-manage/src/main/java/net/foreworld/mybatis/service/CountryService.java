package net.foreworld.mybatis.service;

import java.util.List;

import com.github.pagehelper.PageInfo;
import net.foreworld.mybatis.model.Country;
import net.foreworld.mybatis.model.CountryQueryModel;

/**
 * @author liuzh_3nofxnp
 * @since 2015-09-19 17:17
 */
public interface CountryService extends IService<Country> {

    /**
     * 根据条件分页查询
     *
     * @param country
     * @param page
     * @param rows
     * @return
     */
    List<Country> selectByCountry(Country country, int page, int rows);

    /**
     * 分页查询,分页插件4.0.3版本特性演示
     *
     * @param queryModel
     * @return
     */
    PageInfo<Country> selectByCountryQueryModel(CountryQueryModel queryModel);

}
