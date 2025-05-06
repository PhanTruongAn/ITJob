export function replacePathParamsWithQuery(path: any, newData: any) {
  let newPath = path;
  Object.keys(newData).forEach((it) => {
    newPath = newPath.replace(`:${it}`, newData[it]);
  });
  return newPath;
}
