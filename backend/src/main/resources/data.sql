-- =====================================================
-- data.sql: 初始化演示数据（中英文双语 + 管理员 + 主题）
-- =====================================================

-- ① 首页 (HOME) 内容
INSERT INTO page_content (page_key, content_key, content_zh, content_en, sort_order) VALUES
('HOME', 'HERO_TITLE',       '引领科技未来，赋能企业腾飞',                     'Lead the Future of Technology, Empower Enterprise Growth',          1),
('HOME', 'HERO_SUBTITLE',    '我们是一家专注于AI与云计算的科技公司，为全球客户提供一流的数字化解决方案。', 'We are a technology company focused on AI and cloud computing, delivering world-class digital solutions to global clients.', 2),
('HOME', 'HERO_CTA_PRIMARY', '立即开始',                                      'Get Started',                                                       3),
('HOME', 'HERO_CTA_SECONDARY','了解更多',                                     'Learn More',                                                        4),
('HOME', 'ABOUT_TITLE',      '关于我们',                                      'About Us',                                                          5),
('HOME', 'ABOUT_DESCRIPTION','成立于2015年，我们已帮助超过500家企业完成数字化转型，在AI、大数据、云计算领域拥有深厚积累。我们相信技术的力量可以让世界更美好。', 'Founded in 2015, we have helped over 500 enterprises complete digital transformation, with deep expertise in AI, big data, and cloud computing. We believe technology can make the world a better place.', 6),
('HOME', 'SERVICES_TITLE',   '核心服务',                                      'Core Services',                                                     7),
('HOME', 'SERVICE_1_TITLE',  'AI 智能解决方案',                               'AI Intelligent Solutions',                                          8),
('HOME', 'SERVICE_1_DESC',   '融合机器学习与深度学习，打造行业领先的AI应用，助力企业决策智能化。', 'Combining machine learning and deep learning to build industry-leading AI applications for intelligent enterprise decision-making.', 9),
('HOME', 'SERVICE_2_TITLE',  '云原生架构',                                    'Cloud-Native Architecture',                                         10),
('HOME', 'SERVICE_2_DESC',   '基于Kubernetes与微服务的现代化云原生架构，保障高可用、高弹性。',  'Modern cloud-native architecture based on Kubernetes and microservices, ensuring high availability and elasticity.',               11),
('HOME', 'SERVICE_3_TITLE',  '数据分析平台',                                  'Data Analytics Platform',                                           12),
('HOME', 'SERVICE_3_DESC',   '全链路数据采集、处理与可视化，将数据转化为业务洞察与竞争优势。',  'End-to-end data collection, processing, and visualization to transform data into business insights and competitive advantages.',    13),
('HOME', 'SERVICE_4_TITLE',  '企业数字化咨询',                                'Enterprise Digital Consulting',                                     14),
('HOME', 'SERVICE_4_DESC',   '提供从战略规划到落地实施的全周期咨询服务，加速企业数字化转型进程。','Full-cycle consulting from strategic planning to implementation, accelerating your enterprise digital transformation journey.',     15),
('HOME', 'STATS_CLIENTS',    '500+',                                          '500+',                                                              16),
('HOME', 'STATS_CLIENTS_LABEL','服务客户',                                    'Clients Served',                                                    17),
('HOME', 'STATS_PROJECTS',   '1200+',                                         '1200+',                                                             18),
('HOME', 'STATS_PROJECTS_LABEL','完成项目',                                   'Projects Completed',                                                19),
('HOME', 'STATS_YEARS',      '9+',                                            '9+',                                                                20),
('HOME', 'STATS_YEARS_LABEL','年行业经验',                                    'Years of Experience',                                               21),
('HOME', 'STATS_EXPERTS',    '200+',                                          '200+',                                                              22),
('HOME', 'STATS_EXPERTS_LABEL','技术专家',                                    'Tech Experts',                                                      23),
('HOME', 'CONTACT_TITLE',    '联系我们',                                      'Contact Us',                                                        24),
('HOME', 'CONTACT_SUBTITLE', '有任何问题或合作意向，欢迎随时与我们取得联系。',            'Have any questions or partnership ideas? Feel free to reach out to us anytime.', 25),
('HOME', 'CONTACT_ADDRESS',  '北京市朝阳区科技园区 A 座 18F',                  '18F, Building A, Chaoyang Tech Park, Beijing',                      26),
('HOME', 'CONTACT_EMAIL',    'contact@enterprisexx.com',                     'contact@enterprisexx.com',                                          27),
('HOME', 'CONTACT_PHONE',    '+86 10 8888 9999',                             '+86 10 8888 9999',                                                  28),
('HOME', 'FOOTER_COPYRIGHT', '© 2024 EnterpriseXX 科技有限公司. 保留所有权利。', '© 2024 EnterpriseXX Technology Co., Ltd. All Rights Reserved.',    29);

