import { http, HttpResponse, delay } from 'msw'
 
const localHost = 'http://localhost:3030'
export const handlers = [
  http.get(`${localHost}/scoops`, () => {
    return HttpResponse.json([
        {name: 'Chocolate', imagePath: '/images/chocolate.png'},
        {name: 'Vanilla',imagePath: '/images/vanilla.png'}
    ])
  }),
  http.get(`${localHost}/toppings`, () => {
    return HttpResponse.json([
      { name: 'Cherries', imagePath: '/images/cherries.png' },
      { name: 'M&Ms', imagePath: '/images/m-and-ms.png' },
      { name: 'Hot fudge', imagePath: '/images/hot-fudge.png' },
    ])
  }),
  http.post(`${localHost}/order`, async () => {
    await delay(800)
    return HttpResponse.json({ orderNumber: 10 }, {status: 201})
  })
]