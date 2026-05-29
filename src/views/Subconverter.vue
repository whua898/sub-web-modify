<template>
  <div>
    <el-row style="margin-top: 10px">
      <el-col>
        <el-card>
          <template #header>
            <div style="position: relative;">
              <div style="position: absolute; left: 0; top: 0; display: flex; align-items: center; height: 100%;">
                <svg-icon class="gayhub" icon-class="github" @click="goToProject" />
                <svg-icon class="dianbao" icon-class="telegram" style="margin-left: 10px" @click="gotoTgChannel" />
              </div>
              <div style="text-align: center; font-size: 20px;">订 阅 转 换</div>
              <div style="position: absolute; right: 0; top: 0; display: flex; align-items: center; height: 100%; flex-direction: row-reverse;">
                <svg-icon class="youguan" icon-class="youtube" style="margin-left: 10px" @click="gotoYouTuBe" />
                <svg-icon class="channel" icon-class="telegram" style="margin-left: 10px" @click="gotoTgChannel" />
              </div>
            </div>
          </template>
          <el-container>
            <el-form :model="form" label-width="80px" label-position="left" style="width: 100%">
              <div class="subscription-tip">支持各种订阅链接或单节点链接，多个链接每行一个或用 | 分隔</div>
              <el-form-item label="订阅链接:" class="subscription-link-row">
                <el-input
                    v-model="form.sourceSubUrl"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 5 }"
                    placeholder=""
                />
              </el-form-item>
              <el-form-item label="生成类型:">
                <el-select v-model="form.clientType" style="width: 100%">
                  <el-option v-for="(v, k) in options.clientTypes" :key="k" :label="k" :value="v"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="后端地址:">
                <el-select v-model="form.customBackend" allow-create filterable @change="selectChanged"
                  placeholder="可输入自己的后端" style="width: 100%">
                  <el-option v-for="(v, k) in options.customBackend" :key="k" :label="k" :value="v"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="短链选择:">
                <el-select v-model="form.shortType" allow-create filterable placeholder="可输入其他可用短链API"
                  style="width: 100%">
                  <el-option v-for="(v, k) in options.shortTypes" :key="k" :label="k" :value="v"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="远程配置:" v-if="showRemoteConfig">
                <el-select v-model="form.remoteConfig" allow-create filterable placeholder="请选择" style="width: 100%">
                  <el-option-group v-for="group in options.remoteConfig" :key="group.label" :label="group.label">
                    <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                      :value="item.value"></el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label-width="0px" class="advanced-item">
                <el-collapse>
                  <el-collapse-item>
                    <template #title>
                      <div style="display: flex; align-items: center; width: 100%;">
                        <div style="width: 80px; font-size: 14px; color: #606266; text-align: left;">高级功能:</div>
                        <div style="flex: 1; text-align: center;">
                          <el-button type="text" style="font-size: 13px; padding-right: 80px;">点击展开/收起</el-button>
                        </div>
                      </div>
                    </template>
                    <el-form-item label="包含节点:">
                      <el-input v-model="form.includeRemarks" placeholder="要保留的节点，支持正则" />
                    </el-form-item>
                    <el-form-item label="排除节点:">
                      <el-input v-model="form.excludeRemarks" placeholder="要排除的节点，支持正则" />
                    </el-form-item>
                    <el-form-item label="节点命名:">
                      <el-input v-model="form.rename" placeholder="举例：`a@b``1@2`，|符可用\转义" />
                    </el-form-item>
                    <el-form-item label="远程设备:">
                      <el-input v-model="form.devid" placeholder="用于设置QuantumultX的远程设备ID" />
                    </el-form-item>
                    <el-form-item label="更新间隔:">
                      <el-input v-model="form.interval" placeholder="返用于设置托管配置更新间隔，单位为天" />
                    </el-form-item>
                    <el-form-item label="订阅命名:">
                      <el-input v-model="form.filename" placeholder="返回的订阅文件名，可以在支持文件名的客户端中显示出来" />
                    </el-form-item>
                    <el-form-item class="eldiy" label-width="0px">
                      <el-row type="flex">
                        <el-col>
                          <el-checkbox v-model="form.nodeList" label="仅输出节点信息" border></el-checkbox>
                        </el-col>
                        <el-popover placement="bottom" v-model="form.extraset">
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.emoji" label="Emoji" :disabled="disabledOptions.emoji"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.insert" label="插入默认节点" :disabled="disabledOptions.insert"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.udp" label="启用 UDP" :disabled="disabledOptions.udp"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.xudp" label="启用 XUDP" :disabled="disabledOptions.xudp"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.tfo" label="启用 TFO" :disabled="disabledOptions.tfo"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.sort" label="基础节点排序" :disabled="disabledOptions.sort"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.tpl.clash.doh" label="Clash.DoH" :disabled="disabledOptions.clash_doh"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.appendType" label="插入节点类型" :disabled="disabledOptions.appendType"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.tpl.surge.doh" label="Surge.DoH" :disabled="disabledOptions.surge_doh"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.tls13" label="开启TLS_1.3" :disabled="disabledOptions.tls13"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.expand" label="展开规则全文" :disabled="disabledOptions.expand"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.new_name" label="Clash新字段名" :disabled="disabledOptions.new_name"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.scv" label="跳过证书验证" :disabled="disabledOptions.scv"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.fdn" label="过滤不支持节点" :disabled="disabledOptions.fdn"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.tpl.singbox.ipv6" label="Sing-Box支持IPV6" :disabled="disabledOptions.singbox_ipv6"></el-checkbox>
                            </el-col>

                          </el-row>
                          <template #reference>
                            <el-button>更多选项</el-button>
                          </template>
                        </el-popover>
                      </el-row>
                    </el-form-item>
                  </el-collapse-item>
                </el-collapse>
              </el-form-item>
              <el-divider class="theme-toggle-divider" content-position="center">
                <el-button class="el-button--theme" @click="toggleTheme" title="点击切换主题">
                  <i id="rijian" class="el-icon-sunny"></i>
                  <i id="yejian" class="el-icon-moon"></i>
                </el-button>
              </el-divider>
              <el-form-item label="定制订阅:">
                <el-input class="copy-content" disabled v-model="customSubUrl">
                  <template #append>
                    <el-button @click="copyText(customSubUrl)" icon="el-icon-document-copy">复制</el-button>
                  </template>
                  <template #prepend>
                    <el-button @click="openLink(customSubUrl)" icon="el-icon-link" v-if="customSubUrl">访问</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="订阅短链:">
                <el-input class="copy-content" v-model="customShortSubUrl" style="position: relative;">
                  <template #suffix>
                    <div style="color: #999; font-size: 12px; display: flex; align-items: center; height: 100%; pointer-events: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      输入自定义短链接后缀，点击生成短链接可反复生成
                    </div>
                  </template>
                  <template #append>
                    <el-button @click="copyText(customShortSubUrl)" icon="el-icon-document-copy">复制</el-button>
                  </template>
                  <template #prepend>
                    <el-button @click="openLink(customShortSubUrl)" icon="el-icon-link" v-if="customShortSubUrl">访问</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="定制后缀:">
                <el-input v-model="form.customSlug" placeholder="可选,如 GCP" style="width: 11%;"></el-input>
                <el-select v-model="form.customSlug" placeholder="历史后缀" style="width: 10%; margin-left: 10px;">
                  <el-option
                    v-for="item in customSlugHistory"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <el-button type="info" @click="syncHistory" :loading="loadingSync" icon="el-icon-refresh" circle style="margin-left: 5px; padding: 8px;" title="同步云端历史"></el-button>
                <el-button type="primary" @click="reverseLookup" :loading="loadingReverse" style="margin-left: 10px;">反查</el-button>
              </el-form-item>
              <el-form-item label-width="0px" style="margin-top: 5px; text-align: center">
                <el-button style="width: 120px" type="danger" @click="makeUrl"
                  :disabled="form.sourceSubUrl.length === 0 || btnBoolean">生成订阅链接
                </el-button>
                <el-button style="width: 120px" type="danger" @click="makeShortUrl" :loading="loadingShortUrl"
                  :disabled="customSubUrl.length === 0">生成短链接
                </el-button>
              </el-form-item>
              <el-form-item label-width="0px" style="text-align: center">
                <el-button style="width: 120px" type="primary" @click="dialogUploadConfigVisible = true"
                  icon="el-icon-upload" :loading="loadingUpload">自定义配置
                </el-button>
                <el-button style="width: 120px" type="primary" @click="dialogLoadConfigVisible = true"
                  icon="el-icon-copy-document" :loading="loadingLoad">从URL解析
                </el-button>
              </el-form-item>
              <el-form-item label-width="0px" style="text-align: center">
                <el-button style="width: 250px;" type="success" icon="el-icon-video-play"
                  @click="centerDialogVisible = true">视频教程
                </el-button>
              </el-form-item>
              <el-form-item label-width="0px" style="text-align: center">
                <span style="font-size: 12px; color: #999;">后端版本: {{ backendVersion }}</span>
              </el-form-item>
            </el-form>
          </el-container>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="请选择需要观看的视频教程" :visible.sync="centerDialogVisible" :show-close="false" width="40vh" top="30vh"
      center>
      <div style="text-align: center">
        <el-button style="width: 200px;" type="primary" icon="el-icon-video-play"
          @click="gotoBasicVideo(); centerDialogVisible = false">基础视频教程
        </el-button>
      </div>
      <div style="text-align: center;margin: 3vh 0 2vh">
        <el-button style="width: 200px;" type="danger" icon="el-icon-video-play"
          @click="gotoAdvancedVideo(); centerDialogVisible = false">进阶视频教程
        </el-button>
      </div>
      <div style="text-align: center;margin: 3vh 0 2vh">
        <el-button style="width: 200px;" type="warning" icon="el-icon-download" @click="toolsDown">代理工具集合
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogUploadConfigVisible" :show-close="false" :close-on-click-modal="false"
      :close-on-press-escape="false" width="80%">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="远程配置上传" name="first">
          <el-link type="danger" :href="sampleConfig" style="margin-bottom: 15px" target="_blank" icon="el-icon-info">
            参考案例
          </el-link>
          <el-form label-position="left">
            <el-form-item prop="uploadConfig">
              <el-input v-model="uploadConfig" type="textarea" :autosize="{ minRows: 15, maxRows: 15 }"
                maxlength="50000" show-word-limit></el-input>
            </el-form-item>
          </el-form>
          <div style="float: right">
            <el-button type="primary" @click="uploadConfig = ''; dialogUploadConfigVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmUploadConfig" :disabled="uploadConfig.length === 0">确 定
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="JS排序节点" name="second">
          <el-link type="success" :href="scriptConfig" style="margin-bottom: 15px" target="_blank" icon="el-icon-info">
            参考案例
          </el-link>
          <el-form label-position="left">
            <el-form-item prop="uploadScript">
              <el-input v-model="uploadScript" placeholder="本功能暂停使用，如有兴趣，自行去我的GitHub参考sub-web-api项目部署！" type="textarea"
                :autosize="{ minRows: 15, maxRows: 15 }" maxlength="50000" show-word-limit></el-input>
            </el-form-item>
          </el-form>
          <div style="float: right">
            <el-button type="primary" @click="uploadScript = ''; dialogUploadConfigVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmUploadScript" :disabled="uploadScript.length === 0">确 定
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="JS筛选节点" name="third">
          <el-link type="warning" :href="filterConfig" style="margin-bottom: 15px" target="_blank" icon="el-icon-info">
            参考案例
          </el-link>
          <el-form label-position="left">
            <el-form-item prop="uploadFilter">
              <el-input v-model="uploadFilter" placeholder="本功能暂停使用，如有兴趣，自行去我的GitHub参考sub-web-api项目部署！" type="textarea"
                :autosize="{ minRows: 15, maxRows: 15 }" maxlength="50000" show-word-limit></el-input>
            </el-form-item>
          </el-form>
          <div style="float: right">
            <el-button type="primary" @click="uploadFilter = ''; dialogUploadConfigVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmUploadScript" :disabled="uploadFilter.length === 0">确 定
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog :visible.sync="dialogLoadConfigVisible" :show-close="false" :close-on-click-modal="false"
      :close-on-press-escape="false" width="80%">
      <template #title>
        <div>
          可以从生成的长/短链接中解析信息,填入页面中去
        </div>
      </template>
      <el-form label-position="left">
        <el-form-item prop="uploadConfig">
          <el-input v-model="loadConfig" type="textarea" :autosize="{ minRows: 15, maxRows: 15 }" maxlength="5000"
            show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="loadConfig = ''; dialogLoadConfigVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmLoadConfig" :disabled="loadConfig.length === 0">确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 环境变量读取
