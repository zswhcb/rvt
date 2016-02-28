/*
Navicat MySQL Data Transfer

Source Server         : hq-mysql-1:22306
Source Server Version : 50623
Source Host           : 127.0.0.1:22306
Source Database       : rvt-manage

Target Server Type    : MYSQL
Target Server Version : 50623
File Encoding         : 65001

Date: 2016-02-28 16:12:14
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `r_project`
-- ----------------------------
DROP TABLE IF EXISTS `r_project`;
CREATE TABLE `r_project` (
  `id` varchar(32) NOT NULL,
  `PROJECT_NAME` varchar(32) DEFAULT NULL,
  `PROJECT_INTRO` varchar(512) DEFAULT NULL,
  `PROJECT_TYPE_ID` int(2) DEFAULT NULL,
  `TEL_NUM` varchar(32) DEFAULT NULL,
  `CREATE_USER_ID` varchar(32) DEFAULT NULL,
  `CREATE_TIME` datetime DEFAULT NULL,
  `STATUS` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of r_project
-- ----------------------------
INSERT INTO `r_project` VALUES ('56654bf2709f27ec7219d7ef', 'A项目一期201503', '中国9·3大阅兵体现了战略弹道导弹、巡航导弹武器遏制力量的最新变化。这才是最需要重视的。阅兵式上东风-15B、东风-16、东风-21D、东风-26、东风-31A、东风-5B依次亮相,涵盖600千米至12000千米射程,具体体现了五重战略威慑、遏制力量的排列。', '1', '10010', '5665135f0447a8f04668fd33', '2015-12-07 17:06:53', '1');
INSERT INTO `r_project` VALUES ('566576f22fa833b4064e3fe3', 'B项目一期201505', '其次采用核潜艇、无人机、岸基侦察机、预警机对航行中的美航母舰队实施精确定位、跟踪,不断传回数据,东风-21D根据这些坐标,实施打击。这需要中国的各种探测平台前出到接近第一岛链的海空领域。', '1', '10086', '56654ccbbace76fc6d67073e', '2015-12-07 20:10:11', '1');
INSERT INTO `r_project` VALUES ('5666af69fabc04001f1f9f24', 'B项目一期201504', '驾驶证、身份证都有有效期，为什么结婚证不能有有效期？面对难以抵挡的第四次单身潮和现在与日俱增的离婚率，近日，某学者提出一种大胆而令人惊叹的声音：结婚证应设置7年有效期，到期自动离婚，这样一来，许多社会问题就会迎刃而解。', '1', '10086', '56654ccbbace76fc6d67073e', '2015-12-08 18:22:34', '1');
INSERT INTO `r_project` VALUES ('5666af73fabc04001f1f9f25', 'A项目一期201502', '大国的核威慑、核/常遏制层次是多重的,这一点具体体现在冷战时代美苏五重核遏制体系。五重遏制是相辅相成的,缺一不可,最高层次的遏制,当然是对对方首都、核基地实施的洲际弹道导弹打击。', '2', '10010', '5665135f0447a8f04668fd33', '2015-12-08 18:22:44', '2');
INSERT INTO `r_project` VALUES ('5667d2c33c848ea00185cdcf', 'B项目一期201503', '到了这一层次,中美直接较量将难以避免,因此,中国对美第三层次的遏制,是使用新型的东风-21D打击航母舰队。这一层次,包括2种打击方式,第一种是打击港湾内的航母,主要针对日本横须贺基地的美军“里根”号核动力航母,依照目前二炮弹道导弹的打击精度,采用中段“北斗”、末段雷达成像技术制导,直接命中港湾静止状态的航母是可行的。', '1', '10086', '56654ccbbace76fc6d67073e', '2015-12-09 15:05:40', '1');
INSERT INTO `r_project` VALUES ('5667d2d43c848ea00185cdd0', 'B项目一期201502', '东风-16的弹头也可以看出锥形结构,弹道导弹对冲绳的打击,首轮攻击也有可能是对指挥大楼、战略中心的袭击,因此需要安装延迟引信,穿透大楼,这是几次冷战后局部战争的经验,美军的巡航导弹、GPS制导炸弹在首轮攻击中,尤其是对政府、军事机关的攻击,都采用延迟引信,实现穿地。当然东风-16可以携带的弹种也应该是多样的,基本上可能与东风-15相同。', '1', '10086', '56654ccbbace76fc6d67073e', '2015-12-09 15:05:56', '1');
INSERT INTO `r_project` VALUES ('5667e62cdfe75acc1514ba51', 'A项目一期201501', '能聊天的美女情感机器人来了!能打乒乓球的机器人可以和你对打!一群机器人在小场地里踢足球……2015世界机器人大会如同“武林大会”,各路厂商带着“小宝贝”纷纷亮相,世界机器人领域大师级的专家学者纷纷登台指点“现在与未来”的智能世界。', '1', '10086', '5665135f0447a8f04668fd33', '2015-12-09 16:28:29', '2');
INSERT INTO `r_project` VALUES ('566ec9d9a945957c0eee6b21', 'B项目一期201501', '首先看东风-15B短程导弹,一切遏制的起点从此开始,当然是针对台湾、南中国海、东中国海上的纷争地区,主要是台湾,这种导弹涵盖了整个台湾海峡和台湾岛。', '1', '10010', '56654ccbbace76fc6d67073e', '2015-12-14 21:53:30', '2');

-- ----------------------------
-- Table structure for `r_project_task`
-- ----------------------------
DROP TABLE IF EXISTS `r_project_task`;
CREATE TABLE `r_project_task` (
  `id` varchar(32) NOT NULL,
  `TASK_NAME` varchar(32) DEFAULT NULL,
  `TASK_INTRO` varchar(512) DEFAULT NULL,
  `SMS_INTRO` varchar(512) DEFAULT NULL,
  `TASK_SUM` int(11) DEFAULT NULL,
  `PROJECT_ID` varchar(32) DEFAULT NULL,
  `TALK_TIMEOUT` int(11) DEFAULT NULL,
  `TALK_TIME_MIN` int(11) DEFAULT NULL COMMENT '有效通话时长',
  `START_TIME` datetime DEFAULT NULL,
  `END_TIME` datetime DEFAULT NULL,
  `CREATE_USER_ID` varchar(32) DEFAULT NULL,
  `CREATE_TIME` datetime DEFAULT NULL,
  `STATUS` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of r_project_task
-- ----------------------------
INSERT INTO `r_project_task` VALUES ('4c3d558a2a954e0cbaea5565dcebf28c', '格林上东2016三期', '11', '22', '2', '5667d2d43c848ea00185cdd0', '4', '3', '2016-02-23 15:49:48', '2016-02-23 15:49:50', '5665135f0447a8f04668fd32', '2016-02-21 22:16:28', '2');
INSERT INTO `r_project_task` VALUES ('567a1484ba87e110122a1240', '020B011', '任务简介', '短信内容', '3', '5667d2d43c848ea00185cdd0', '360', '5', '2016-02-16 11:26:20', '2016-01-02 18:30:03', '5665135f0447a8f04668fd32', '2015-12-23 11:27:01', '1');
INSERT INTO `r_project_task` VALUES ('567a14c2ba87e110122a1241', '030B012', '任务简介1swss', '短信内容2', '41212', '5667d2c33c848ea00185cdcf', '720', '51', '2016-02-24 00:00:01', '2016-02-21 21:59:57', '5665135f0447a8f04668fd32', '2015-12-23 11:28:02', '1');
INSERT INTO `r_project_task` VALUES ('b4a8f9d011a34775b251fb2522353085', '协和城邦2016一期', '7', '8', '2', '56654bf2709f27ec7219d7ef', '4', '3', '2016-02-23 15:50:03', '2016-02-23 15:50:05', '5665135f0447a8f04668fd32', '2016-02-20 14:20:45', '2');

-- ----------------------------
-- Table structure for `r_project_task_take`
-- ----------------------------
DROP TABLE IF EXISTS `r_project_task_take`;
CREATE TABLE `r_project_task_take` (
  `id` varchar(32) NOT NULL,
  `UPLOAD_TIME` datetime DEFAULT NULL,
  `TALK_TIME` datetime DEFAULT NULL,
  `TALK_TIME_LEN` int(11) DEFAULT NULL,
  `TASK_ID` varchar(32) DEFAULT NULL,
  `USER_ID` varchar(32) DEFAULT NULL,
  `CREATE_TIME` datetime DEFAULT NULL,
  `STATUS` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of r_project_task_take
-- ----------------------------
INSERT INTO `r_project_task_take` VALUES ('56868fcbe7ce4a2419efde33', '2016-01-01 22:41:24', '2016-01-01 22:36:54', '61', '567a14c2ba87e110122a1241', '5665135f0447a8f04668fd32', '2016-01-01 22:40:11', '1');
INSERT INTO `r_project_task_take` VALUES ('56869399e7ce4a2419efde34', '2016-01-01 22:56:56', '2016-01-01 22:53:15', '7', '567a1484ba87e110122a1240', '5665135f0447a8f04668fd32', '2016-01-01 22:56:25', '1');

-- ----------------------------
-- Table structure for `s_menu`
-- ----------------------------
DROP TABLE IF EXISTS `s_menu`;
CREATE TABLE `s_menu` (
  `id` varchar(32) NOT NULL DEFAULT '',
  `PID` varchar(32) DEFAULT NULL,
  `PATH` varchar(512) DEFAULT NULL,
  `MENU_NAME` varchar(32) DEFAULT NULL,
  `MENU_URL` varchar(128) DEFAULT NULL,
  `SORT` int(2) DEFAULT NULL,
  `IS_PARENT` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of s_menu
-- ----------------------------
INSERT INTO `s_menu` VALUES ('1', '0', '0', '后台', '', '1', '1');
INSERT INTO `s_menu` VALUES ('10', '8', '0,1,4', '角色权限设置', '', '2', '0');
INSERT INTO `s_menu` VALUES ('11', '4', '0,1', '用户管理', '', '3', '1');
INSERT INTO `s_menu` VALUES ('12', '11', '0,1,4', '用户信息维护', 'user/', '1', '0');
INSERT INTO `s_menu` VALUES ('13', '11', '0,1,4', '用户角色设置', '', '2', '0');
INSERT INTO `s_menu` VALUES ('14', '4', '0,1', '动作管理', '', '4', '1');
INSERT INTO `s_menu` VALUES ('15', '14', '0,1,4', '动作信息维护', 'action/', '1', '0');
INSERT INTO `s_menu` VALUES ('16', '4', '0,1', '数据权限', '', '5', '1');
INSERT INTO `s_menu` VALUES ('17', '16', '0,1,4', '数据规则设置', '', '1', '0');
INSERT INTO `s_menu` VALUES ('18', '1', '0', '网站管理', '', '3', '1');
INSERT INTO `s_menu` VALUES ('19', '18', '0,1', '评论管理', '', '1', '1');
INSERT INTO `s_menu` VALUES ('2', '4', '0,1', '基本设置', '', '1', '1');
INSERT INTO `s_menu` VALUES ('20', '19', '0,1,18', '评论信息维护', 'comment/', '1', '0');
INSERT INTO `s_menu` VALUES ('21', '0', '0', '前台', '', '4', '1');
INSERT INTO `s_menu` VALUES ('22', '18', '0,1', '客户管理', '', '1', '1');
INSERT INTO `s_menu` VALUES ('23', '22', '0,1,18', '客户信息维护', 'customer/', '1', '0');
INSERT INTO `s_menu` VALUES ('24', '22', '0,21', '用户信息维护', 'tenantuser/index', '4', '0');
INSERT INTO `s_menu` VALUES ('25', '22', '0,21', '服务订单维护', 'softserviceorder/index', '2', '0');
INSERT INTO `s_menu` VALUES ('26', '22', '0,21', '组织机构维护', 'tenantorg/index', '3', '0');
INSERT INTO `s_menu` VALUES ('27', '1', '0', '日志管理', '', '5', '1');
INSERT INTO `s_menu` VALUES ('28', '18', '0,1', '房产频道', '', '3', '1');
INSERT INTO `s_menu` VALUES ('29', '28', '0,1,18', '项目管理', 'house/project/', '2', '0');
INSERT INTO `s_menu` VALUES ('3', '2', '0,1,4', '参数设置', '', '1', '0');
INSERT INTO `s_menu` VALUES ('4', '1', '0', '系统管理', '', '2', '1');
INSERT INTO `s_menu` VALUES ('5', '4', '0,1', '菜单管理', '', '1', '1');
INSERT INTO `s_menu` VALUES ('564d39b03da3e6cc1bd6fd81', '28', '0,1,18', '房企信息', 'house/corp/', '1', '0');
INSERT INTO `s_menu` VALUES ('56542c5d06f244d8113de620', '22', '0,1,18', '企业信息维护', 'corp/', '2', '0');
INSERT INTO `s_menu` VALUES ('565bb013a1f747241c0f1ed1', '28', '0,1,18', '报名电话', 'house/project/apply/', '3', '0');
INSERT INTO `s_menu` VALUES ('6', '5', '0,1,4', '菜单信息维护', 'menu/', '1', '0');
INSERT INTO `s_menu` VALUES ('7', '5', '0,1,4', '菜单操作注册', '', '2', '0');
INSERT INTO `s_menu` VALUES ('8', '4', '0,1', '角色管理', '', '2', '1');
INSERT INTO `s_menu` VALUES ('9', '8', '0,1,4', '角色信息维护', 'role/', '1', '0');

-- ----------------------------
-- Table structure for `s_role`
-- ----------------------------
DROP TABLE IF EXISTS `s_role`;
CREATE TABLE `s_role` (
  `id` varchar(32) NOT NULL,
  `ROLE_NAME` varchar(32) DEFAULT NULL,
  `CREATE_TIME` datetime DEFAULT NULL,
  `STATUS` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of s_role
-- ----------------------------
INSERT INTO `s_role` VALUES ('566512760fd5504c45483a93', '超级管理员', '2015-12-01 15:57:22', '1');
INSERT INTO `s_role` VALUES ('566512b49012fb044691ace4', '管理员', '2015-12-02 15:57:27', '2');
INSERT INTO `s_role` VALUES ('566512b49012fb044691ace5', '信息发布者（大蜜蜂）', '2015-12-03 15:57:31', '1');
INSERT INTO `s_role` VALUES ('566512b49012fb044691ace6', '业务员', '2015-12-04 15:57:36', '1');

-- ----------------------------
-- Table structure for `s_user`
-- ----------------------------
DROP TABLE IF EXISTS `s_user`;
CREATE TABLE `s_user` (
  `id` varchar(32) NOT NULL,
  `INVITE_USER_ID` varchar(32) DEFAULT NULL,
  `USER_NAME` varchar(32) DEFAULT NULL,
  `USER_PASS` varchar(32) DEFAULT NULL,
  `EMAIL` varchar(64) DEFAULT NULL,
  `CREATE_TIME` datetime DEFAULT NULL,
  `STATUS` int(2) DEFAULT NULL,
  `APIKEY` varchar(128) DEFAULT NULL,
  `SECKEY` varchar(128) DEFAULT NULL,
  `REAL_NAME` varchar(32) DEFAULT NULL,
  `ALIPAY_ACCOUNT` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of s_user
-- ----------------------------
INSERT INTO `s_user` VALUES ('566512760fd5504c45483a91', '5665135f0447a8f04668fd32', '18530053050', 'e10adc3949ba59abbe56e057f20f883e', '3203317@qq.com', '2016-02-14 14:50:13', '1', null, null, null, null);
INSERT INTO `s_user` VALUES ('566512760fd5504c45483a92', null, '13838394480', 'e10adc3949ba59abbe56e057f20f883e', '13838394480@qq.com', '2016-02-14 14:50:13', '1', null, null, null, null);
INSERT INTO `s_user` VALUES ('5665135f0447a8f04668fd32', '', 'bushuo', 'c4ca4238a0b923820dcc509a6f75849b', 'huangxin@foreworld.net', '2016-02-14 14:50:13', '1', 'AO5Z0FQwtEFgGvgrS3sTfQU6CzY4yURu4lYiOxuRjIUwE46cTxJFyOwIVHGXEfS1edsqUbVvskt2Yo39-KK0fg', 'JRJWY5hc8ZuCgnaVoytDhOZ8-1TWxjVK7lVBIc6WwLTvkj2i5MbbbhGF5sUjJm4P1PiVnLm6oW-eWvKNGfREgA', '黄鑫', 'huangxin@foreworld.net');
INSERT INTO `s_user` VALUES ('5665135f0447a8f04668fd33', null, 'xxfb001', 'e10adc3949ba59abbe56e057f20f883e', '', '2016-02-14 14:50:13', '1', null, null, null, null);
INSERT INTO `s_user` VALUES ('56654ccbbace76fc6d67073e', null, 'xxfb002', 'e10adc3949ba59abbe56e057f20f883e', '', '2016-02-14 14:50:13', '1', null, null, null, null);
INSERT INTO `s_user` VALUES ('56666155089a64dc10881fd6', '5665135f0447a8f04668fd32', '13683800587', 'e10adc3949ba59abbe56e057f20f883e', '13683800587@139.com', '2016-02-14 14:50:13', '2', null, null, null, null);
INSERT INTO `s_user` VALUES ('5666d061cca60fe0113d1391', null, '13526667995', 'e10adc3949ba59abbe56e057f20f883e', '13526667995@qq.com', '2016-02-14 14:50:13', '1', null, null, null, null);
INSERT INTO `s_user` VALUES ('5666d0c7cca60fe0113d1392', null, '13137708990', 'e10adc3949ba59abbe56e057f20f883e', '13137708990@139.com', '2016-02-14 14:50:13', '1', null, null, null, null);
INSERT INTO `s_user` VALUES ('567ca6be8b816778136162d6', null, '15978418986', 'e10adc3949ba59abbe56e057f20f883e', '', '2016-02-14 14:50:13', '2', null, null, null, null);
INSERT INTO `s_user` VALUES ('5680e6c84a943a481947a22c', null, '18530053020', 'e10adc3949ba59abbe56e057f20f883e', '', '2016-02-14 14:50:13', '1', null, null, null, null);
