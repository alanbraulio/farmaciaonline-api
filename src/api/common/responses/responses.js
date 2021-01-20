exports.errorResponse = (res, error) => {
  return (
      res.status(500).json({
          error: error,
          message: error.message
      })
  )
}

exports.unauthorizedResponse = (res, message) => {
  return (
      res.status(401).json({
          message: `Falha na autenticação - ${message}`
      })
  )
}

exports.successResponse = (res, message) => {
  return (
      res.status(200).json(message)
      )
}

exports.badRequest = (res, message) => {
  return (
      res.status(400).json(message)
  )
}

exports.createdResponse = (res, userInfos) => {
  return (
      res.status(201).json(userInfos)
  )
}

const responseJSON = (responseObj) => {
  const { value = [], message = '', attributes = {} } = responseObj;

  return {
      value: value,
      message: message,
      ...attributes
 }
}

exports.response = (res, responseObj) => {
  const status = responseObj.status ? responseObj.status : 200; 

  return (
      res.status(status).json(responseJSON(responseObj))
  )
}