const project = process.env.VUE_APP_PROJECT
const configScriptBackend = process.env.VUE_APP_CONFIG_UPLOAD_BACKEND + '/api.php'
const remoteConfigSample = process.env.VUE_APP_SUBCONVERTER_REMOTE_CONFIG
const scriptConfigSample = process.env.VUE_APP_SCRIPT_CONFIG
const filterConfigSample = process.env.VUE_APP_FILTER_CONFIG
const defaultBackend = process.env.VUE_APP_SUBCONVERTER_DEFAULT_BACKEND
const configUploadBackend = process.env.VUE_APP_CONFIG_UPLOAD_BACKEND + '/sub.php'
const basicVideo = process.env.VUE_APP_BASIC_VIDEO
const advancedVideo = process.env.VUE_APP_ADVANCED_VIDEO
const tgBotLink = process.env.VUE_APP_BOT_LINK
const yglink = process.env.VUE_APP_YOUTUBE_LINK

export default {
  data() {
    return {
      // 基础状态
      isPC: true,
      btnBoolean: false,
      backendVersion: "",
      activeName: 'first',
      centerDialogVisible: false, // 视频弹窗控制
      
      // 选项配置
      options: {
        clientTypes: {
          Clash: "clash",
          "Surge4/5": "surge&ver=4",
          "Sing-Box": "singbox",
          V2Ray: "v2ray",
          Trojan: "trojan",
          ShadowsocksR: "ssr",
          "混合订阅（mixed）": "mixed",
          Surfboard: "surfboard",
          Quantumult: "quan",
          "Quantumult X": "quanx",
          Loon: "loon",
          Mellow: "mellow",
          Surge3: "surge&ver=3",
          Surge2: "surge&ver=2",
          ClashR: "clashr",
          "Shadowsocks(SIP002)": "ss",
          "Shadowsocks Android(SIP008)": "sssub",
          ShadowsocksD: "ssd",
          "自动判断客户端": "auto",
        },
        shortTypes: {
          "short.8dy.xx.kg": "https://short.8dy.xx.kg/short",
          "v1.mk": "https://v1.mk/short",
          "d1.mk": "https://d1.mk/short",
          "dlj.tf": "https://dlj.tf/short",
          "suo.yt": "https://suo.yt/short",
        },
        customBackend: {
          "CM负载均衡后端【vless reality+hy1+hy2】": "https://subapi.cmliussss.net",
          "CM应急备用后端【vless reality+hy1+hy2】": "https://subapi.fxxk.dedyn.io",
          "肥羊增强型后端【vless reality+hy1+hy2】": "https://url.v1.mk",
          "肥羊备用后端【vless reality+hy1+hy2】": "https://sub.d1.mk",
          "nameless13提供": "https://www.nameless13.com",
          "subconverter作者提供": "https://sub.xeton.dev",
          "sub-web作者提供": "https://api.wcc.best",
        },
        remoteConfig: [
          {
            label: "CM规则",
            options: [
              {
                label: "CM_Online 默认版 识别港美地区(与Github同步)",
                value: "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online.ini"
              },
              {
                label: "CM_Online_MultiCountry 识别港美地区 负载均衡(与Github同步)",
                value: "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_MultiCountry.ini"
              },
              {
                label: "CM_Online_MultiCountry_CF 识别港美地区、CloudFlareCDN 负载均衡 Worker节点专用(与Github同步)",
                value: "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_MultiCountry_CF.ini"
              },
              {
                label: "CM_Online_Full 识别多地区分组(与Github同步)",
                value: "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full.ini"
              },
              {
                label: "CM_Online_Full_CF 识别多地区、CloudFlareCDN 分组 Worker节点专用(与Github同步)",
                value: "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_CF.ini"
              },
              {
                label: "CM_Online_Full_MultiMode 识别多地区 负载均衡(与Github同步)",
                value: "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini"
              },
              {
                label: "CM_Online_Full_MultiMode_CF 识别多地区、CloudFlareCDN 负载均衡 Worker节点专用(与Github同步)",
                value: "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode_CF.ini"
              }
            ]
          },
          {
            label: "通用",
            options: [
              {
                label: "默认",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini"
              },
              {
                label: "默认（自动测速）",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini"
              },
              {
                label: "默认（索尼电视专用）",
                value: "https://raw.githubusercontent.com/youshandefeiyang/webcdn/main/SONY.ini"
              },
              {
                label: "默认（附带用于 Clash 的 AdGuard DNS）",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/default_with_clash_adg.yml"
              },
              {
                label: "ACL_全分组 Dream修改版",
                value: "https://raw.githubusercontent.com/WC-Dream/ACL4SSR/WD/Clash/config/ACL4SSR_Online_Full_Dream.ini"
              },
              {
                label: "ACL_精简分组 Dream修改版",
                value: "https://raw.githubusercontent.com/WC-Dream/ACL4SSR/WD/Clash/config/ACL4SSR_Mini_Dream.ini"
              },
              {
                label: "emby-TikTok-流媒体分组-去广告加强版",
                value: "https://raw.githubusercontent.com/justdoiting/ClashRule/main/GeneralClashRule.ini"
              },
              {
                label: "流媒体通用分组",
                value: "https://raw.githubusercontent.com/cutethotw/ClashRule/main/GeneralClashRule.ini"
              }
            ]
          },
          {
            label: "ACL规则",
            options: [
              {
                label: "ACL_默认版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini"
              },
              {
                label: "ACL_无测速版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoAuto.ini"
              },
              {
                label: "ACL_去广告版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_AdblockPlus.ini"
              },
              {
                label: "ACL_多国家版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_MultiCountry.ini"
              },
              {
                label: "ACL_无Reject版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoReject.ini"
              },
              {
                label: "ACL_无测速精简版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_NoAuto.ini"
              },
              {
                label: "ACL_全分组版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini"
              },
              {
                label: "ACL_全分组谷歌版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Google.ini"
              },
              {
                label: "ACL_全分组多模式版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_MultiMode.ini"
              },
              {
                label: "ACL_全分组奈飞版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Netflix.ini"
              },
              {
                label: "ACL_精简版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini"
              },
              {
                label: "ACL_去广告精简版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_AdblockPlus.ini"
              },
              {
                label: "ACL_Fallback精简版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_Fallback.ini"
              },
              {
                label: "ACL_多国家精简版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiCountry.ini"
              },
              {
                label: "ACL_多模式精简版",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini"
              }
            ]
          },
          {
            label: "全网搜集规则",
            options: [
              {
                label: "常规规则",
                value: "https://raw.githubusercontent.com/flyhigherpi/merlinclash_clash_related/master/Rule_config/ZHANG.ini"
              },
              {
                label: "酷酷自用",
                value: "https://raw.githubusercontent.com/xiaoshenxian233/cool/rule/complex.ini"
              },
              {
                label: "PharosPro无测速",
                value:
                  "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/special/phaors.ini"
              },
              {
                label: "分区域故障转移",
                value: "https://raw.githubusercontent.com/flyhigherpi/merlinclash_clash_related/master/Rule_config/ZHANG_Area_Fallback.ini"
              },
              {
                label: "分区域自动测速",
                value: "https://raw.githubusercontent.com/flyhigherpi/merlinclash_clash_related/master/Rule_config/ZHANG_Area_Urltest.ini"
              },
              {
                label: "分区域无自动测速",
                value: "https://raw.githubusercontent.com/flyhigherpi/merlinclash_clash_related/master/Rule_config/ZHANG_Area_NoAuto.ini"
              },
              {
                label: "OoHHHHHHH",
                value: "https://raw.githubusercontent.com/OoHHHHHHH/ini/master/config.ini"
              },
              {
                label: "CFW-TAP",
                value: "https://raw.githubusercontent.com/OoHHHHHHH/ini/master/cfw-tap.ini"
              },
              {
                label: "lhl77全分组（定期更新）",
                value: "https://raw.githubusercontent.com/lhl77/sub-ini/main/tsutsu-full.ini"
              },
              {
                label: "lhl77简易版（定期更新）",
                value: "https://raw.githubusercontent.com/lhl77/sub-ini/main/tsutsu-mini-gfw.ini"
              },
              {
                label: "ConnersHua 神机规则 Outbound",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/connershua_new.ini"
              },
              {
                label: "ConnersHua 神机规则 Inbound 回国专用",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/connershua_backtocn.ini"
              },
              {
                label: "lhie1 洞主规则（使用 Clash 分组规则）",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/lhie1_clash.ini"
              },
              {
                label: "lhie1 洞主规则完整版",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/lhie1_dler.ini"
              },
              {
                label: "eHpo1 规则",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/ehpo1_main.ini"
              },
              {
                label: "多策略组默认白名单模式",
                value: "https://raw.nameless13.com/api/public/dl/ROzQqi2S/white.ini"
              },
              {
                label: "多策略组可以有效减少审计触发",
                value: "https://raw.nameless13.com/api/public/dl/ptLeiO3S/mayinggfw.ini"
              },
              {
                label: "精简策略默认白名单",
                value: "https://raw.nameless13.com/api/public/dl/FWSh3dXz/easy3.ini"
              },
              {
                label: "多策略增加SMTP策略",
                value: "https://raw.nameless13.com/api/public/dl/L_-vxO7I/youtube.ini"
              },
              {
                label: "无策略入门推荐",
                value: "https://raw.nameless13.com/api/public/dl/zKF9vFbb/easy.ini"
              },
              {
                label: "无策略入门推荐国家分组",
                value: "https://raw.nameless13.com/api/public/dl/E69bzCaE/easy2.ini"
              },
              {
                label: "无策略仅IPIP CN + Final",
                value: "https://raw.nameless13.com/api/public/dl/XHr0miMg/ipip.ini"
              },
              {
                label: "无策略魅影vip分组",
                value: "https://raw.nameless13.com/api/public/dl/BBnfb5lD/MAYINGVIP.ini"
              },
              {
                label: "品云专属配置（仅香港区域分组）",
                value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Examine.ini"
              },
              {
                label: "品云专属配置（全地域分组）",
                value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Examine_Full.ini"
              },
              {
                label: "nzw9314 规则",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/nzw9314_custom.ini"
              },
              {
                label: "maicoo-l 规则",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/maicoo-l_custom.ini"
              },
              {
                label: "DlerCloud Platinum 李哥定制规则",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/dlercloud_lige_platinum.ini"
              },
              {
                label: "DlerCloud Gold 李哥定制规则",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/dlercloud_lige_gold.ini"
              },
              {
                label: "DlerCloud Silver 李哥定制规则",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/dlercloud_lige_silver.ini"
              },
              {
                label: "ProxyStorage自用",
                value: "https://unpkg.com/proxy-script/config/Clash/clash.ini"
              },
              {
                label: "ShellClash修改版规则 (by UlinoyaPed)",
                value: "https://github.com/UlinoyaPed/ShellClash/raw/master/rules/ShellClash.ini"
              }
            ]
          },
          {
            label: "各大机场规则",
            options: [
              {
                label: "EXFLUX",
                value:
                  "https://gist.github.com/jklolixxs/16964c46bad1821c70fa97109fd6faa2/raw/EXFLUX.ini"
              },
              {
                label: "NaNoport",
                value:
                  "https://gist.github.com/jklolixxs/32d4e9a1a5d18a92beccf3be434f7966/raw/NaNoport.ini"
              },
              {
                label: "CordCloud",
                value:
                  "https://gist.github.com/jklolixxs/dfbe0cf71ffc547557395c772836d9a8/raw/CordCloud.ini"
              },
              {
                label: "BigAirport",
                value:
                  "https://gist.github.com/jklolixxs/e2b0105c8be6023f3941816509a4c453/raw/BigAirport.ini"
              },
              {
                label: "跑路云",
                value:
                  "https://gist.github.com/jklolixxs/9f6989137a2cfcc138c6da4bd4e4cbfc/raw/PaoLuCloud.ini"
              },
              {
                label: "WaveCloud",
                value:
                  "https://gist.github.com/jklolixxs/fccb74b6c0018b3ad7b9ed6d327035b3/raw/WaveCloud.ini"
              },
              {
                label: "几鸡",
                value:
                  "https://gist.github.com/jklolixxs/bfd5061dceeef85e84401482f5c92e42/raw/JiJi.ini"
              },
              {
                label: "四季加速",
                value:
                  "https://gist.githubusercontent.com/jklolixxs/6ff6e7658033e9b535e24ade072cf374/raw/SJ.ini"
              },
              {
                label: "ImmTelecom",
                value:
                  "https://gist.githubusercontent.com/jklolixxs/24f4f58bb646ee2c625803eb916fe36d/raw/ImmTelecom.ini"
              },
              {
                label: "AmyTelecom",
                value:
                  "https://gist.githubusercontent.com/jklolixxs/b53d315cd1cede23af83322c26ce34ec/raw/AmyTelecom.ini"
              },
              {
                label: "LinkCube",
                value:
                  "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/customized/convenience.ini"
              },
              {
                label: "Miaona",
                value:
                  "https://gist.github.com/jklolixxs/ff8ddbf2526cafa568d064006a7008e7/raw/Miaona.ini"
              },
              {
                label: "Foo&Friends",
                value:
                  "https://gist.github.com/jklolixxs/df8fda1aa225db44e70c8ac0978a3da4/raw/Foo&Friends.ini"
              },
              {
                label: "ABCloud",
                value:
                  "https://gist.github.com/jklolixxs/b1f91606165b1df82e5481b08fd02e00/raw/ABCloud.ini"
              },
              {
                label: "咸鱼",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/xianyu.ini"
              },
              {
                label: "便利店",
                value: "https://subweb.oss-cn-hongkong.aliyuncs.com/RemoteConfig/customized/convenience.ini"
              },
              {
                label: "CNIX",
                value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/SSRcloud.ini"
              },
              {
                label: "Nirvana",
                value: "https://raw.githubusercontent.com/Mazetsz/ACL4SSR/master/Clash/config/V2rayPro.ini"
              },
              {
                label: "V2Pro",
                value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/V2Pro.ini"
              },
              {
                label: "史迪仔-自动测速",
                value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Stitch.ini"
              },
              {
                label: "史迪仔-负载均衡",
                value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Stitch-Balance.ini"
              },
              {
                label: "Maying",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/maying.ini"
              },
              {
                label: "Ytoo",
                value: "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/customized/ytoo.ini"
              },
              {
                label: "w8ves",
                value: "https://raw.nameless13.com/api/public/dl/M-We_Fn7/w8ves.ini"
              },
              {
                label: "NyanCAT",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/nyancat.ini"
              },
              {
                label: "Nexitally",
                value: "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/customized/nexitally.ini"
              },
              {
                label: "SoCloud",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/socloud.ini"
              },
              {
                label: "ARK",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/ark.ini"
              },
              {
                label: "N3RO",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/n3ro_optimized.ini"
              },
              {
                label: "Scholar",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/scholar_optimized.ini"
              },
              {
                label: "Flowercloud",
                value: "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/customized/flower.ini"
              }
            ]
          },
          {
            label: "特殊",
            options: [
              {
                label: "NeteaseUnblock",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/special/netease.ini"
              },
              {
                label: "Basic",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/special/basic.ini"
              }
            ]
          }
        ]
      },
      form: {
        sourceSubUrl: "",
        clientType: "",
        customBackend: this.getUrlParam() === "" ? defaultBackend : this.getUrlParam(),
        shortType: "https://short.8dy.xx.kg/short",
        customSlug: "",
        remoteConfig: "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online.ini",
        excludeRemarks: "",
        includeRemarks: "",
        filename: "",
        rename: "",
        devid: "",
        interval: "",
        emoji: true,
        nodeList: false,
        extraset: false,
        tls13: false,
        udp: false,
        xudp: false,
        tfo: false,
        sort: false,
        expand: true,
        scv: false,
        fdn: false,
        appendType: false,
        insert: false, // 是否插入默认订阅的节点，对应配置项 insert_url
        new_name: true, // 是否使用 Clash 新字段
        tpl: {
          surge: {
            doh: false // dns 查询是否使用 DoH
          },
          clash: {
            doh: false
          },
          singbox: {
            ipv6: false
          }
        }
      },
      disabledOptions: {
        emoji: false,
        insert: false,
        udp: false,
        xudp: false,
        tfo: false,
        sort: false,
        expand: false,
        new_name: false,
        scv: false,
        fdn: false,
        appendType: false,
        clash_doh: false,
        surge_doh: false,
        singbox_ipv6: false,
        tls13: false
      },
      loadingShortUrl: false,
      loadingUpload: false,
      loadingLoad: false,
      loadingReverse: false,
      loadingSync: false,
      customSubUrl: "",
      customShortSubUrl: "",
      customSlugHistory: [], // 存储历史定制后缀
      dialogUploadConfigVisible: false,
      loadConfig: "",
      dialogLoadConfigVisible: false,
      uploadFilter: "",
      uploadScript: "",
      uploadConfig: "",
      filterConfig: filterConfigSample,
      scriptConfig: scriptConfigSample,
      sampleConfig: remoteConfigSample
    };
  },
  computed: {
    showRemoteConfig() {
      const client = this.form.clientType;
      if (client === 'auto') return true; // 自动模式下显示
      // 需要远程配置的客户端关键字
      const configSupport = ['clash', 'surge', 'quan', 'loon', 'mellow', 'surfboard', 'singbox'];
      return configSupport.some(c => client.includes(c));
    }
  },
  watch: {
    'form.sourceSubUrl'() {
      // 当订阅链接输入框内容发生变化时，清空相关的缓存
      this.customSubUrl = '';
      this.customShortSubUrl = '';
    },
    'form.clientType'() {
      // 当客户端类型变化时，也应该清空缓存
      this.customSubUrl = '';
      this.customShortSubUrl = '';
      this.updateOptionsBasedOnClient();
    },
    'form.customBackend'() {
      // 当后端地址变化时，也应该清空缓存
      this.customSubUrl = '';
      this.customShortSubUrl = '';
    },
    'form.remoteConfig'() {
      // 当远程配置变化时，清空缓存，防止用户使用旧配置生成的链接
      this.customSubUrl = '';
      this.customShortSubUrl = '';
    }
  },
  created() {
    document.title = "在线订阅转换工具";
    this.isPC = this.$getOS().isPc;
  },
  mounted() {
    this.form.clientType = "clash";
    this.getBackendVersion();
    this.initTheme();
    // 加载历史记录
    this.loadCustomSlugHistory();
    let lightMedia = window.matchMedia('(prefers-color-scheme: light)');
    let darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
    let callback = (e) => {
      if (e.matches) {
        this.initTheme();
      }
    };
    if (typeof darkMedia.addEventListener === 'function' || typeof lightMedia.addEventListener === 'function') {
      lightMedia.addEventListener('change', callback);
      darkMedia.addEventListener('change', callback);
    } //监听系统主题，自动切换！
  },
  methods: {
    updateOptionsBasedOnClient() {
      const client = this.form.clientType;

      // 1. 重置所有选项为默认推荐配置
      this.form.emoji = true;
      this.form.insert = true;
      this.form.udp = true;
      this.form.xudp = false;
      this.form.tfo = false;
      this.form.sort = false;
      this.form.tls13 = false;
      this.form.scv = false;
      this.form.fdn = true;
      this.form.appendType = false;

      // 2. 重置所有禁用状态
      Object.keys(this.disabledOptions).forEach(key => {
        this.disabledOptions[key] = false;
      });

      // 3. 根据客户端类型应用特定逻辑
      if (client.includes('clash')) {
        // Clash 系
        this.form.new_name = true;
        this.form.expand = true;
        this.form.tpl.clash.doh = false;

        this.disabledOptions.surge_doh = true;
        this.disabledOptions.singbox_ipv6 = true;
      } else if (client.includes('surge')) {
        // Surge 系
        this.form.expand = true;
        this.form.tpl.surge.doh = false;

        this.disabledOptions.new_name = true;
        this.disabledOptions.clash_doh = true;
        this.disabledOptions.singbox_ipv6 = true;
      } else if (client.includes('singbox')) {
        // Sing-Box
        this.form.expand = true;
        this.form.tpl.singbox.ipv6 = false;

        this.disabledOptions.new_name = true;
        this.disabledOptions.clash_doh = true;
        this.disabledOptions.surge_doh = true;
        this.disabledOptions.singbox_ipv6 = true;
      } else if (client.includes('quanx') || client.includes('loon') || client.includes('surfboard') || client.includes('mellow')) {
        // 其他支持规则集的客户端
        this.form.expand = true;

        this.disabledOptions.new_name = true;
        this.disabledOptions.clash_doh = true;
        this.disabledOptions.surge_doh = true;
        this.disabledOptions.singbox_ipv6 = true;
      } else {
        // 纯节点列表 (SS, V2Ray, Mixed, etc)
        this.form.expand = false;
        this.disabledOptions.expand = true; // 纯节点列表不支持展开规则

        this.disabledOptions.new_name = true;
        this.disabledOptions.clash_doh = true;
        this.disabledOptions.surge_doh = true;
        this.disabledOptions.singbox_ipv6 = true;
      }
    },
    selectChanged() {
      this.getBackendVersion();
    },
    getBackendVersion() {
      this.$axios
        .get(
          this.form.customBackend.indexOf("http") !== -1
            ? this.form.customBackend.replace(/\/$/, "") + "/version"
            : defaultBackend.replace(/\/$/, "") + "/version"
        )
        .then(res => {
          this.backendVersion = res.data.replace(/backend\n$/gm, "");
          this.backendVersion = this.backendVersion.replace("subconverter", "SubConverter");
        })
        .catch(() => {
          this.$message.error("请求SubConverter版本号返回数据失败，该后端不可用！");
        });
    },
    getUrlParam() {
      let query = window.location.search.substring(1);
      let vars = query.split('&');
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (pair[0] === "backend") {
          return decodeURIComponent(pair[1]);
        }
      }
      return "";
    },
    initTheme() {
      const getLocalTheme = window.localStorage.getItem("localTheme");
      const lightMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)');
      const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

      if (getLocalTheme) {
        document.getElementsByTagName('body')[0].className = getLocalTheme;
      } else {
        // 默认逻辑：优先系统主题，其次时间判断
        if (darkMode && darkMode.matches) {
          document.getElementsByTagName('body')[0].setAttribute('class', 'dark-mode');
        } else if (lightMode && lightMode.matches) {
          document.getElementsByTagName('body')[0].setAttribute('class', 'light-mode');
        } else {
          // 兜底：根据时间判断
          if (new Date().getHours() >= 19 || new Date().getHours() < 7) {
            document.getElementsByTagName('body')[0].setAttribute('class', 'dark-mode');
          } else {
            document.getElementsByTagName('body')[0].setAttribute('class', 'light-mode');
          }
        }
      }
    },
    toggleTheme() {
      const zhuti = document.getElementsByTagName('body')[0].className;
      if (zhuti === 'light-mode') {
        document.getElementsByTagName('body')[0].setAttribute('class', 'dark-mode');
        window.localStorage.setItem('localTheme', 'dark-mode');
      }
      if (zhuti === 'dark-mode') {
        document.getElementsByTagName('body')[0].setAttribute('class', 'light-mode');
        window.localStorage.setItem('localTheme', 'light-mode');
      }
    },

    copyText(text) {
      if (!text) {
        this.$message.warning("内容为空");
        return;
      }
      this.$copyText(text).then(() => {
        this.$message.success("已复制");
      }, () => {
        this.$message.error("复制失败，请手动复制");
      });
    },
    openLink(url) {
      if (url) {
        window.open(url, '_blank');
      }
    },
    loadCustomSlugHistory() {
      try {
        const history = localStorage.getItem('customSlugHistory');
        if (history) {
          this.customSlugHistory = JSON.parse(history);
        } else {
          this.customSlugHistory = [];
        }
      } catch (e) {
        console.error('加载历史记录失败:', e);
        this.customSlugHistory = [];
      }
    },
    saveCustomSlugToHistory(slug) {
      if (!slug || typeof slug !== 'string') return;

      // 移除重复项
      this.customSlugHistory = this.customSlugHistory.filter(item => item !== slug);

      // 添加到开头
      this.customSlugHistory.unshift(slug);

      // 限制历史记录数量为100条
      if (this.customSlugHistory.length > 100) {
        this.customSlugHistory = this.customSlugHistory.slice(0, 100);
      }

      // 保存到本地存储
      try {
        localStorage.setItem('customSlugHistory', JSON.stringify(this.customSlugHistory));
      } catch (e) {
        console.error('保存历史记录失败:', e);
      }
    },
    goToProject() {
      window.open(project);
    },
    gotoTgChannel() {
      window.open(tgBotLink);
    },
    gotoYouTuBe() {
      window.open(yglink);
    },
    toolsDown() {
      // 下载链接暂未配置
      this.$message.warning("下载链接未配置");
    },
    gotoBasicVideo() {
      this.$alert("别忘了关注友善的肥羊哦！", {
        type: "warning",
        confirmButtonText: '确定',
        customClass: 'msgbox',
        showClose: false,
      })
        .then(() => {
          window.open(basicVideo);
        });
    },
    gotoAdvancedVideo() {
      this.$alert("别忘了关注友善的肥羊哦！", {
        type: "warning",
        confirmButtonText: '确定',
        customClass: 'msgbox',
        showClose: false,
      })
        .then(() => {
          window.open(advancedVideo);
        });
    },
    processUrlForProxy(url, proxyUrl) {
      if (!url.startsWith('http')) return url;

      try {
        const urlObj = new URL(url);
        const isIpAddress = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/.test(urlObj.hostname);
        const parts = urlObj.hostname.split('.');
        const isPrivateIP = isIpAddress && (
          parts[0] === '10' ||
          (parts[0] === '172' && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31) ||
          (parts[0] === '192' && parts[1] === '168') ||
          urlObj.hostname === 'localhost' ||
          urlObj.hostname.startsWith('127.') ||
          urlObj.hostname.startsWith('internal.')
        );

        const isKnownDirectDomain = urlObj.hostname.endsWith('.hf.space') ||
                                  urlObj.hostname.endsWith('.github.com') ||
                                  urlObj.hostname.endsWith('.github.io') ||
                                  urlObj.hostname.includes('raw.githubusercontent.com') ||
                                  urlObj.hostname.includes('jsdelivr.net');

        const likelyUsesCdn = urlObj.hostname.includes('pages.dev') ||
                            urlObj.hostname.includes('vercel.app') ||
                            urlObj.hostname.includes('workers.dev') ||
                            urlObj.hostname.includes('trycloudflare.com') ||
                            urlObj.hostname.includes('netlify.app') ||
                            urlObj.hostname.includes('firebaseapp.com');

        if (isKnownDirectDomain) {
          return url;
        } else if (likelyUsesCdn) {
          return proxyUrl + encodeURIComponent(url);
        } else if (!isPrivateIP && !url.startsWith(proxyUrl)) {
          // IP地址也需要走代理，因为后端服务器无法直接访问
          return proxyUrl + encodeURIComponent(url);
        }
      } catch (e) {
        console.error('URL 解析错误:', e);
        if (!url.startsWith(proxyUrl)) {
          return proxyUrl + encodeURIComponent(url);
        }
      }
      return url;
    },
    makeUrl() {
      if (this.form.sourceSubUrl === "" || this.form.clientType === "") {
        this.$message.error("订阅链接与客户端为必填项");
        return false;
      }
      let backend =
        this.form.customBackend === ""
          ? defaultBackend
          : this.form.customBackend;
      const currentOrigin = window.location.origin;
      const proxyUrl = `${currentOrigin}/api/proxy?url=`;
      const uniqueUrls = new Set();

      let sourceSub = this.form.sourceSubUrl.replace(/[\r\n]+/g, "|");
      sourceSub = sourceSub.split('|').filter(url => {
        if (!url || url.trim() === '') return false;
        if (uniqueUrls.has(url)) return false;
        uniqueUrls.add(url);
        return true;
      }).map(url => this.processUrlForProxy(url, proxyUrl)).join('|');

      const params = new URLSearchParams();
      params.append("target", this.form.clientType);
      params.append("url", sourceSub);
      params.append("insert", this.form.insert);

      if (this.form.remoteConfig) params.append("config", this.form.remoteConfig);
      if (this.form.excludeRemarks) params.append("exclude", this.form.excludeRemarks);
      if (this.form.includeRemarks) params.append("include", this.form.includeRemarks);
      if (this.form.filename) params.append("filename", this.form.filename);
      if (this.form.rename) params.append("rename", this.form.rename);
      
      if (this.form.interval !== "") {
        params.append("interval", this.form.interval * 86400);
      }
      
      if (this.form.devid) params.append("dev_id", this.form.devid);
      if (this.form.appendType) params.append("append_type", this.form.appendType);
      if (this.form.tls13) params.append("tls13", this.form.tls13);
      if (this.form.sort) params.append("sort", this.form.sort);
      
      params.append("emoji", this.form.emoji);
      params.append("list", this.form.nodeList);
      params.append("xudp", this.form.xudp);
      params.append("udp", this.form.udp);
      params.append("tfo", this.form.tfo);
      params.append("expand", this.form.expand);
      params.append("scv", this.form.scv);
      params.append("fdn", this.form.fdn);

      if (this.form.clientType.includes("surge")) {
        if (this.form.tpl.surge.doh) params.append("surge.doh", "true");
      }
      if (this.form.clientType === "clash") {
        if (this.form.tpl.clash.doh) params.append("clash.doh", "true");
        params.append("new_name", this.form.new_name);
      }
      if (this.form.clientType === "singbox") {
        if (this.form.tpl.singbox.ipv6) params.append("singbox.ipv6", "1");
      }

      this.customSubUrl = `${backend}/sub?${params.toString()}`;
      this.$copyText(this.customSubUrl);
      this.$message.success("定制订阅已复制到剪贴板");
    },
    parseCustomUrlWithoutProxy(longUrl) {
      try {
        const url = new URL(longUrl);
        const params = new URLSearchParams(url.search);
        const encodedSource = params.get('url');
        if (encodedSource) {
          const decodedSource = decodeURIComponent(encodedSource);
          // 如果是代理 URL，需要提取原始 URL
          let result = decodedSource.split('|').join('\n');
          // 移除代理前缀，获取原始 URL
          const proxyPrefix = window.location.origin + '/api/proxy?url=';
          result = result.split('\n').map(part => {
            if (part.startsWith(proxyPrefix)) {
              // 解码并返回原始 URL
              return decodeURIComponent(part.substring(proxyPrefix.length));
            }
            return part;
          }).join('\n');
          return result;
        }
        return "无法解析原始订阅";
      } catch (e) {
        return "无效的长链接格式";
      }
    },
    makeShortUrl() {
      const self = this;

      // 如果定制订阅URL为空，先生成订阅链接
      if (!self.customSubUrl || self.customSubUrl.trim() === '') {
        // 先执行 makeUrl，然后再执行短链接生成
        this.makeUrl();
        // 然后延迟执行短链接生成
        setTimeout(() => {
          this.executeShortUrlGeneration();
        }, 500); // 延迟 500 毫秒等待 makeUrl 完成
        return;
      }

      // 如果已有定制订阅URL，直接执行短链接生成
      this.executeShortUrlGeneration();
    },

    executeShortUrlGeneration() {
      const self = this;
      const slug = self.form.customSlug.trim();

      const shortenerRequest = (currentSlug, overwrite = false) => {
        self.loadingShortUrl = true;

        if (self.form.shortType.includes("short.8dy.xx.kg")) {
          const createEndpoint = self.form.shortType; // 直接使用完整 URL

          let requestBody = {
            "url": self.customSubUrl, // 使用代理后的 URL，因为这是用户最终使用的链接
            "overwrite": overwrite
          };

          if (currentSlug) {
            requestBody["slug"] = currentSlug;
          }

          self.$axios
            .post(createEndpoint, requestBody, {
              headers: { "Content-Type": "application/json" }
            })
            .then(res => {
              if (res.data && res.data.Code === 1 && (res.data.ShortUrl || res.data.link)) { // 符合 short.8dy.xx.kg API 格式，支持 ShortUrl 或 link 字段
                // 优先使用 link 字段，如果不存在则使用 ShortUrl 字段
                const shortUrl = res.data.link || res.data.ShortUrl;
                self.customShortSubUrl = shortUrl;
                self.$copyText(shortUrl);
                self.$message.success("短链接已复制到剪贴板");
                // 仅当用户输入了自定义后缀时才保存到历史记录
                if (currentSlug) {
                  self.saveCustomSlugToHistory(currentSlug);
                }
              } else if (res.data && res.data.Code === 0 && res.data.Message) {
                // API 返回错误信息
                self.$message.error("短链接生成失败：" + res.data.Message);
                self.loadingShortUrl = false;
              } else {
                throw new Error("API返回格式不正确或无链接");
              }
            })
            .catch(error => {
              if (error.response && error.response.status === 409) {
                const existingUrl = error.response.data?.existingUrl || '';

                if (existingUrl === self.customSubUrl) {
                  // 尝试构建短链，注意这里假设短链格式
                  // 如果 API 返回了 link 最好，如果没有，只能尝试拼接
                  // 既然是冲突，说明 slug 已知
                  const shortenerBaseUrl = self.form.shortType.replace("/short", "");
                  const existingShortLink = `${shortenerBaseUrl}/${currentSlug}`;

                  self.customShortSubUrl = existingShortLink;
                  self.$copyText(existingShortLink);
                  self.$message.success("后缀已存在，已自动使用现有短链接");
                  self.loadingShortUrl = false;
                  // 仅当用户输入了自定义后缀时才保存到历史记录
                  if (currentSlug) {
                    self.saveCustomSlugToHistory(currentSlug);
                  }
                  return;
                }

                // 解析 URL 时，移除代理前缀以进行公平比较
                const existingSourceSubsWithoutProxy = self.parseCustomUrlWithoutProxy(existingUrl);
                const currentSourceSubsWithoutProxy = self.parseCustomUrlWithoutProxy(self.customSubUrl);

                let message = `该定制后缀已被占用，但指向不同的订阅内容。<br/>
                              <strong>已存在的订阅:</strong><div class="url-compare">${existingSourceSubsWithoutProxy}</div>
                              <strong>当前的订阅:</strong><div class="url-compare">${currentSourceSubsWithoutProxy}</div>
                              是否覆盖它？`;

                self.$confirm(message, '短链接后缀冲突', {
                  confirmButtonText: '覆盖',
                  cancelButtonText: '取消',
                  type: 'warning',
                  dangerouslyUseHTMLString: true,
                  customClass: 'long-url-confirm-box'
                }).then(() => {
                  shortenerRequest(currentSlug, true);
                }).catch(() => {
                  self.$message({ type: 'info', message: '已取消操作' });
                  self.loadingShortUrl = false;
                });
              } else {
                console.error("短链接获取失败:", error);
                // 优先检查 Message (API标准)，其次 check message (通用)，最后 fallback
                const errorMsg = error.response?.data?.Message || error.response?.data?.message || error.message || "未知错误";
                self.$message.error("短链接获取失败：" + errorMsg);
                self.loadingShortUrl = false;
              }
            })
            .finally(() => {
              if (self.loadingShortUrl) {
                self.loadingShortUrl = false;
              }
            });
        }
        else {
          const duan = self.form.shortType;
          let data = new FormData();
          data.append("longUrl", btoa(self.customSubUrl)); // 使用代理后的 URL，因为这是用户最终使用的链接
          if (currentSlug) {
            data.append("shortKey", currentSlug);
          }
          self.$axios
            .post(duan, data, {
              headers: { "Content-Type": "application/form-data; charset=utf-8" }
            })
            .then(res => {
              if (res.data.Code === 1 && res.data.ShortUrl !== "") {
                self.customShortSubUrl = res.data.ShortUrl;
                self.$copyText(res.data.ShortUrl);
                self.$message.success("短链接已复制到剪贴板");
                // 仅当用户输入了自定义后缀时才保存到历史记录
                if (currentSlug) {
                  self.saveCustomSlugToHistory(currentSlug);
                }
              } else {
                if (currentSlug) {
                  self.$message.error("自定义后缀 '" + currentSlug + "' 已被占用，请尝试其他后缀");
                  self.loadingShortUrl = false;
                } else {
                  self.$message.error("短链接获取失败：" + res.data.Message);
                }
              }
            })
            .catch(() => {
              self.$message.error("短链接获取失败");
            })
            .finally(() => {
              self.loadingShortUrl = false;
            });
        }
      };

      shortenerRequest(slug);
    },

    async syncHistory() {
      let shortenerBaseUrl = this.form.shortType;
      // 移除结尾的 /short
      if (shortenerBaseUrl.endsWith('/short')) {
        shortenerBaseUrl = shortenerBaseUrl.slice(0, -6);
      }
      const listUrl = `${shortenerBaseUrl}/list`;

      this.loadingSync = true;

      try {
        const res = await this.$axios.get(listUrl);
        if (res.data && res.data.Code === 1 && Array.isArray(res.data.Data)) {
          const remoteSlugs = res.data.Data.map(item => item.slug);
          // 合并本地和远程历史，并去重
          const newHistory = [...new Set([...remoteSlugs, ...this.customSlugHistory])];
          this.customSlugHistory = newHistory.slice(0, 100); // 限制保留最近100条
          localStorage.setItem('customSlugHistory', JSON.stringify(this.customSlugHistory));
          this.$message.success('历史记录同步成功，已更新下拉列表');
        } else {
          this.$message.warning('同步失败：服务端未返回有效列表');
        }
      } catch (e) {
        this.$message.error('同步失败，该短链服务可能不支持列表获取');
      } finally {
        this.loadingSync = false;
      }
    },

    async reverseLookup() {
      const slug = this.form.customSlug;

      if (!slug || slug.trim() === '') {
        this.$message.error('请输入要反查的定制后缀');
        return;
      }

      this.loadingReverse = true;

      // 1. 确定 Query API 地址
      let shortenerBaseUrl = this.form.shortType;
      // 移除结尾的 /short
      if (shortenerBaseUrl.endsWith('/short')) {
        shortenerBaseUrl = shortenerBaseUrl.slice(0, -6);
      }

      const queryUrl = `${shortenerBaseUrl}/query`;

      try {
        const response = await this.$axios.post(queryUrl, {
            slug: slug
        }, {
            headers: { "Content-Type": "application/json" }
        });

        if (response.data && response.data.Code === 1 && response.data.LongUrl) {
            const longUrl = response.data.LongUrl;
            const shortLink = `${shortenerBaseUrl}/${slug}`;

            // 解析参数，这会触发 watch 清空 customSubUrl 和 customShortSubUrl
            try {
                const urlObj = new URL(longUrl);
                this.parseUrlParams(urlObj);
            } catch (e) {
                console.error('解析长链接失败:', e);
                this.$message.warning('反查成功，但解析长链接参数失败');
                // 即使解析失败，至少把长链接填进去
                this.form.sourceSubUrl = longUrl;
            }

            // 在解析完成后，重新填充长/短链接
            // 使用 $nextTick 确保在 watch 执行之后再赋值
            this.$nextTick(() => {
                this.customShortSubUrl = shortLink;
                this.customSubUrl = longUrl;
                this.$message.success('反查成功，已填充到对应位置');
            });

        } else {
            this.$message.error('反查失败：' + (response.data.Message || '未找到该后缀对应的链接'));
        }
      } catch (error) {
        console.error('反查请求失败:', error);
        // 优先检查 Message (API标准)，其次 check message (通用)
        const errorMsg = error.response?.data?.Message || error.response?.data?.message || '反查请求失败，请检查网络或短链服务是否支持反查';
        this.$message.error(errorMsg);
      } finally {
        this.loadingReverse = false;
      }
    },

    confirmUploadConfig() {
      this.loadingUpload = true;
      let data = new FormData();
      data.append("config", encodeURIComponent(this.uploadConfig));
      this.$axios
        .post(configUploadBackend, data, {
          header: {
            "Content-Type": "application/form-data; charset=utf-8"
          }
        })
        .then(res => {
          if (res.data.code === 0 && res.data.data !== "") {
            this.$message.success(
              "远程配置上传成功，配置链接已复制到剪贴板"
            );
            this.form.remoteConfig = res.data.data;
            this.$copyText(this.form.remoteConfig);
            this.dialogUploadConfigVisible = false;
          } else {
            this.$message.error("远程配置上传失败: " + res.data.msg);
          }
        })
        .catch(() => {
          this.$message.error("远程配置上传失败");
        })
        .finally(() => {
          this.loadingUpload = false;
        });
    },
    analyzeUrl() {
      if (this.loadConfig.indexOf("target") !== -1) {
        return this.loadConfig;
      } else {
        this.loadingLoad = true;
        return (async () => {
          try {
            let response = await fetch(this.loadConfig, {
              method: "GET",
              redirect: "follow",
            });
            return response.url;
          } catch (e) {
            this.$message.error("解析短链接失败，请检查短链接服务端是否配置跨域：" + e)
          } finally {
            this.loadingLoad = false;
          }
        })();
      }
    },
    parseUrlParams(url) {
      this.form.customBackend = url.origin
      let param = new URLSearchParams(url.search);
      if (param.get("target")) {
        let target = param.get("target");
        if (target === 'surge' && param.get("ver")) {
          // 类型为surge,有ver
          this.form.clientType = target + "&ver=" + param.get("ver");
        } else if (target === 'surge') {
          //类型为surge,没有ver
          this.form.clientType = target + "&ver=4"
        } else {
          //类型为其他
          this.form.clientType = target;
        }
      }
      if (param.get("url")) {
        let source = param.get("url");
        try {
            // 尝试解码，应对可能的双重编码
            source = decodeURIComponent(source);
        } catch(e) {
            // 解码失败则使用原值
        }

        // 处理代理前缀
        // 代理前缀通常是 /api/proxy?url=
        // 我们需要移除它，并解码后面的内容
        const proxyKeyword = '/api/proxy?url=';

        source = source.split('|').map(u => {
            const index = u.indexOf(proxyKeyword);
            if (index !== -1) {
                // 提取参数部分
                let realUrl = u.substring(index + proxyKeyword.length);
                // 尝试解码
                try {
                    realUrl = decodeURIComponent(realUrl);
                } catch (e) {}
                return realUrl;
            }
            return u;
        }).join('\n');

        this.form.sourceSubUrl = source;
      }
      if (param.get("insert")) {
        this.form.insert = param.get("insert") === 'true';
      }
      if (param.get("config")) {
        this.form.remoteConfig = param.get("config");
      }
      if (param.get("exclude")) {
        this.form.excludeRemarks = param.get("exclude");
      }
      if (param.get("include")) {
        this.form.includeRemarks = param.get("include");
      }
      if (param.get("filename")) {
        this.form.filename = param.get("filename");
      }
      if (param.get("rename")) {
        this.form.rename = param.get("rename");
      }
      if (param.get("interval")) {
        this.form.interval = Math.ceil(param.get("interval") / 86400);
      }
      if (param.get("dev_id")) {
        this.form.devid = param.get("dev_id");
      }
      if (param.get("append_type")) {
        this.form.appendType = param.get("append_type") === 'true';
      }
      if (param.get("tls13")) {
        this.form.tls13 = param.get("tls13");
      }
      if (param.get("xudp")) {
        this.form.xudp = param.get("xudp") === 'true';
      }
      if (param.get("sort")) {
        this.form.sort = param.get("sort") === 'true';
      }
      if (param.get("emoji")) {
        this.form.emoji = param.get("emoji") === 'true';
      }
      if (param.get("list")) {
        this.form.nodeList = param.get("list") === 'true';
      }
      if (param.get("udp")) {
        this.form.udp = param.get("udp") === 'true';
      }
      if (param.get("tfo")) {
        this.form.tfo = param.get("tfo") === 'true';
      }
      if (param.get("expand")) {
        this.form.expand = param.get("expand") === 'true';
      }
      if (param.get("scv")) {
        this.form.scv = param.get("scv") === 'true';
      }
      if (param.get("fdn")) {
        this.form.fdn = param.get("fdn") === 'true';
      }
      if (param.get("surge.doh")) {
        this.form.tpl.surge.doh = param.get("surge.doh") === 'true';
      }
      if (param.get("clash.doh")) {
        this.form.tpl.clash.doh = param.get("clash.doh") === 'true';
      }
      if (param.get("new_name")) {
        this.form.new_name = param.get("new_name") === 'true';
      }
      if (param.get("singbox.ipv6")) {
        this.form.tpl.singbox.ipv6 = param.get("singbox.ipv6") === '1';
      }
    },
    confirmLoadConfig() {
      if (this.loadConfig.trim() === "" || !this.loadConfig.trim().includes("http")) {
        this.$message.error("待解析的订阅链接不合法");
        return false;
      }
      (async () => {
        let url
        try {
          url = new URL(await this.analyzeUrl())
        } catch (error) {
          this.$message.error("请输入正确的订阅地址!");
          return;
        }
        this.parseUrlParams(url);
        this.dialogLoadConfigVisible = false;
        this.$message.success("长/短链接已成功解析为订阅信息");
      })();
    },
    renderPost() {
      let data = new FormData();
      data.append("target", encodeURIComponent(this.form.clientType));
      data.append("url", encodeURIComponent(this.form.sourceSubUrl));
      data.append("config", encodeURIComponent(this.form.remoteConfig));
      data.append("exclude", encodeURIComponent(this.form.excludeRemarks));
      data.append("include", encodeURIComponent(this.form.includeRemarks));
      data.append("rename", encodeURIComponent(this.form.rename));
      data.append("tls13", encodeURIComponent(this.form.tls13.toString()));
      data.append("xudp", encodeURIComponent(this.form.xudp.toString()));
      data.append("emoji", encodeURIComponent(this.form.emoji.toString()));
      data.append("list", encodeURIComponent(this.form.nodeList.toString()));
      data.append("udp", encodeURIComponent(this.form.udp.toString()));
      data.append("tfo", encodeURIComponent(this.form.tfo.toString()));
      data.append("expand", encodeURIComponent(this.form.expand.toString()));
      data.append("scv", encodeURIComponent(this.form.scv.toString()));
      data.append("fdn", encodeURIComponent(this.form.fdn.toString()));
      data.append("sdoh", encodeURIComponent(this.form.tpl.surge.doh.toString()));
      data.append("cdoh", encodeURIComponent(this.form.tpl.clash.doh.toString()));
      data.append("newname", encodeURIComponent(this.form.new_name.toString()));
      return data;
    },
    confirmUploadScript() {
      if (this.form.sourceSubUrl.trim() === "") {
        this.$message.error("订阅链接不能为空");
        return false;
      }
      this.loadingUpload = true;
      let data = this.renderPost();
      data.append("sortscript", encodeURIComponent(this.uploadScript));
      data.append("filterscript", encodeURIComponent(this.uploadFilter));
      this.$axios
        .post(configScriptBackend, data, {
          header: {
            "Content-Type": "application/form-data; charset=utf-8"
          }
        })
        .then(res => {
          if (res.data.code === 0 && res.data.data !== "") {
            this.$message.success(
              "自定义JS上传成功，订阅链接已复制到剪贴板（IOS设备和Safari浏览器不支持自动复制API，需手动点击复制按钮）"
            );
            this.customSubUrl = res.data.data;
            this.$copyText(res.data.data);
            this.dialogUploadConfigVisible = false;
            this.btnBoolean = true;
          } else {
            this.$message.error("自定义JS上传失败: " + res.data.msg);
          }
        })
        .catch(() => {
          this.$message.error("自定义JS上传失败");
        })
        .finally(() => {
          this.loadingUpload = false;
        })
    },
  }
}
</script>

