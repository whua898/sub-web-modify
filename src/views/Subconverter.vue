<template>
  <div>
    <el-row style="margin-top: 10px">
      <el-col>
        <el-card>
          <div slot="header" style="position: relative;">
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
                    <template slot="title">
                      <el-form-item label="高级功能:" style="width: 100%; margin-bottom: 0;">
                        <el-button type="text" style="width: 100%; font-size: 15px; text-align: center; padding-right: 80px;">点击显示/隐藏
                        </el-button>
                      </el-form-item>
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
                      <el-input v-model="form.devid" placeholder="用于设置QuantumultX的远程设备ID" :disabled="form.clientType !== 'quanx'" />
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
                              <el-checkbox v-model="form.tpl.clash.doh" label="Clash.DoH" :disabled="!form.clientType.includes('clash')"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.insert" label="插入默认节点"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.udp" label="启用 UDP"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.xudp" label="启用 XUDP" :disabled="!form.clientType.includes('clash') && !form.clientType.includes('singbox') && !form.clientType.includes('v2ray')"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.tfo" label="启用 TFO"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.sort" label="基础节点排序"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.tpl.clash.doh" label="Clash.DoH"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.appendType" label="插入节点类型"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.tpl.surge.doh" label="Surge.DoH" :disabled="!form.clientType.includes('surge')"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.tls13" label="开启TLS_1.3"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.expand" label="展开规则全文"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.new_name" label="Clash新字段名" :disabled="!form.clientType.includes('clash')"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.scv" label="跳过证书验证"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.fdn" label="过滤不支持节点"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.tpl.singbox.ipv6" label="Sing-Box支持IPV6" :disabled="!form.clientType.includes('singbox')"></el-checkbox>
                            </el-col>

                          </el-row>
                          <el-button slot="reference">更多选项</el-button>
                        </el-popover>
                      </el-row>
                    </el-form-item>
                  </el-collapse-item>
                </el-collapse>
              </el-form-item>
              <el-divider class="theme-toggle-divider" content-position="center">
                <el-button type="zhuti" @click="change">
                  <i id="rijian" class="el-icon-sunny"></i>
                  <i id="yejian" class="el-icon-moon"></i>
                </el-button>
              </el-divider>
              <el-form-item label="定制订阅:">
                <el-input class="copy-content" disabled v-model="customSubUrl">
                  <el-button slot="append" v-clipboard:copy="customSubUrl" v-clipboard:success="onCopy" ref="copy-btn"
                    icon="el-icon-document-copy">复制
                  </el-button>
                  <el-button slot="prepend" @click="openLink(customSubUrl)" icon="el-icon-link" v-if="customSubUrl">访问</el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="订阅短链:">
                <el-input class="copy-content" v-model="customShortSubUrl" style="position: relative;">
                  <div slot="suffix" style="color: #999; font-size: 12px; display: flex; align-items: center; height: 100%; pointer-events: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    输入自定义短链接后缀，点击生成短链接可反复生成
                  </div>
                  <el-button slot="append" v-clipboard:copy="customShortSubUrl" v-clipboard:success="onCopy"
                    ref="copy-btn" icon="el-icon-document-copy">复制
                  </el-button>
                  <el-button slot="prepend" @click="openLink(customShortSubUrl)" icon="el-icon-link" v-if="customShortSubUrl">访问</el-button>
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
                <el-button type="primary" @click="reverseLookup" :loading="loadingReverse" style="margin-left: 10px;">反查</el-button>
              </el-form-item>
              <el-form-item label-width="0px" style="margin-top: 5px; text-align: center">
                <el-button style="width: 120px" type="danger" @click="makeUrl"
                  :disabled="form.sourceSubUrl.length === 0 || btnBoolean">生成订阅链接
                </el-button>
                <el-button style="width: 120px" type="danger" @click="makeShortUrl" :loading="loading1"
                  :disabled="customSubUrl.length === 0">生成短链接
                </el-button>
              </el-form-item>
              <el-form-item label-width="0px" style="text-align: center">
                <el-button style="width: 120px" type="primary" @click="dialogUploadConfigVisible = true"
                  icon="el-icon-upload" :loading="loading2">自定义配置
                </el-button>
                <el-button style="width: 120px" type="primary" @click="dialogLoadConfigVisible = true"
                  icon="el-icon-copy-document" :loading="loading3">从URL解析
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
      <div label-width="0px" style="text-align: center">
        <el-button style="width: 200px;" type="primary" icon="el-icon-video-play"
          @click="gotoBasicVideo(); centerDialogVisible = false">基础视频教程
        </el-button>
      </div>
      <div label-width="0px" style="text-align: center;margin: 3vh 0 2vh">
        <el-button style="width: 200px;" type="danger" icon="el-icon-video-play"
          @click="gotoAdvancedVideo(); centerDialogVisible = false">进阶视频教程
        </el-button>
      </div>
      <div label-width="0px" style="text-align: center;margin: 3vh 0 2vh">
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
      <div slot="title">
        可以从生成的长/短链接中解析信息,填入页面中去
      </div>
      <el-form label-position="left">
        <el-form-item prop="uploadConfig">
          <el-input v-model="loadConfig" type="textarea" :autosize="{ minRows: 15, maxRows: 15 }" maxlength="5000"
            show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="loadConfig = ''; dialogLoadConfigVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmLoadConfig" :disabled="loadConfig.length === 0">确 定
        </el-button>
      </div>
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
const bzlink = process.env.VUE_APP_BILIBILI_LINK
import { clientTypes, shortTypes, customBackend, remoteConfig } from '@/consts/subconverterOptions';

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
        clientTypes: clientTypes,
        shortTypes: shortTypes,
        customBackend: customBackend,
        remoteConfig: remoteConfig
      },
      form: {
        sourceSubUrl: "",
        clientType: "",
        customBackend: this.getUrlParam() == "" ? defaultBackend : this.getUrlParam(),
        shortType: "https://short.wh8.xx.kg/short",
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
        udp: true,
        xudp: false,
        tfo: false,
        sort: false,
        expand: true,
        scv: false,
        fdn: true,
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
      loading1: false,
      loading2: false,
      loading3: false,
      loadingReverse: false,
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
    },
    'form.customBackend'() {
      // 当后端地址变化时，也应该清空缓存
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
    this.anhei();
    // 加载历史记录
    this.loadCustomSlugHistory();
    let lightMedia = window.matchMedia('(prefers-color-scheme: light)');
    let darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
    let callback = (e) => {
      if (e.matches) {
        this.anhei();
      }
    };
    if (typeof darkMedia.addEventListener === 'function' || typeof lightMedia.addEventListener === 'function') {
      lightMedia.addEventListener('change', callback);
      darkMedia.addEventListener('change', callback);
    } //监听系统主题，自动切换！
  },
  methods: {
    selectChanged() {
      this.getBackendVersion();
    },
    getBackendVersion() {
      const url =
        this.form.customBackend.indexOf("http") !== -1
          ? this.form.customBackend.replace(/\/$/, "") + "/version"
          : defaultBackend.replace(/\/$/, "") + "/version";

      const handleSuccess = (res) => {
        this.backendVersion = res.data.replace(/backend\n$/gm, "");
        this.backendVersion = this.backendVersion.replace("subconverter", "SubConverter");
      };

      this.$axios
        .get(url)
        .then(handleSuccess)
        .catch(() => {
          // 失败后延迟 1 秒重试一次
          setTimeout(() => {
            this.$axios
              .get(url)
              .then(handleSuccess)
              .catch(() => {
                this.$message.error("请求SubConverter版本号返回数据失败，该后端不可用！");
              });
          }, 1000);
        });
    },
    getUrlParam() {
      let query = window.location.search.substring(1);
      let vars = query.split('&');
      for (let i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == "backend") {
          return decodeURIComponent(pair[1]);
        }
      }
      return "";
    },
    anhei() {
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
    change() {
      var zhuti = document.getElementsByTagName('body')[0].className;
      if (zhuti === 'light-mode') {
        document.getElementsByTagName('body')[0].setAttribute('class', 'dark-mode');
        window.localStorage.setItem('localTheme', 'dark-mode');
      }
      if (zhuti === 'dark-mode') {
        document.getElementsByTagName('body')[0].setAttribute('class', 'light-mode');
        window.localStorage.setItem('localTheme', 'light-mode');
      }
    },

    onCopy() {
      this.$message.success("已复制");
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
    gotoBiliBili() {
      window.open(bzlink);
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
    getProxiedUrl(url) {
      const proxyUrl = `${window.location.origin}/api/proxy?url=`;
      if (!url.startsWith('http')) return url;

      try {
        const urlObj = new URL(url);
        // 检测是否为 IP 地址形式的域名
        const isIpAddress = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/.test(urlObj.hostname);

        // 检查是否为私有 IP 地址段或本地地址
        const parts = urlObj.hostname.split('.');
        const isPrivateIP = isIpAddress && (
          parts[0] === '10' ||
          parts[0] === '172' && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31 ||
          parts[0] === '192' && parts[1] === '168' ||
          urlObj.hostname === 'localhost' ||
          urlObj.hostname.startsWith('127.') ||
          urlObj.hostname.startsWith('internal.')
        );

        // 检查是否为无需代理的常见域名
        const isKnownDirectDomain = urlObj.hostname.endsWith('.hf.space') ||
          urlObj.hostname.endsWith('.github.com') ||
          urlObj.hostname.endsWith('.github.io') ||
          urlObj.hostname.includes('raw.githubusercontent.com') ||
          urlObj.hostname.includes('jsdelivr.net');

        // 检查是否为已知的第三方托管平台域名
        const likelyUsesCdn = urlObj.hostname.includes('pages.dev') ||
          urlObj.hostname.includes('vercel.app') ||
          urlObj.hostname.includes('workers.dev') ||
          urlObj.hostname.includes('trycloudflare.com') ||
          urlObj.hostname.includes('netlify.app') ||
          urlObj.hostname.includes('firebaseapp.com');

        if (isKnownDirectDomain) return url;
        if (likelyUsesCdn) return proxyUrl + encodeURIComponent(url);
        if (!isIpAddress && !isPrivateIP && !url.startsWith(proxyUrl)) {
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
      let sourceSub = this.form.sourceSubUrl;
      sourceSub = sourceSub.replace(/(\n|\r|\n\r)/g, "|");

      sourceSub = sourceSub.split('|').map(url => this.getProxiedUrl(url)).join('|');

      this.customSubUrl =
        backend +
        "/sub?target=" +
        this.form.clientType +
        "&url=" +
        encodeURIComponent(sourceSub) +
        "&insert=" +
        this.form.insert;
      if (this.form.remoteConfig !== "") {
        this.customSubUrl +=
          "&config=" + encodeURIComponent(this.form.remoteConfig);
      }
      if (this.form.excludeRemarks !== "") {
        this.customSubUrl +=
          "&exclude=" + encodeURIComponent(this.form.excludeRemarks);
      }
      if (this.form.includeRemarks !== "") {
        this.customSubUrl +=
          "&include=" + encodeURIComponent(this.form.includeRemarks);
      }
      if (this.form.filename !== "") {
        this.customSubUrl +=
          "&filename=" + encodeURIComponent(this.form.filename);
      }
      if (this.form.rename !== "") {
        this.customSubUrl +=
          "&rename=" + encodeURIComponent(this.form.rename);
      }
      if (this.form.interval !== "") {
        this.customSubUrl +=
          "&interval=" + encodeURIComponent(this.form.interval * 86400);
      }
      if (this.form.devid !== "") {
        this.customSubUrl +=
          "&dev_id=" + encodeURIComponent(this.form.devid);
      }
      if (this.form.appendType) {
        this.customSubUrl +=
          "&append_type=" + this.form.appendType.toString();
      }
      if (this.form.tls13) {
        this.customSubUrl +=
          "&tls13=" + this.form.tls13.toString();
      }
      if (this.form.sort) {
        this.customSubUrl +=
          "&sort=" + this.form.sort.toString();
      }
      this.customSubUrl +=
        "&emoji=" +
        this.form.emoji.toString() +
        "&list=" +
        this.form.nodeList.toString() +
        "&xudp=" +
        this.form.xudp.toString() +
        "&udp=" +
        this.form.udp.toString() +
        "&tfo=" +
        this.form.tfo.toString() +
        "&expand=" +
        this.form.expand.toString() +
        "&scv=" +
        this.form.scv.toString() +
        "&fdn=" +
        this.form.fdn.toString();
      if (this.form.clientType.includes("surge")) {
        if (this.form.tpl.surge.doh === true) {
          this.customSubUrl += "&surge.doh=true";
        }
      }
      if (this.form.clientType === "clash") {
        if (this.form.tpl.clash.doh === true) {
          this.customSubUrl += "&clash.doh=true";
        }
        this.customSubUrl += "&new_name=" + this.form.new_name.toString();
      }
      if (this.form.clientType === "singbox") {
        if (this.form.tpl.singbox.ipv6 === true) {
          this.customSubUrl += "&singbox.ipv6=1";
        }
      }
      this.$copyText(this.customSubUrl);
      this.$message.success("定制订阅已复制到剪贴板");
    },
    parseCustomUrl(longUrl) {
      try {
        const url = new URL(longUrl);
        const params = new URLSearchParams(url.search);
        const encodedSource = params.get('url');
        if (encodedSource) {
          const decodedSource = decodeURIComponent(encodedSource);
          return decodedSource.split('|').join('\n');
        }
        return "无法解析原始订阅";
      } catch (e) {
        return "无效的长链接格式";
      }
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
        self.loading1 = true;

        // 创建一个函数来移除代理前缀，获取原始 URL
        const removeProxyPrefix = (url) => {
          const proxyPrefix = window.location.origin + '/api/proxy?url=';
          if (url.startsWith(proxyPrefix)) {
            return decodeURIComponent(url.substring(proxyPrefix.length));
          }
          return url;
        };

        // 提取原始 URL，去除代理前缀
        let originalUrl = self.customSubUrl;
        // 处理 | 分隔的多个 URL
        if (originalUrl.includes('|')) {
          const urls = originalUrl.split('|').map(u => removeProxyPrefix(u)).join('|');
          originalUrl = urls;
        } else {
          originalUrl = removeProxyPrefix(originalUrl);
        }

        if (self.form.shortType.includes("short.wh8.xx.kg")) {
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
              const resData = res.data;
              if (resData && (resData.ShortUrl || resData.link)) { // 兼容 API 返回格式，只要有 ShortUrl 或 link 即视为成功
                // 优先使用 link 字段，如果不存在则使用 ShortUrl 字段
                const shortUrl = resData.link || resData.ShortUrl;
                self.customShortSubUrl = shortUrl;
                self.$copyText(shortUrl);
                self.$message.success("短链接已复制到剪贴板");
                // 仅当用户输入了自定义后缀时才保存到历史记录
                if (currentSlug) {
                  self.saveCustomSlugToHistory(currentSlug);
                }
              } else if (resData && resData.Code === 0 && resData.Message) {
                // API 返回错误信息
                self.$message.error("短链接生成失败：" + resData.Message);
                self.loading1 = false;
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
                  self.loading1 = false;
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
                  self.loading1 = false;
                });
              } else {
                console.error("短链接获取失败:", error);
                self.$message.error("短链接获取失败：" + (error.response?.data?.message || error.message || "未知错误"));
                self.loading1 = false;
              }
            })
            .finally(() => {
              if (self.loading1) {
                self.loading1 = false;
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
                  self.loading1 = false;
                } else {
                  self.$message.error("短链接获取失败：" + res.data.Message);
                }
              }
            })
            .catch(() => {
              self.$message.error("短链接获取失败");
            })
            .finally(() => {
              self.loading1 = false;
            });
        }
      };

      shortenerRequest(slug);
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
        // 定义重试逻辑
        const fetchWithRetry = async (retryCount = 0) => {
          try {
            return await this.$axios.post(queryUrl, {
              slug: slug
            }, {
              headers: { "Content-Type": "application/json" }
            });
          } catch (error) {
            if (retryCount < 1) { // 失败后重试 1 次
              await new Promise(resolve => setTimeout(resolve, 1000));
              return fetchWithRetry(retryCount + 1);
            }
            throw error;
          }
        };

        const response = await fetchWithRetry();
        const resData = response.data;

        if (resData && (resData.LongUrl || (resData.Code === 1 && resData.LongUrl))) {
            const longUrl = resData.LongUrl;
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
            this.$message.error('反查失败：' + (resData.Message || '未找到该后缀对应的链接'));
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.$message.error('短链不存在');
        } else {
          console.error('反查请求失败:', error);
          this.$message.error('反查请求失败，请检查网络或短链服务是否支持反查');
        }
      } finally {
        this.loadingReverse = false;
      }
    },

    confirmUploadConfig() {
      this.loading2 = true;
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
          this.loading2 = false;
        });
    },
    analyzeUrl() {
      if (this.loadConfig.indexOf("target") !== -1) {
        return this.loadConfig;
      } else {
        this.loading3 = true;
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
            this.loading3 = false;
          }
        })();
      }
    },
    parseUrlParams(url) {
      this.form.customBackend = url.origin
      let param = new URLSearchParams(url.search);
      
      // 1. 处理客户端类型 (Target)
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

      // 2. 处理源订阅链接 (URL)
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

      // 3. 映射普通参数
      const map = {
        insert: { key: 'insert', type: 'boolean' },
        config: { key: 'remoteConfig' },
        exclude: { key: 'excludeRemarks' },
        include: { key: 'includeRemarks' },
        filename: { key: 'filename' },
        rename: { key: 'rename' },
        dev_id: { key: 'devid' },
        append_type: { key: 'appendType', type: 'boolean' },
        tls13: { key: 'tls13', type: 'boolean' },
        xudp: { key: 'xudp', type: 'boolean' },
        sort: { key: 'sort', type: 'boolean' },
        emoji: { key: 'emoji', type: 'boolean' },
        list: { key: 'nodeList', type: 'boolean' },
        udp: { key: 'udp', type: 'boolean' },
        tfo: { key: 'tfo', type: 'boolean' },
        expand: { key: 'expand', type: 'boolean' },
        scv: { key: 'scv', type: 'boolean' },
        fdn: { key: 'fdn', type: 'boolean' },
        new_name: { key: 'new_name', type: 'boolean' }
      };

      for (const [paramName, config] of Object.entries(map)) {
        if (param.has(paramName)) {
          const val = param.get(paramName);
          this.form[config.key] = config.type === 'boolean' ? val === 'true' : val;
        }
      }

      // 4. 处理特殊参数
      if (param.get("interval")) {
        this.form.interval = Math.ceil(param.get("interval") / 86400);
      }
      if (param.get("surge.doh")) {
        this.form.tpl.surge.doh = param.get("surge.doh") === 'true';
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
      this.loading2 = true;
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
          this.loading2 = false;
        })
    },
  }
}
</script>

