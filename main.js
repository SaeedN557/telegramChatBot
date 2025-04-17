addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const secret = '123456'

  const BOT_TOKEN = '7947303703:AAGqVPm13W1Vk4E1GADUpO0X2t4DQkT4mM0'

  if (url.pathname === `/registerWebhook`) {
    const webhookUrl = `https://${url.hostname}/${secret}`
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl })
    })
    const data = await response.json()
    return new Response(JSON.stringify(data), { status: 200 })
  }

  if (url.pathname === `/${secret}` && request.method === 'POST') {
    const update = await request.json()
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id
      const text = update.message.text
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: `Echo: ${text}` })
      })
    }
    return new Response('OK', { status: 200 })
  }

  return new Response('Not Found', { status: 404 })
}