-- ② 关于页 (ABOUT) 内容
INSERT INTO page_content (page_key, content_key, content_zh, content_en, sort_order) VALUES
('ABOUT', 'PAGE_TITLE',      '公司简介',                                      'Company Profile',                                                   1),
('ABOUT', 'MISSION_TITLE',   '我们的使命',                                    'Our Mission',                                                       2),
('ABOUT', 'MISSION_TEXT',    '以技术创新驱动社会进步，让每一家企业都能享受科技红利。',      'Drive social progress through technological innovation, enabling every enterprise to benefit from the dividends of technology.', 3);

-- ③ 默认管理员由 DataInitializer 在启动时自动创建（admin / admin123）

-- ④ 预置主题
INSERT INTO site_theme (theme_key, theme_name, is_active, description) VALUES
('tech',       '科技公司',  TRUE,  '深色科技感，紫蓝渐变主色调，适合科技、互联网企业'),
('home',       '家装公司',  FALSE, '暖色温馨风格，棕色木质色调，适合家装、室内设计企业'),
('design',     '设计公司',  FALSE, '极简黑白灰，橙色点缀，适合设计、创意工作室'),
('retail',     '零售公司',  FALSE, '清新明亮，绿色自然色调，适合零售、快消品牌');

-- ⑤ 站点元数据：公司名与 Logo
INSERT INTO page_content (page_key, content_key, content_zh, content_en, sort_order) VALUES
('METADATA', 'COMPANY_NAME', 'EnterpriseXX 科技有限公司', 'EnterpriseXX Technology Co., Ltd.', 0),
('METADATA', 'LOGO_SYMBOL',  '⬡',                       '⬡',                                  1),
('METADATA', 'FAVICON_ICO',  'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=28 height=28 viewBox=0 0 28 28%3E%3Cpolygon points=27,14 21,3 7,3 1,14 7,25 21,25 27,14%27 fill=none stroke=%27%236366f1%27 stroke-width=2/%3E%3Cpolygon points=18,14 21,10 14,5 7,10 10,14 18,14%27 fill=%27%236366f1%27 fill-opacity=0.3/%3E%3C/svg%3E', '', 2);

-- ⑥ 公司案例演示数据
INSERT INTO portfolio_case (title_zh, title_en, client_zh, client_en, industry_zh, industry_en, overview_zh, overview_en, challenge_zh, challenge_en, solution_zh, solution_en, result_zh, result_en, image_url, sort_order, is_published, published_at) VALUES
('智能供应链管理系统', 
'Smart Supply Chain Management System',
'华联物流集团',
'Hualian Logistics Group',
'物流运输',
'Logistics & Transportation',
'为华联物流集团构建基于AI的端到端供应链可视化与优化平台，整合全国500+仓库与车队数据。',
'Built an AI-powered end-to-end supply chain visualization and optimization platform for Hualian Logistics Group, integrating data from 500+ warehouses and fleets nationwide.',
'原有系统数据孤岛严重，人工调度效率低下，无法应对双十一等高峰期的订单暴涨。',
'The legacy system had severe data silos, inefficient manual scheduling, and couldn''t handle order surges during peak periods like Double 11.',
'微服务架构 + 实时数据湖 + 深度学习预测模型，实现库存实时预测、路径智能优化、异常自动告警。',
'Microservices architecture + real-time data lake + deep learning prediction models for real-time inventory forecasting, intelligent route optimization, and automatic anomaly alerts.',
'调度效率提升40%，库存周转率提高35%，峰值处理能力达到原有系统的5倍，年节省成本1.2亿元。',
'Scheduling efficiency improved by 40%, inventory turnover increased by 35%, peak handling capacity reached 5 times of the original system, saving 120 million yuan annually.',
'https://images.unsplash.com/photo-1556740749-887f6717d6e4?w=800&h=500&fit=crop',
1, TRUE, '2025-08-15 10:00:00'),

