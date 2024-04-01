import "@testing-library/jest-dom";

import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './mocks/server'

// Establishing API mocking before all tests
beforeAll(() => {
    server.listen()
})

// Reset any request handlers that we may add during the test
// so we don'y affect other tests
afterEach(() => {
    server.resetHandlers()
})

//clean up after the tests are finished
afterAll(() => {
    server.close()
})