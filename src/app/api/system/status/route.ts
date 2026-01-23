import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as os from 'os'

const execAsync = promisify(exec)

// 获取CPU使用率（通过两次采样计算真实使用率）
async function getCpuUsage(): Promise<number> {
  try {
    // 在Linux系统上使用更准确的方法获取CPU使用率
    if (process.platform === 'linux') {
      try {
        // 方法1: 使用vmstat获取CPU使用率
        const { stdout } = await execAsync("vmstat 1 2 | tail -1 | awk '{print 100-$15}'")
        const cpuUsage = parseFloat(stdout.trim())
        if (!isNaN(cpuUsage) && cpuUsage >= 0 && cpuUsage <= 100) {
          return Math.round(cpuUsage)
        }
      } catch {
        // 如果vmstat失败，尝试使用top命令
        try {
          const { stdout } = await execAsync("top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'")
          const cpuUsage = parseFloat(stdout.trim())
          if (!isNaN(cpuUsage) && cpuUsage >= 0 && cpuUsage <= 100) {
            return Math.round(cpuUsage)
          }
        } catch {
          // 继续使用Node.js方法
        }
      }
    }
    
    // 使用Node.js内置方法：通过两次采样计算CPU使用率
    const cpus1 = os.cpus()
    await new Promise(resolve => setTimeout(resolve, 1000)) // 等待1秒
    const cpus2 = os.cpus()
    
    let totalUsage = 0
    let cpuCount = 0
    
    for (let i = 0; i < cpus1.length; i++) {
      const cpu1 = cpus1[i]
      const cpu2 = cpus2[i]
      
      const total1 = Object.values(cpu1.times).reduce((a, b) => a + b, 0)
      const total2 = Object.values(cpu2.times).reduce((a, b) => a + b, 0)
      
      const idle1 = cpu1.times.idle
      const idle2 = cpu2.times.idle
      
      const totalDiff = total2 - total1
      const idleDiff = idle2 - idle1
      
      if (totalDiff > 0) {
        const usage = 100 - (idleDiff / totalDiff) * 100
        totalUsage += Math.max(0, Math.min(100, usage))
        cpuCount++
      }
    }
    
    return cpuCount > 0 ? Math.round(totalUsage / cpuCount) : 0
  } catch {
    return 0
  }
}

// 获取内存使用率
function getMemoryUsage(): number {
  try {
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const usage = (usedMem / totalMem) * 100
    
    return Math.min(100, Math.max(0, Math.round(usage)))
  } catch {
    return 0
  }
}

// 获取磁盘使用率
async function getDiskUsage(): Promise<number> {
  try {
    if (process.platform === 'linux' || process.platform === 'darwin') {
      const { stdout } = await execAsync("df / | tail -1 | awk '{print $5}' | sed 's/%//'")
      const diskUsage = parseInt(stdout.trim())
      return isNaN(diskUsage) ? 0 : Math.min(100, Math.max(0, diskUsage))
    }
    
    // Windows系统的磁盘使用率获取
    if (process.platform === 'win32') {
      try {
        const { stdout } = await execAsync('wmic logicaldisk where "DeviceID=\'C:\'" get Size,FreeSpace /format:value')
        const lines = stdout.split('\n')
        let size = 0
        let freeSpace = 0
        
        lines.forEach(line => {
          if (line.startsWith('Size=')) {
            size = parseInt(line.split('=')[1].trim())
          }
          if (line.startsWith('FreeSpace=')) {
            freeSpace = parseInt(line.split('=')[1].trim())
          }
        })
        
        if (size > 0) {
          const usage = ((size - freeSpace) / size) * 100
          return Math.min(100, Math.max(0, Math.round(usage)))
        }
      } catch {
        // 如果wmic失败，尝试使用PowerShell
        try {
          const { stdout } = await execAsync('powershell "Get-PSDrive C | Select-Object -ExpandProperty Used,Free | ForEach-Object { $used = $_[0]; $free = $_[1]; [math]::Round((($used / ($used + $free)) * 100), 2) }"')
          const diskUsage = parseFloat(stdout.trim())
          return isNaN(diskUsage) ? 0 : Math.min(100, Math.max(0, Math.round(diskUsage)))
        } catch {
          return 0
        }
      }
    }
    
    return 0
  } catch {
    return 0
  }
}

export async function GET() {
  try {
    const [cpuUsage, memoryUsage, diskUsage] = await Promise.all([
      getCpuUsage(),
      Promise.resolve(getMemoryUsage()),
      getDiskUsage()
    ])

    return NextResponse.json({
      success: true,
      data: {
        cpu: cpuUsage,
        memory: memoryUsage,
        disk: diskUsage,
        timestamp: new Date().toISOString(),
        platform: process.platform,
        uptime: os.uptime()
      }
    })
  } catch {
    // 如果所有方法都失败，返回0值而不是随机值
    return NextResponse.json({
      success: true,
      data: {
        cpu: 0,
        memory: 0,
        disk: 0,
        timestamp: new Date().toISOString(),
        platform: process.platform,
        uptime: os.uptime()
      }
    })
  }
} 