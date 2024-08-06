<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" class="card-box">
        <el-card>
          <template #header>
            <span style="vertical-align: middle">服务器信息</span>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">服务器名称</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="server && server.sys">{{
                      server.sys.computerName
                    }}</div></td
                  >
                  <td class="el-table__cell is-leaf"><div class="cell">操作系统</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="server && server.sys">{{ server.sys.osName }}</div></td
                  >
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">服务器IP</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="server && server.sys">{{
                      server.sys.computerIp
                    }}</div></td
                  >
                  <td class="el-table__cell is-leaf"><div class="cell">系统架构</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="server && server.sys">{{ server.sys.osArch }}</div></td
                  >
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <template #header>
            <span style="vertical-align: middle">CPU</span>
            <span v-if="server && server.cpu"
              >（处理器 {{ server.cpu.model }} / {{ server.cpu.speed / 1000 }}GHZ）</span
            >
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="el-table__cell is-leaf"><div class="cell">属性</div></th>
                  <th class="el-table__cell is-leaf"><div class="cell">值</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">cpu核心数</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="server && server.cpu">{{ server.cpu.num }}</div></td
                  >
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">cpu使用率</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="server && server.cpu">{{ server.cpu.usage }}%</div></td
                  >
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">cpu空闲率</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="server && server.cpu"
                      >{{ 100 - server.cpu.usage }}%</div
                    ></td
                  >
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <template #header> <span style="vertical-align: middle">内存</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="el-table__cell is-leaf"><div class="cell">属性</div></th>
                  <th class="el-table__cell is-leaf"><div class="cell">内存</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">总内存</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="server && server.mem">{{ server.mem.total }}G</div></td
                  >
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">剩余内存</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div class="cell" v-if="server && server.mem">{{ server.mem.used }}G</div></td
                  >
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">使用率</div></td>
                  <td class="el-table__cell is-leaf"
                    ><div
                      class="cell"
                      v-if="server && server.mem"
                      :class="{ 'text-danger': server.mem.usage > 80 }"
                      >{{
                        (((server.mem.total - server.mem.used) / server.mem.total) * 100).toFixed(
                          2
                        )
                      }}%</div
                    ></td
                  >
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { getServer } from '@/api/monitor/server'

const server = ref()
const { proxy } = getCurrentInstance() as any

function getList() {
  proxy.$modal.loading('正在加载服务监控数据，请稍候！')
  getServer().then((response) => {
    server.value = response.data
    proxy.$modal.closeLoading()
  })
}

getList()
</script>
