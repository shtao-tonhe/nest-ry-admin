<template>
  <div class="app-container" v-loading="loading">
    <el-row>
      <el-col :span="24" class="card-box">
        <el-card>
          <template #header>
            <span style="vertical-align: middle">基本信息</span>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">Redis版本</div></td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="cache && cache.redis_version">{{
                      cache.redis_version || '-'
                    }}</div>
                  </td>
                  <td class="el-table__cell is-leaf"><div class="cell">运行模式</div></td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="cache && cache.redis_mode">{{
                      cache.redis_mode == 'standalone' ? '单机' : '集群'
                    }}</div>
                  </td>
                  <td class="el-table__cell is-leaf"><div class="cell">端口</div></td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="cache && cache.tcp_port">{{
                      cache.tcp_port || '-'
                    }}</div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">客户端数</div></td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="cache && cache.connected_clients">{{
                      cache.connected_clients || '-'
                    }}</div>
                  </td>
                  <td class="el-table__cell is-leaf"><div class="cell">运行时间(天)</div></td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="cache && cache.uptime_in_days">{{
                      cache.uptime_in_days || '-'
                    }}</div></td
                  >
                  <td class="el-table__cell is-leaf"><div class="cell">运行环境</div></td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="cache && cache.os">{{ cache.os || '-' }}</div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">AOF是否开启</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="cache && cache.aof_enabled">{{
                      cache.aof_enabled == '0' ? '否' : '是'
                    }}</div></td
                  >
                  <td class="el-table__cell is-leaf"><div class="cell">RDB是否成功</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="cache && cache.rdb_last_bgsave_status">{{
                      cache.rdb_last_bgsave_status
                    }}</div></td
                  >
                  <td class="el-table__cell is-leaf"><div class="cell">使用CPU</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="cache && cache.used_cpu_user_children">{{
                      parseFloat(cache.used_cpu_user_children).toFixed(2)
                    }}</div></td
                  >
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="cache.dbSize">{{ cache.dbSize }} </div></td
                  >
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">网络入口/出口</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="cache && cache.instantaneous_input_kbps"
                      >{{ cache.instantaneous_input_kbps }}kps/{{
                        cache.instantaneous_output_kbps
                      }}kps</div
                    ></td
                  >
                  <td class="el-table__cell is-leaf"><div class="cell">系统架构</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="cache && cache.arch_bits">{{
                      cache.arch_bits
                    }}</div></td
                  >
                  <td class="el-table__cell is-leaf"><div class="cell">当前的qps</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="cache && cache.instantaneous_ops_per_sec">{{
                      cache.instantaneous_ops_per_sec
                    }}</div></td
                  >
                </tr>
              </tbody>
            </table>
            <el-row>
              <div class="flex">
                <div class="w-[120px] h-[40px] pl-[12px] pr-[12px] leading-[40px]">Key数量</div>
                <div class="el-table__cell is-leaf" v-if="cache && cache.db">
                  <p class="mt-0">key的数量,以及带有生存期的key的数,平均存活时间</p>
                  <p class="mt-0" v-for="(item, index) in cache.db" :key="item"
                    >{{ 'db' + index + '：' + item['db' + index] }}
                  </p>
                </div>
              </div>
            </el-row>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <template #header> <span style="vertical-align: middle">命令统计</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <table cellspacing="0" style="width: 100%">
                <thead>
                  <tr>
                    <th class="el-table__cell is-leaf"><div class="cell">命令名称</div></th>
                    <th class="el-table__cell is-leaf"><div class="cell">统计内容</div></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="el-table__cell is-leaf"
                      ><div class="cell w-120px">Set命令统计</div></td
                    >
                    <td class="el-table__cell is-leaf" v-if="cache && cache.cmdstat_set">
                      <el-tooltip :content="cache.cmdstat_set">
                        <div>{{ cache.cmdstat_set }}</div>
                      </el-tooltip>
                    </td>
                  </tr>
                  <tr>
                    <td class="el-table__cell is-leaf"
                      ><div class="cell w-120px">Del命令统计</div></td
                    >
                    <td class="el-table__cell is-leaf" v-if="cache && cache.cmdstat_del">
                      <el-tooltip :content="cache.cmdstat_del">
                        <div>{{ cache.cmdstat_del }}</div>
                      </el-tooltip>
                    </td>
                  </tr>
                  <tr>
                    <td class="el-table__cell is-leaf"
                      ><div class="cell w-120px">Client命令统计</div></td
                    >
                    <td class="el-table__cell is-leaf" v-if="cache && cache.cmdstat_client">
                      <el-tooltip :content="cache.cmdstat_client">
                        <div>{{ cache.cmdstat_client }}</div>
                      </el-tooltip>
                    </td>
                  </tr>
                  <tr>
                    <td class="el-table__cell is-leaf"
                      ><div class="cell w-120px">Expire命令统计</div></td
                    >
                    <td class="el-table__cell is-leaf" v-if="cache && cache.cmdstat_expire">
                      <el-tooltip :content="cache.cmdstat_expire">
                        <div>{{ cache.cmdstat_expire }}</div>
                      </el-tooltip>
                    </td>
                  </tr>
                  <tr>
                    <td class="el-table__cell is-leaf"
                      ><div class="cell w-130px">Get命令统计</div></td
                    >
                    <td class="el-table__cell is-leaf" v-if="cache && cache.cmdstat_get">
                      <el-tooltip :content="cache.cmdstat_get">
                        <div>{{ cache.cmdstat_get }}</div>
                      </el-tooltip>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <template #header> <span style="vertical-align: middle">内存信息</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <table cellspacing="0" style="width: 100%">
                <thead>
                  <tr>
                    <th class="el-table__cell is-leaf"><div class="cell">描述</div></th>
                    <th class="el-table__cell is-leaf"><div class="cell">内容</div></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="el-table__cell is-leaf"
                      ><div class="cell w-120px">系统总内存</div></td
                    >
                    <td
                      class="el-table__cell is-leaf"
                      v-if="cache && cache.total_system_memory_human"
                    >
                      <div>{{ cache.total_system_memory_human }}</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="el-table__cell is-leaf"
                      ><div class="cell w-120px">最大内存配置</div></td
                    >
                    <td class="el-table__cell is-leaf" v-if="cache && cache.maxmemory_human">
                      <div>{{ cache.maxmemory_human }}</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="el-table__cell is-leaf"><div class="cell w-120px">使用内存</div></td>
                    <td class="el-table__cell is-leaf" v-if="cache && cache.used_memory_human">
                      <div>{{ cache.used_memory_human }}</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="el-table__cell is-leaf"
                      ><div class="cell w-120px">内存消耗峰值</div></td
                    >
                    <td class="el-table__cell is-leaf" v-if="cache && cache.used_memory_peak_human">
                      <div>{{ cache.used_memory_peak_human }}</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="el-table__cell is-leaf"
                      ><div class="cell w-120px">常驻集大小</div></td
                    >
                    <td class="el-table__cell is-leaf" v-if="cache && cache.used_memory_rss_human">
                      <div>{{ cache.used_memory_rss_human }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { getCache } from '@/api/monitor/cache'
const cache: any = ref([])
const loading = ref(false)

function getList() {
  loading.value = true
  getCache().then((response: any) => {
    cache.value = response.data
    loading.value = false
  })
}

onBeforeMount(() => {
  getList()
})
</script>
