# WeChat Bot

![](https://assets.fedtop.com/picbed/202212071317377.png)

一个 基于 `chatgpt` + `wechaty` 的微信机器人



## 运行问题


1. 不少人今天运行不了，参考这条 [issue](https://github.com/wangrongding/wechat-bot/issues/54#issuecomment-1347880291) ,暂时这样处理下，有好的方案大家可以提出来，谢谢~



2. `OpenAI Chatgpt` 因为一些原因，对接口访问添加了一系列的限制。具体可以看这里：[问题详情](https://github.com/transitive-bullshit/chatgpt-api#update-december-11-2022)，所以我改用官方自己的了，目前机器人可用。

## 依赖

1.  Node.js >= v18.0 ，版本太低会导致运行报错,最好使用 LTS 版本。
2. 先获取自己的 `api key`，地址戳这里 👉🏻 ：[创建你的 api key](https://beta.openai.com/account/api-keys)

![](https://assets.fedtop.com/picbed/202212121817351.png)

3. 创建完了， 复制下来，然后在项目根目录下创建一个 `.env` 文件，内容如下：

```sh
# 执行下面命令，拷贝一份 .env.example 文件
cp .env.example .env
# 完善.env 文件内容
OPENAI_API_KEY='你的key'
```

4. 运行服务

```sh
# 安装依赖
npm i
# 启动服务
npm run dev
```

然后就可以扫码登录了，然后根据你的需求，自己修改相关逻辑文件。

![](https://assets.fedtop.com/picbed/202212071315670.png)

## 你要修改的

很多人说运行后不会自动收发信息，不是的哈，为了防止给每一条收到的消息都自动回复（太恐怖了），所以加了限制条件。

你要把下面提到的地方自定义修改下。

- 群聊，记得把机器人名称改成你自己微信号的名称，然后添加对应群聊的名称到白名单中，这样就可以自动回复群聊消息了。
- 私聊，记得把需要自动回复的好友名称添加到白名单中，这样就可以自动回复私聊消息了。

文件是 👉🏻 [sendMessage.js](./src/wechaty/sendMessage.js)

![](https://assets.fedtop.com/picbed/202212110942315.png)

可以看到，自动回复都是基于 `chatgpt` 的，记得要开代理。

![](https://assets.fedtop.com/picbed/202212131123257.png)

## 如果你使用 Docker

```sh
$ docker build . -t wechat-bot

$ docker run -d --rm --name wechat-bot -v $(pwd)/config.js:/app/config.js -v $(pwd)/.env:/app/.env wechat-bot
```