('金融风控大数据平台',
'Financial Risk Control Big Data Platform',
'东方银行科技部',
'Dongfang Bank Technology Department',
'金融科技',
'FinTech',
'为东方银行打造全行级统一风控数据分析平台，覆盖信贷、反欺诈、合规监管三大核心场景。',
'Built an enterprise-wide unified risk control data analytics platform for Dongfang Bank, covering three core scenarios: credit, anti-fraud, and compliance supervision.',
'风控规则分散在20+独立系统，模型迭代周期长达数月，监管报送人工处理易出错。',
'Risk control rules were scattered across 20+ independent systems, model iteration cycles took months, and regulatory reporting relied on error-prone manual processing.',
'实时流处理架构 + 图算法 + 自动化模型训练流水线，支持秒级风控决策与T+0监管报送。',
'Real-time stream processing architecture + graph algorithms + automated model training pipeline, supporting second-level risk decisions and T+0 regulatory reporting.',
'风险识别准确性提升55%，欺诈案件发现率提高至98.7%，监管合规成本降低60%，模型迭代周期缩短至2周。',
'Risk identification accuracy improved by 55%, fraud detection rate increased to 98.7%, regulatory compliance costs reduced by 60%, model iteration cycle shortened to 2 weeks.',
'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
2, TRUE, '2025-06-20 10:00:00'),

('新零售全域会员系统',
'Omnichannel Membership System for New Retail',
'云购时尚集团',
'Yungou Fashion Group',
'新零售',
'New Retail',
'为云购时尚集团3000+门店构建端到端全渠道会员系统，打通线上线下会员数据与权益。',
'Built an end-to-end omnichannel membership system for Yungou Fashion Group''s 3000+ stores, integrating online and offline member data and benefits.',
'线上商城、线下POS、小程序等渠道会员数据不互通，营销活动重复投入且转化率低。',
'Membership data from online mall, offline POS, and mini-programs were not interconnected, marketing campaigns had duplicate investments and low conversion rates.',
'SaaS化会员中台 + 实时标签引擎 + 智能推荐算法，实现一人一策的个性化营销与会员生命周期管理。',
'SaaS-style membership platform + real-time tagging engine + intelligent recommendation algorithms, enabling personalized marketing and member lifecycle management.',
'会员复购率提升45%，客单价增长32%，营销活动ROI提升3倍，会员满意度达到96%。',
'Member repurchase rate increased by 45%, average order value grew by 32%, marketing campaign ROI improved 3x, member satisfaction reached 96%.',
'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
3, TRUE, '2025-04-10 10:00:00'),

('智慧医疗影像辅助诊断平台',
'Smart Medical Imaging Aided Diagnosis Platform',
'仁心医院联盟',
'Renxin Hospital Alliance',
'医疗健康',
'Healthcare',
'为全国30家三甲医院构建基于AI的医疗影像辅助诊断平台，支持CT、MRI、X光等多模态影像分析。',
'Built an AI-based medical imaging aided diagnosis platform for 30 top-tier hospitals nationwide, supporting multi-modal imaging analysis including CT, MRI, and X-ray.',
'医院影像诊断依赖医生经验，基层医院专家资源不足，阅片效率低且误诊风险高。',
'Imaging diagnosis relied on doctor experience, grassroots hospitals lacked expert resources, reading efficiency was low and misdiagnosis risk was high.',
'深度学习分割算法 + 联邦学习模型训练 + 云端协同诊断，实现病灶自动标记、定量分析与辅助决策。',
'Deep learning segmentation algorithms + federated learning model training + cloud collaborative diagnosis, enabling automatic lesion marking, quantitative analysis, and assisted decision-making.',
'阅片效率提升70%，病灶检出敏感性达到95.3%，基层医院诊断准确率提升至专家级水平，年服务患者超50万人。',
'Reading efficiency improved by 70%, lesion detection sensitivity reached 95.3%, grassroots hospital diagnostic accuracy improved to expert level, serving over 500,000 patients annually.',
'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=500&fit=crop',
4, TRUE, '2025-02-28 10:00:00');
