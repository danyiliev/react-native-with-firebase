export const mergeConnections = (orgAry, newAry = []) => {
  const filtered = newAry.filter(conn => orgAry.findIndex(orgConn => orgConn.id === conn.id) === -1);
  return [...orgAry, ...filtered];
}