<style>
/* ================================================= */
/* 1. Element UI 全局样式覆盖                        */
/* ================================================= */

/* 调整 el-card 头部内边距，使其更紧凑 */
.el-card__header {
  padding: 5px 20px !important;
}

/* 调整 el-card 主体内容内边距，控制底部空白 */
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

/* ================================================= */
/* 2. 订阅链接区域样式                               */
/* ================================================= */

/* 提示信息：对齐标签，紧贴输入框 */
.subscription-tip {
  font-size: 12px;
  color: #999;
  margin-left: 85px; /* 80px label-width + 5px padding */
  margin-bottom: 0px;
  white-space: nowrap;
}

/* 订阅链接行：移除顶部间距以紧贴提示 */
.subscription-link-row {
  margin-top: 0 !important;
  margin-bottom: 2px !important;
}

/* 调整订阅链接行的标签行高，使其对齐 */
.subscription-link-row .el-form-item__label {
  line-height: 5px !important;
}

/* 订阅链接文本域：不自动换行，显示横向滚动条 */
.subscription-link-row .el-textarea__inner {
  white-space: pre !important;
  overflow-x: auto !important;
}

/* ================================================= */
/* 3. 高级功能折叠面板样式                           */
/* ================================================= */

/* 高级功能外层容器间距 */
.advanced-item {
  margin-bottom: 0px !important;
}

