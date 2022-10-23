function checkUrlValidity(url) {
  if (!/https?:\/\/[\w-]+.[a-z.]+[/*[a-z#]+]?/gim.test(url)) {
    throw new Error('Incorrect url format');
  }
  return url;
}

module.exports = {
  checkUrlValidity,
};
