export function success (body) {
  return buildResponse(200, {
    status: true,
    body
  })
}

export function failure (message) {
  return buildResponse(500, {
    status: false,
    message: message
  })
}

function buildResponse (statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  }
}