<style>
/* ================================================= */
/* 1. Element UI 全局样式覆盖 (Global Overrides) */
/* ================================================= */

/* 卡片样式调整 */
.el-card__header {
  padding: 5px 20px !important;
}

.el-card__body {
  padding-bottom: 5px !important;
}

/* 调整表单项间距 */
.el-form-item--small,
.el-form-item--mini {
  margin-bottom: 1px !important;
}

.el-form-item {
  margin-bottom: 2px !important;
}

/* 调整输入框左右内边距 */
.el-input__inner,
.el-textarea__inner {
  padding-left: 10px !important;
  padding-right: 10px !important;
}

/* 折叠面板 (Collapse) 样式覆盖 - 用于高级功能 */
.el-collapse {
  border-top: none;
  border-bottom: none;
  margin-bottom: 0;
}

.el-collapse-item__header {
  height: 35px;
  line-height: 35px;
  border-bottom: none;
}

.el-collapse-item__wrap {
  border-bottom: none;
}

.el-collapse-item__header .el-form-item__label {
  line-height: 35px;
}

.el-collapse-item__header .el-form-item__content {
  line-height: 35px !important;
  margin-left: 0 !important;
}

/* ================================================= */
/* 2. 页面特定组件样式 (Component Styles) */
/* ================================================= */

