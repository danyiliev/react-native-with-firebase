export const mergePosts = (orgAry, newAry = []) => {
  const filtered = newAry.filter(post => orgAry.findIndex(orgPost => orgPost.id === post.id) === -1);
  return [...orgAry, ...filtered];
}