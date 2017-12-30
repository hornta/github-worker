module.exports = (githubUrl) => {
  if(typeof githubUrl !== 'string') {
    throw new Error('Bad input');
  }
  const urlParts = githubUrl.split('/');
  const name = urlParts[urlParts.length - 1];
  const owner = urlParts[urlParts.length - 2];

  return { owner, name };
}