/* 移除 collapse 组件自带的边框和间距 */
.el-collapse {
  border-top: none;
  border-bottom: none;
  margin-bottom: 0;
}

/* 调整折叠面板头部高度和边框 */
.el-collapse-item__header {
  height: 35px;
  line-height: 35px;
  border-bottom: none;
}

/* 调整折叠面板内容区域边框 */
.el-collapse-item__wrap {
  border-bottom: none;
}

/* 确保折叠面板头部的表单项使用 Flex 布局，保证标签和按钮在同一行 */
.el-collapse-item__header .el-form-item {
  display: flex;
  align-items: center;
}

/* 调整折叠面板头部内的表单项标签行高，使其垂直居中 */
.el-collapse-item__header .el-form-item__label {
  line-height: 35px;
}

/* 修复高级功能标题内容区对齐问题 */
.el-collapse-item__header .el-form-item__content {
  line-height: 35px !important;
  margin-left: 0 !important;
  flex: 1;
}

/* ================================================= */
/* 4. 主题切换组件样式                               */
/* ================================================= */

/* 主题切换分割线：调整与上下组件的间距 */
.theme-toggle-divider {
  margin-top: 5px !important;
  margin-bottom: 15px !important;
}

/* 主题切换按钮容器 */
.el-button--zhuti {
  position: relative;
  width: 54px !important;
  height: 20px !important;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 按钮内的图标样式 */
.el-button--zhuti .el-icon-sunny,
.el-button--zhuti .el-icon-moon {
  position: static;
  margin: 0;
  display: inline-block;
  flex-shrink: 0;
}

/* 使两个图标绝对定位重叠，通过 JS 控制显示隐藏 */
#rijian, #yejian {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0 !important;
}

/* ================================================= */
/* 5. 弹窗与确认框样式                               */
/* ================================================= */

/* 长链接确认框宽度调整 */
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

/* URL 对比区域样式 */
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

/* 暗色模式下的 URL 对比区域 */
.dark-mode .url-compare {
  background-color: #2a2a2a;
  border-color: #444;
}

/* ================================================= */
/* 6. 其他辅助样式                                   */
/* ================================================= */

.link-prepend {
  text-decoration: none;
}

.link-actions {
  margin-top: 2px;
  text-align: right;
}
</style>