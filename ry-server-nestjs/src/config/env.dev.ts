export default {
  /**
   * 单数据库连接配置
   */
  db: {
    host: 'localhost', // 数据库ip地址
    port: 3306, // 端口
    username: 'root', // 登录名
    password: 'root', // 密码
    database: 'nest_ry_admin' // 数据库名称
  },

  /**
   * 单redis库连接配置
   */
  redisConfig: {
    port: 6389,
    host: '121.41.167.223',
    password: 'cs_redis_zha_2021',
    db: 9
  },

  /**
   * Jwt密钥
   */
  jwtSecret: 'axd5f49ectybudfshj',
  jwtExpiresIn: '1d', // 默认jwt的过期时间 d天 h时 m分 s秒
  wechatjwtExpiresIn: '1d', // 微信小程序jwt的过期时间
  refreshTokenExpiresIn: '30d', // 小程序刷新token过期时间

  /**
   * 小程序appid和密钥(个人测试号)
   */
  wxAPPID: 'wxf6f194c4bbdd7dec',
  wxAPPSecret: 'e0ef969a27ce707e6699a4e95ad38f19',

  /**
   * aes密钥-仅用于公开接口校验的(因为前端有该密钥)，其他内部使用可以弄个新的key
   */
  AESKey: 'PoZ5QhZr8uNVII0q', // 16位数

  /**
   * ras加密公钥和私钥
   */
  RSAPublicKey: `-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt5EdYP/BIrYoak7wcdLB
  ELK08wyJOY8BUWHNAwDxjgh+SyllRiYawaBtRQ2nNf7l3vlVm6uvCeIIOxo8yrNj
  YdJUFt63gg/YxoWYGjV1q2d8ss2dg7Jw/Bkmyj5WDBvh8DaiWMhWqfraKkoPWx7b
  H6+K25cqZevmuojldSm7YE4J4Z/bFkM9T/xBOfPEozP3gM8tx8U6cfhjH4rz4sDm
  fbRQWVy0AWvNe6UMcodU/nixTtiinE8ZRPmew12ApFEENPKGt2AuUwmJMlWLH9Ec
  MtJ2FWGtW8CF0xGfDPiuCCsozLLIQn4WU2WyDmk1x5LcklotxEXBRrKOvoEyUlgd
  kQIDAQAB
  -----END PUBLIC KEY-----`,
  RSAPrivateKey: `-----BEGIN PRIVATE KEY-----
   MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3kR1g/8Eitihq
   TvBx0sEQsrTzDIk5jwFRYc0DAPGOCH5LKWVGJhrBoG1FDac1/uXe+VWbq68J4gg7
   GjzKs2Nh0lQW3reCD9jGhZgaNXWrZ3yyzZ2DsnD8GSbKPlYMG+HwNqJYyFap+toq
   Sg9bHtsfr4rblypl6+a6iOV1KbtgTgnhn9sWQz1P/EE588SjM/eAzy3HxTpx+GMf
   ivPiwOZ9tFBZXLQBa817pQxyh1T+eLFO2KKcTxlE+Z7DXYCkUQQ08oa3YC5TCYky
   VYsf0Rwy0nYVYa1bwIXTEZ8M+K4IKyjMsshCfhZTZbIOaTXHktySWi3ERcFGso6+
   gTJSWB2RAgMBAAECggEAIqUnx1PdzsBUdmP5q3HccFtaHXkjORLNa9+qgsOd03G0
   7FievZOZfyvZE6xU/7LhDak/SAcqHRJk/UqhaJxcyGya5EoalliJUEaMg33NfJEm
   jtSRwvZdrqbMlGUZdmWYye51y43cFW672DlsFoWHU76c1X79SIkyXchSjj9XFwCx
   X2Hx2RK3tSMzv8lyzOHdzAOgpIbh/iEQqUMEFGoZqa4ffRD0vXH98nRNB5s+GPL/
   RzUkHDQudiEXcc+aBp+D+V8SCNbzX1eBtmMiwyTNoD6BxW1edvYc2PLoHMu5S/oF
   gg74awxNMfslrdVf2vQ1kMT1pb7P6z0HizQKoe6iZQKBgQDtgYEB6EQ/jSaEi2p5
   DvyJHh5n8oCCSo6W35wtcYWIY0AFZ+ByAtK8ekaBM6xkDMSLhyGGFF2GoGrFZTk6
   CWrwgR85352VUo57r9TbuT7zOn+/EoKldLbs2L+tugkWF43O558Tmbk6nmlrkxnl
   IiQne+vlIKPJqSr06oaN1AGKrwKBgQDF3GDN+3aVHtrvLrVI4avWU+zCb4L3Apzs
   bTlmsITxiCxI4/C+dRfeRJvBXq5y7/vg2u8cVm48uTkHIW/NW6NGk+jrhyAUyLR8
   TXBfdqQGtzU4swpUvkX5cd7YjlGXaHFxZ6TSkN6u1IqIPHPEylq5X1B+BcnguTkk
   uFt3UA3rvwKBgQDcS6bRkhLbr5zujDIyH4h11o31dKVmNKmVn8tJC2cEXqrfWL6C
   gcPeNrx20usv0ffsQ2cA6prlaJ4gggdWoa2jbuD72UJdYrnuV+Vj+Ks/CB+9pvmv
   ZlbV0SXZihkreKV8KLMQhyGcEZtOwJ7gPY6zYOopGOFTB6pkibRMkTzs2QKBgQDE
   vmloCScWCtNqyIgtC3GCMnuXr6iLlAaUNdvBF79qKJzYcge+atKsCo7STiKrWaSd
   JzZieDMvoIJra70vd3K4yHTwVrH42MZXX+1gj6l0oBKE6ctZDsanzqnnrkTFiG5d
   dND5LGKxd9i0tV/si8aA051HYtwl4ChJMiSJVIozIwKBgC67i82xARw6fQGZRQJ5
   5yFhtagsOCpNl5Dl4l72pXbcU1FHsLk0+0WoXfQBmU6aSUdTvQ5Bw3OxWgi8dTo8
   Oboh5gKXacc+q9hqPFhOWEbezEOlrri7wdESpXh2oU4nixTX07FXh0mCPi84Ffg3
   +Y/sT0cQsYOAeDdFZtWpeUSh
   -----END PRIVATE KEY-----`
}