/* 订阅链接区域 */
.subscription-tip {
  font-size: 12px;
  color: #999;
  margin-left: 85px;
  margin-bottom: 0;
  white-space: nowrap;
}

.subscription-link-row {
  margin-top: 0 !important;
  margin-bottom: 2px !important;
}

.subscription-link-row .el-form-item__label {
  line-height: 5px !important;
}

.subscription-link-row .el-textarea__inner {
  white-space: pre !important;
  overflow-x: auto !important;
}

/* 高级功能区域 */
.advanced-item {
  margin-bottom: 0 !important;
}

/* 分割线样式 (注意顺序：通用样式在前，特定样式在后以覆盖) */
.el-divider--horizontal {
  margin-top: -8px !important;
  margin-bottom: 0 !important;
}

.theme-toggle-divider {
  margin-top: 5px !important;
  margin-bottom: 15px !important;
}

/* 主题切换按钮 */
.el-button--theme {
  position: relative;
  width: 54px !important;
  height: 20px !important;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-button--theme .el-icon-sunny,
.el-button--theme .el-icon-moon {
  position: static;
  margin: 0;
  display: inline-block;
  flex-shrink: 0;
}

#rijian, #yejian {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0 !important;
}

/* ================================================= */
/* 3. 弹窗与对话框样式 (Dialogs & Modals) */
/* ================================================= */

/* 长链接确认框 */
.long-url-confirm-box {
  width: 800px !important;
  max-width: 90% !important;
}

.long-url-confirm-box .el-message-box__content {
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 500px;
  overflow-y: auto;
}

/* URL 对比区域 */
.url-compare {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
}

.dark-mode .url-compare {
  background-color: #2a2a2a;
  border-color: #444;
}

/* ================================================= */
/* 4. 通用辅助样式 (Utilities) */
/* ================================================= */

.link-prepend {
  text-decoration: none;
}

.link-actions {
  margin-top: 2px;
  text-align: right;
}
</style>