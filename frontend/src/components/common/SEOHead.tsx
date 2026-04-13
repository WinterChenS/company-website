import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSiteMetadata } from '@/store/siteMetadata';

interface SEOHeadProps {
  title?: string;
  description?: string;
  useSiteName?: boolean;
}

/**
 * 动态设置页面SEO标题和描述的组件
 * 如果提供了title/description，则使用提供的值
 * 如果未提供，则使用站点元数据中的公司名称
 * 如果连站点元数据也没有，则使用默认值
 */
export function SEOHead({ 
  title, 
  description, 
  useSiteName = true 
}: SEOHeadProps) {
  const intl = useIntl();
  const { siteName, logoSymbol } = useSiteMetadata();
  
  useEffect(() => {
    // 构建最终标题
    let finalTitle = '';
    
    if (title) {
      finalTitle = title;
    } else if (siteName) {
      finalTitle = siteName;
    } else {
      finalTitle = intl.locale === 'zh' ? 'Claw 科技' : 'Claw Technology';
    }
    
    // 如果启用了站点名称，并且标题不包含站点名称，则添加站点名称
    if (useSiteName && siteName && !finalTitle.includes(siteName)) {
      finalTitle = `${finalTitle} | ${siteName}`;
    }
    
    // 构建最终描述
    let finalDescription = '';
    
    if (description) {
      finalDescription = description;
    } else if (siteName) {
      finalDescription = intl.locale === 'zh' 
        ? `${siteName} - 引领科技未来，赋能企业腾飞`
        : `${siteName} - Leading the future of technology, empowering enterprise growth`;
    } else {
      finalDescription = intl.locale === 'zh'
        ? 'Claw - 引领科技未来，赋能企业腾飞'
        : 'Claw - Leading the future of technology, empowering enterprise growth';
    }
    
    // 设置页面标题
    document.title = finalTitle;
    
    // 设置meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', finalDescription);
    } else {
      // 如果meta description不存在，创建一个
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = finalDescription;
      document.head.appendChild(meta);
    }
    
    // 设置html lang属性
    document.documentElement.lang = intl.locale;
    
    // 清理函数
    return () => {
      // 可以在这里恢复默认值，但通常不需要
    };
  }, [title, description, siteName, intl.locale, useSiteName]);
  
  // 这是一个无UI组件
  return null;
}