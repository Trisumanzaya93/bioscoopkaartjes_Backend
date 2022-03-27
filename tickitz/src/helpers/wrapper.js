module.exports = {
  response: (response, status, msg, data, pagination, error) => {
    const result = {
      status: status || 200,
      msg,
      data,
      pagination,
      error,
    };
    return response.status(result.status).json(result);
  },
};
